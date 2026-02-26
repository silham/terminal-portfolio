import { notFound } from 'next/navigation';
import { ARTICLES } from '@/data';
import { PortfolioShell } from '@/components/PortfolioShell';
import { ArticleDetailView } from '@/components/ArticleDetailView';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <PortfolioShell>
      <ArticleDetailView
        article={article}
        allArticles={ARTICLES}
        isActive={true}
      />
    </PortfolioShell>
  );
}
