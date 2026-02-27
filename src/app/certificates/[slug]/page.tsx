import { notFound } from 'next/navigation';
import { PortfolioShell } from '@/components/PortfolioShell';
import { CertificateDetailView } from '@/components/CertificateDetailView';
import { CERTIFICATES } from '@/data';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CERTIFICATES.map((c) => ({ slug: c.slug }));
}

export default async function CertificateDetailPage({ params }: Props) {
  const { slug } = await params;
  const certificate = CERTIFICATES.find((c) => c.slug === slug);
  if (!certificate) notFound();

  return (
    <PortfolioShell>
      <CertificateDetailView
        certificate={certificate}
        allCertificates={CERTIFICATES}
        isActive
      />
    </PortfolioShell>
  );
}
