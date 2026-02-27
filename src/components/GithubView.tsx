'use client';

import { useState } from 'react';
import type { ActivityDay, GHContribution } from '@/lib/github';

// ─────────────────────────────────────────────────────────────────────────────

interface GithubViewProps {
  activity: ActivityDay[];
  contributions: GHContribution[];
}

const SEPARATOR = '='.repeat(70);
const DASH_SEP = '-'.repeat(70);

type SortMode = 'popularity' | 'recent';

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function GithubView({ activity, contributions }: GithubViewProps) {
  const [sortMode, setSortMode] = useState<SortMode>('popularity');

  const sorted =
    sortMode === 'popularity'
      ? [...contributions].sort((a, b) => {
          const sa = parseInt(a.stars) || 0;
          const sb = parseInt(b.stars) || 0;
          return sb - sa;
        })
      : contributions; // already sorted by recent push from API

  // ── Activity graph helpers ────────────────────────────────────────────────
  const maxCount = Math.max(...activity.map((d) => d.count), 1);
  const BAR_MAX_H = 80; // px

  // Boundary labels for axis
  const firstLabel = activity[0]?.label ?? '';
  const lastLabel = activity[activity.length - 1]?.label ?? '';

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4 text-sm">
      <div className="max-w-2xl mx-auto">

        {/* ── Heading ────────────────────────────────────────────────── */}
        <h1 className="text-gray-200 font-normal mb-0"># Open source work</h1>
        <p aria-hidden="true" className="text-gray-200 mb-5 overflow-hidden whitespace-nowrap">
          {SEPARATOR}
        </p>

        {/* ── Description ────────────────────────────────────────────── */}
        <p className="text-gray-400 leading-relaxed mb-4">
          In modern system development, effective monitoring and logging are
          crucial for maintaining reliability and performance. Monitoring provides
          real-time insights into the system&apos;s health, helping developers and
          operators detect and address issues before they impact users.
        </p>

        {/* ── Profile links ──────────────────────────────────────────── */}
        <p className="text-gray-400 mb-8">
          My profiles:{' '}
          <a
            href="https://github.com/silham"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-200 border border-gray-700 px-1.5 hover:bg-gray-200 hover:text-black transition-colors"
          >
            [github:@silham]
          </a>{' '}
          <a
            href="https://gitlab.com/silham"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-200 border border-gray-700 px-1.5 hover:bg-gray-200 hover:text-black transition-colors"
          >
            [gitlab:@silham]
          </a>
        </p>

        {/* ── Activity Graph ─────────────────────────────────────────── */}
        <h2 className="text-gray-200 font-normal mb-0">## Activity Graph</h2>
        <p aria-hidden="true" className="text-gray-200 mb-4 overflow-hidden whitespace-nowrap">
          {SEPARATOR}
        </p>

        {activity.length > 0 ? (
          <div className="mb-8">
            {/* Bar chart — 30 daily bars */}
            <div className="flex items-end gap-[2px] h-[100px]">
              {activity.map((day, i) => {
                const h = day.count > 0 ? Math.max(4, (day.count / maxCount) * BAR_MAX_H) : 2;
                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center justify-end relative group/bar"
                  >
                    {/* Hover tooltip */}
                    <span className="absolute -top-5 text-[10px] text-gray-200 whitespace-nowrap opacity-0 group-hover/bar:opacity-100 pointer-events-none transition-opacity">
                      {day.count}
                    </span>
                    <div
                      className={[
                        'w-full transition-colors cursor-default',
                        day.count > 0
                          ? 'bg-gray-600 group-hover/bar:bg-white'
                          : 'bg-gray-800',
                      ].join(' ')}
                      style={{ height: `${h}px` }}
                      title={`${day.label}: ${day.count} pushes`}
                    />
                  </div>
                );
              })}
            </div>
            {/* Axis labels */}
            <div className="flex justify-between mt-1 text-gray-500 text-xs">
              <span>{firstLabel}</span>
              <span>{lastLabel}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 mb-8">No recent activity data available.</p>
        )}

        {/* ── My Contributions ───────────────────────────────────────── */}
        <div className="flex items-baseline gap-6 mb-0 flex-wrap">
          <h2 className="text-gray-200 font-normal">## My contributions</h2>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            Order by:{' '}
            <button
              onClick={() => setSortMode('popularity')}
              className={[
                'border px-1.5 cursor-pointer transition-colors',
                sortMode === 'popularity'
                  ? 'border-gray-400 bg-gray-200 text-black'
                  : 'border-gray-700 text-gray-300 hover:border-gray-500',
              ].join(' ')}
            >
              [Popularity]
            </button>{' '}
            <button
              onClick={() => setSortMode('recent')}
              className={[
                'border px-1.5 cursor-pointer transition-colors',
                sortMode === 'recent'
                  ? 'border-gray-400 bg-gray-200 text-black'
                  : 'border-gray-700 text-gray-300 hover:border-gray-500',
              ].join(' ')}
            >
              [Recent updates]
            </button>
          </div>
        </div>
        <p aria-hidden="true" className="text-gray-200 mb-4 overflow-hidden whitespace-nowrap">
          {SEPARATOR}
        </p>

        {/* Repo cards */}
        <div className="space-y-0">
          {sorted.map((repo, i) => (
            <div key={repo.name}>
              <div className="py-3 space-y-1">
                {/* Key-value rows */}
                {[
                  { label: 'name:', value: repo.name },
                  { label: 'about:', value: repo.description ?? '—' },
                  { label: 'stars:', value: repo.stars },
                  {
                    label: 'Commits:',
                    value: repo.lastCommit
                      ? `My last commit: ${repo.lastCommit}${repo.commitMessage ? ` ( ${repo.commitMessage} )` : ''}`
                      : '—',
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-3">
                    <span className="text-gray-500 w-20 shrink-0 text-right">{label}</span>
                    <span className="text-gray-300">{value}</span>
                  </div>
                ))}
              </div>
              {/* Separator between repos */}
              {i < sorted.length - 1 && (
                <p aria-hidden="true" className="text-gray-800 overflow-hidden whitespace-nowrap">
                  {DASH_SEP}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
