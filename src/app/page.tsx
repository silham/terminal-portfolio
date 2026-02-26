import { PortfolioShell } from '@/components/PortfolioShell';
import { ArticlesView } from '@/components/ArticlesView';
import { ARTICLES } from '@/data';

export default function Home() {
  return (
    <PortfolioShell>
      <ArticlesView articles={ARTICLES} isActive={true} />
    </PortfolioShell>
  );
}
