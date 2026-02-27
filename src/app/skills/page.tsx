import { PortfolioShell } from '@/components/PortfolioShell';
import { SkillsView } from '@/components/SkillsView';
import { SKILLS } from '@/data';

export default function SkillsPage() {
  return (
    <PortfolioShell>
      <SkillsView categories={SKILLS} />
    </PortfolioShell>
  );
}
