import { PortfolioShell } from '@/components/PortfolioShell';
import { EmptyView } from '@/components/EmptyView';

export default function AboutPage() {
  return (
    <PortfolioShell>
      <EmptyView label="About" />
    </PortfolioShell>
  );
}
