'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import type { Article } from '@/types';

interface ArticleDetailViewProps {
  article: Article;
  allArticles: Article[];
  /** Defaults to router.back() when omitted. */
  onBack?: () => void;
  /** When false the keyboard handlers are suppressed. */
  isActive: boolean;
}

const SEPARATOR = '='.repeat(70);

export function ArticleDetailView({
  article,
  allArticles,
  onBack,
  isActive,
}: ArticleDetailViewProps) {
  const router = useRouter();
  const handleBack = onBack ?? (() => router.back());
  const related = allArticles.filter((a) => a.id !== article.id).slice(0, 5);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ── Escape → go back to articles list ───────────────────────────────────
  useEffect(() => {
    if (!isActive) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleBack();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isActive, handleBack]);

  // ── Scroll to top whenever the article changes ───────────────────────────
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [article.id]);

  // ── Related articles keyboard navigation ─────────────────────────────────
  const { isActive: isRelatedActive } = useKeyboardNavigation({
    itemCount: related.length,
    direction: 'vertical',
    initialIndex: 0,
    loop: false,
    disabled: !isActive,
  });

  const relatedRowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  // ── Copy current URL to clipboard ────────────────────────────────────────
  const copyUrl = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden text-sm">

      {/* ──────────────────────────────────────────────────────────────────
          Left column — article content
      ────────────────────────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 min-w-0 overflow-y-auto no-scrollbar md:pl-72 px-6 py-4"
      >
        {/* Title */}
        <h1 className="text-gray-200 text-sm font-normal leading-relaxed mb-0">
          # {article.title}
        </h1>

        {/* Separator */}
        <p
          aria-hidden="true"
          className="text-gray-200 mb-5 overflow-hidden whitespace-nowrap"
        >
          {SEPARATOR}
        </p>

        {/* Body */}
        <div className="space-y-5 text-gray-300 leading-relaxed">
          {article.content.map((para, pi) => (
            <p key={pi}>
              {para.map((seg, si) =>
                seg.href ? (
                  <a
                    key={si}
                    href={seg.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-gray-200 hover:text-white"
                  >
                    {seg.text}
                  </a>
                ) : (
                  <span key={si}>{seg.text}</span>
                ),
              )}
            </p>
          ))}
        </div>

        {/* ── Metadata block — mobile only (below content) ── */}
        <div className="md:hidden mt-8 space-y-1.5 text-sm border-t border-gray-800 pt-4">
          {[
            { label: 'Author', value: article.author },
            { label: 'Date', value: article.date },
            { label: 'Category', value: article.category },
            { label: 'Length', value: `${article.wordCount} words` },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-3">
              <span className="text-gray-500 w-20 shrink-0">{label}</span>
              <span className="text-gray-200">{value}</span>
            </div>
          ))}
          <div className="flex gap-3">
            <span className="text-gray-500 w-20 shrink-0">Share URL</span>
            <button
              onClick={copyUrl}
              className="text-gray-200 border border-gray-600 px-1.5 text-xs
                         hover:bg-gray-200 hover:text-black transition-colors duration-100 cursor-pointer"
            >
              [copy]
            </button>
          </div>
        </div>

        {/* ── Related articles ── */}
        <div className="mt-8">
          <p className="text-gray-400 mb-2">Related articles</p>
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col style={{ width: '130px' }} />
              <col />
            </colgroup>
            <thead>
              <tr className="border-b border-gray-700 text-gray-500">
                <th className="text-left font-normal py-1">Date</th>
                <th className="text-left font-normal py-1">Article</th>
              </tr>
            </thead>
            <tbody>
              {related.map((r, i) => {
                const active = isActive && isRelatedActive(i);
                return (
                  <tr
                    key={r.id}
                    ref={(el) => { relatedRowRefs.current[i] = el; }}
                    data-terminal-item
                    aria-selected={active}
                    className={[
                      'cursor-default select-none',
                      active
                        ? 'bg-gray-200 text-black'
                        : 'text-gray-300 hover:bg-gray-900',
                    ].join(' ')}
                  >
                    <td className="py-0.5 text-xs leading-6 whitespace-nowrap">
                      {r.date}
                    </td>
                    <td className="py-0.5 leading-6 truncate">{r.title}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          Right column — metadata sidebar (desktop only)
      ────────────────────────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col gap-2 w-56 shrink-0 px-4 py-4 text-sm">
        {[
          { label: 'Author', value: article.author },
          { label: 'Date', value: article.date },
          { label: 'Category', value: article.category },
          { label: 'Length', value: `${article.wordCount} words` },
        ].map(({ label, value }) => (
          <div key={label} className="flex gap-3">
            <span className="text-gray-500 w-20 shrink-0">{label}</span>
            <span className="text-gray-200">{value}</span>
          </div>
        ))}
        <div className="flex gap-3">
          <span className="text-gray-500 w-20 shrink-0">Share URL</span>
          <button
            onClick={copyUrl}
            className="text-gray-200 border border-gray-600 px-1.5 text-xs
                       hover:bg-gray-200 hover:text-black transition-colors duration-100 cursor-pointer"
          >
            [copy]
          </button>
        </div>
      </aside>
    </div>
  );
}
