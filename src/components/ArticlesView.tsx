'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import type { Article } from '@/types';

type SortField = 'date' | 'comments' | 'category';
type SortDir = 'asc' | 'desc';

interface ArticlesViewProps {
  articles: Article[];
  /** Whether this view is the active tab (controls keyboard capture). */
  isActive: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function sortArticles(
  list: Article[],
  field: SortField,
  dir: SortDir,
): Article[] {
  return [...list].sort((a, b) => {
    let av: string | number;
    let bv: string | number;
    if (field === 'comments') {
      av = a.comments;
      bv = b.comments;
    } else if (field === 'category') {
      av = a.category;
      bv = b.category;
    } else {
      av = a.date;
      bv = b.date;
    }
    if (av < bv) return dir === 'asc' ? -1 : 1;
    if (av > bv) return dir === 'asc' ? 1 : -1;
    return 0;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/** Approximate line-height in px used to calculate tilde count. */
const ROW_HEIGHT_PX = 24;
/** Extra rows to always render so the list looks filled. */
const TILDE_BUFFER = 6;

export function ArticlesView({ articles, isActive }: ArticlesViewProps) {
  const router = useRouter();
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [tildeCount, setTildeCount] = useState(10);

  const containerRef = useRef<HTMLDivElement>(null);
  const sorted = sortArticles(articles, sortField, sortDir);

  const { activeIndex, isActive: isRowActive } = useKeyboardNavigation({
    itemCount: sorted.length,
    direction: 'vertical',
    initialIndex: 0,
    loop: false,
    disabled: !isActive,
    onSelect: (i) => router.push(`/articles/${sorted[i].slug}`),
  });

  // ── Keep the active row scrolled into view ──────────────────────────────
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  useEffect(() => {
    rowRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  // ── Calculate how many tilde lines fill remaining space ─────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const calc = () => {
      const total = containerRef.current!.clientHeight;
      const headerRows = 2; // column header + sort bar
      const contentRows = sorted.length + headerRows;
      const usedPx = contentRows * ROW_HEIGHT_PX;
      const remaining = Math.max(0, total - usedPx);
      setTildeCount(Math.floor(remaining / ROW_HEIGHT_PX) + TILDE_BUFFER);
    };
    calc();
    const obs = new ResizeObserver(calc);
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [sorted.length]);

  // ── Sort toggle ──────────────────────────────────────────────────────────
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sortIndicator = (field: SortField) =>
    sortField === field ? (sortDir === 'desc' ? ' ▼' : ' ▲') : '';

  return (
    <div
      ref={containerRef}
      className="flex flex-col flex-1 overflow-hidden text-sm"
    >
      {/* ── Sort bar ── */}
      <div className="flex items-center gap-2 px-4 py-1 border-b border-gray-800 text-gray-400 shrink-0">
        <span>Sort:</span>
        <button
          onClick={() => toggleSort('date')}
          className={`cursor-pointer hover:text-gray-200 focus:outline-none
            ${sortField === 'date' ? 'text-gray-200' : ''}`}
        >
          Date{sortIndicator('date')}
        </button>
      </div>

      {/* ── Desktop: full table with all columns ── */}
      <div className="hidden md:block overflow-y-auto no-scrollbar flex-1">
        {/*
          table-fixed + w-full: rows span full width for the inverted highlight,
          but column widths are pinned so Comments/Category sit right of Article
          instead of being pushed to the far right edge.
          The empty 5th <col> absorbs whatever space remains.
        */}
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col style={{ width: '130px' }} />
            <col style={{ width: '460px' }} />
            <col style={{ width: '90px' }} />
            <col style={{ width: '160px' }} />
            <col />
          </colgroup>
          <thead>
            <tr className="border-b border-gray-800 text-gray-500">
              <th className="text-left font-normal px-4 py-1 whitespace-nowrap">Date</th>
              <th className="text-left font-normal px-2 py-1">Article</th>
              <th
                className="text-left font-normal px-4 py-1 whitespace-nowrap cursor-pointer hover:text-gray-300"
                onClick={() => toggleSort('comments')}
              >
                Comments{sortIndicator('comments')}
              </th>
              <th
                className="text-left font-normal px-4 py-1 whitespace-nowrap cursor-pointer hover:text-gray-300"
                onClick={() => toggleSort('category')}
              >
                Category{sortIndicator('category')}
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sorted.map((article, i) => {
              const active = isActive && isRowActive(i);
              return (
                <tr
                  key={article.id}
                  ref={(el) => { rowRefs.current[i] = el; }}
                  data-terminal-item
                  aria-selected={active}
                  onClick={() => router.push(`/articles/${article.slug}`)}
                  className={[
                    'cursor-pointer select-none',
                    active ? 'bg-gray-200 text-black' : 'text-gray-300 hover:bg-gray-900',
                  ].join(' ')}
                >
                  <td className="px-4 py-0.5 whitespace-nowrap text-xs leading-6">{article.date}</td>
                  <td className="px-2 py-0.5 leading-6 truncate">{article.title}</td>
                  <td className="px-4 py-0.5 leading-6">{article.comments}</td>
                  <td className={['px-4 py-0.5 leading-6', active ? 'text-black' : 'text-gray-500'].join(' ')}>
                    {article.category}
                  </td>
                  <td />
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Vim-style empty lines — desktop */}
        <div aria-hidden="true" className="px-4 text-gray-700 leading-6">
          {Array.from({ length: tildeCount }, (_, i) => (
            <div key={i}>~</div>
          ))}
        </div>
      </div>

      {/* ── Mobile: stacked list (date above title, no columns) ── */}
      <div className="md:hidden overflow-y-auto no-scrollbar flex-1">
        {/* Column header */}
        <div className="px-4 py-1 border-b border-gray-800 text-gray-500 text-sm">
          Article
        </div>
        <ul>
          {sorted.map((article, i) => {
            const active = isActive && isRowActive(i);
            return (
              <li
                key={article.id}
                ref={(el) => { rowRefs.current[i] = el as unknown as HTMLTableRowElement; }}
                data-terminal-item
                aria-selected={active}
                onClick={() => router.push(`/articles/${article.slug}`)}
                className={[
                  'px-4 py-2 cursor-pointer select-none border-b border-gray-900',
                  active ? 'bg-gray-200 text-black' : 'text-gray-300',
                ].join(' ')}
              >
                <div className={['text-xs mb-0.5', active ? 'text-black' : 'text-gray-500'].join(' ')}>
                  {article.date}
                </div>
                <div className="text-sm leading-snug">{article.title}</div>
              </li>
            );
          })}
        </ul>

        {/* Vim-style empty lines — mobile */}
        <div aria-hidden="true" className="px-4 text-gray-700 leading-6 mt-1">
          {Array.from({ length: Math.max(0, tildeCount - 4) }, (_, i) => (
            <div key={i}>~</div>
          ))}
        </div>
      </div>

    </div>
  );
}
