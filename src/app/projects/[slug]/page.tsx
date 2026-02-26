import { notFound } from 'next/navigation';
import { PortfolioShell } from '@/components/PortfolioShell';
import { EmptyView } from '@/components/EmptyView';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  if (!slug) notFound();

  return (
    <PortfolioShell>
      <EmptyView label={`Project: ${slug}`} />
    </PortfolioShell>
  );
}
