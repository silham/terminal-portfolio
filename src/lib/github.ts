// ─────────────────────────────────────────────────────────────────────────────
// Server-only helpers to fetch data from the GitHub REST API for @silham
// ─────────────────────────────────────────────────────────────────────────────

import type { GithubRepoEntry } from '@/types';

const GH_USER = 'silham';
const BASE = 'https://api.github.com';

const headers: HeadersInit = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'terminal-portfolio',
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

// ── Types ─────────────────────────────────────────────────────────────────────

/** One day in the activity graph */
export interface ActivityDay {
  /** e.g. "27 Feb" */
  label: string;
  /** ISO date key e.g. "2026-02-27" */
  date: string;
  count: number;
}

export interface GHContribution {
  name: string;
  description: string | null;
  stars: string;
  lastCommit: string;
  commitMessage: string;
  url: string;
}

// ── Events → Activity Graph (day-by-day, last 30 days) ──────────────────────
// Uses the GraphQL API contributionsCollection which includes private
// contributions (anonymized — only counts, no repo names or details).
// Falls back to the REST Events API if no GITHUB_TOKEN is configured.

const GQL = 'https://api.github.com/graphql';

async function fetchActivityGraphQL(): Promise<ActivityDay[] | null> {
  if (!process.env.GITHUB_TOKEN) return null;

  const from = new Date();
  from.setDate(from.getDate() - 29);
  from.setHours(0, 0, 0, 0);

  const to = new Date();
  to.setHours(23, 59, 59, 999);

  const query = `
    query($user: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $user) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(GQL, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          user: GH_USER,
          from: from.toISOString(),
          to: to.toISOString(),
        },
      }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    const json = await res.json();

    const weeks =
      json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
    if (!Array.isArray(weeks)) return null;

    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Flatten weeks → days
    const allDays: ActivityDay[] = [];
    for (const week of weeks) {
      for (const day of week.contributionDays) {
        const d = new Date(day.date);
        allDays.push({
          label: `${d.getDate()} ${MONTHS[d.getMonth()]}`,
          date: day.date,
          count: day.contributionCount,
        });
      }
    }

    // Only keep last 30 days
    const cutoff = from.toISOString().slice(0, 10);
    return allDays
      .filter((d) => d.date >= cutoff)
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return null;
  }
}

async function fetchActivityREST(): Promise<ActivityDay[]> {
  const allEvents: { type: string; created_at: string }[] = [];

  for (let page = 1; page <= 10; page++) {
    const res = await fetch(
      `${BASE}/users/${GH_USER}/events?per_page=30&page=${page}`,
      { headers, next: { revalidate: 3600 } },
    );
    if (!res.ok) break;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    allEvents.push(...data);
  }

  const pushEvents = allEvents.filter((e) => e.type === 'PushEvent');

  const dayMap = new Map<string, number>();
  for (const ev of pushEvents) {
    const key = ev.created_at.slice(0, 10);
    dayMap.set(key, (dayMap.get(key) ?? 0) + 1);
  }

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days: ActivityDay[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({
      label: `${d.getDate()} ${MONTHS[d.getMonth()]}`,
      date: key,
      count: dayMap.get(key) ?? 0,
    });
  }

  return days;
}

export async function fetchActivity(): Promise<ActivityDay[]> {
  // Try GraphQL first (includes private contributions)
  const graphql = await fetchActivityGraphQL();
  if (graphql && graphql.length > 0) return graphql;
  // Fall back to public-only REST API
  return fetchActivityREST();
}

// ── Contributions (from static repo list, dynamic stars & commits) ───────────

export async function fetchContributions(
  repos: GithubRepoEntry[],
): Promise<GHContribution[]> {
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const contributions: GHContribution[] = [];

  for (const entry of repos) {
    // Fetch repo metadata (stars, description, url)
    let description: string | null = entry.about;
    let starsCount = 0;
    let htmlUrl = `https://github.com/${entry.name}`;

    try {
      const res = await fetch(`${BASE}/repos/${entry.name}`, {
        headers,
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const repo = await res.json();
        description = repo.description ?? entry.about;
        starsCount = repo.stargazers_count ?? 0;
        htmlUrl = repo.html_url ?? htmlUrl;
      }
    } catch {
      // use defaults
    }

    // Fetch latest commit
    let commitMessage = '';
    let commitDate = '';
    try {
      const res = await fetch(
        `${BASE}/repos/${entry.name}/commits?per_page=1`,
        { headers, next: { revalidate: 3600 } },
      );
      if (res.ok) {
        const commits = await res.json();
        if (Array.isArray(commits) && commits.length > 0) {
          commitMessage = commits[0].commit?.message?.split('\n')[0] ?? '';
          const raw = commits[0].commit?.author?.date ?? '';
          if (raw) {
            const d = new Date(raw);
            commitDate = `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
          }
        }
      }
    } catch {
      // ignore
    }

    const stars =
      starsCount >= 1000
        ? `${(starsCount / 1000).toFixed(0)}k`
        : `${starsCount}`;

    contributions.push({
      name: entry.name,
      description,
      stars: `${stars} stars`,
      lastCommit: commitDate,
      commitMessage,
      url: htmlUrl,
    });
  }

  return contributions;
}
