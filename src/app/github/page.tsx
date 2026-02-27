import { PortfolioShell } from '@/components/PortfolioShell';
import { GithubView } from '@/components/GithubView';
import { fetchActivity, fetchContributions } from '@/lib/github';
import { GITHUB_REPOS } from '@/data';

export const revalidate = 3600; // ISR: re-fetch every hour

export default async function GithubPage() {
  const [activity, contributions] = await Promise.all([
    fetchActivity(),
    fetchContributions(GITHUB_REPOS),
  ]);

  return (
    <PortfolioShell>
      <GithubView activity={activity} contributions={contributions} />
    </PortfolioShell>
  );
}
