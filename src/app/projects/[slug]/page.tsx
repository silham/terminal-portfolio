import { notFound } from 'next/navigation';
import { PortfolioShell } from '@/components/PortfolioShell';
import { ProjectDetailView } from '@/components/ProjectDetailView';
import { PROJECTS } from '@/data';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <PortfolioShell>
      <ProjectDetailView project={project} allProjects={PROJECTS} isActive={true} />
    </PortfolioShell>
  );
}
