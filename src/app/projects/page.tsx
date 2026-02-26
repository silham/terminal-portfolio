import { PortfolioShell } from '@/components/PortfolioShell';
import { ProjectsView } from '@/components/ProjectsView';
import { PROJECTS } from '@/data';

export default function ProjectsPage() {
  return (
    <PortfolioShell>
      <ProjectsView projects={PROJECTS} isActive={true} />
    </PortfolioShell>
  );
}
