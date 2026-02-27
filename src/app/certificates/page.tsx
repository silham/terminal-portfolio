import { PortfolioShell } from '@/components/PortfolioShell';
import { CertificatesView } from '@/components/CertificatesView';
import { CERTIFICATES } from '@/data';

export default function CertificatesPage() {
  return (
    <PortfolioShell>
      <CertificatesView certificates={CERTIFICATES} isActive />
    </PortfolioShell>
  );
}
