'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import type { Project } from '@/types';

type SortField = 'date' | 'technology';
type SortDir = 'asc' | 'desc';

interface ProjectsViewProps {
  projects: Project[];
  isActive: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function sortProjects(list: Project[], field: SortField, dir: SortDir): Project[] {
  return [...list].sort((a, b) => {
    const av = field === 'technology' ? a.technology : a.date;
    const bv = field === 'technology' ? b.technology : b.date;
    if (av < bv) return dir === 'asc' ? -1 : 1;
    if (av > bv) return dir === 'asc' ? 1 : -1;
    return 0;
  });
}

const ROW_HEIGHT_PX = 24;
const TILDE_BUFFER = 6;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function ProjectsView({ projects, isActive }: ProjectsViewProps) {
  const router = useRouter();
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [filterTech, setFilterTech] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);
  const [tildeCount, setTildeCount] = useState(10);

  const containerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Unique technology options for filter dropdown
  const techOptions = useMemo(() => {
    const set = new Set(projects.map((p) => p.technology));
    return ['All', ...Array.from(set).sort()];
  }, [projects]);

  // Apply sort + filter
  const filtered = useMemo(() => {
    const base = filterTech === 'All' ? projects : projects.filter((p) => p.technology === filterTech);
    return sortProjects(base, sortField, sortDir);
  }, [projects, filterTech, sortField, sortDir]);

  const { activeIndex, isActive: isRowActive } = useKeyboardNavigation({
    itemCount: filtered.length,
    direction: 'vertical',
    initialIndex: 0,
    loop: false,
    disabled: !isActive,
    onSelect: (i) => router.push(`/projects/${filtered[i].slug}`),
  });

  const focused = filtered[activeIndex] ?? null;

  // Keep active row scrolled into view
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  useEffect(() => {
    rowRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  // Calculate tilde fill
  useEffect(() => {
    if (!tableRef.current) return;
    const calc = () => {
      const total = tableRef.current!.clientHeight;
      const headerRows = 2;
      const contentRows = filtered.length + headerRows;
      const usedPx = contentRows * ROW_HEIGHT_PX;
      const remaining = Math.max(0, total - usedPx);
      setTildeCount(Math.floor(remaining / ROW_HEIGHT_PX) + TILDE_BUFFER);
    };
    calc();
    const obs = new ResizeObserver(calc);
    obs.observe(tableRef.current);
    return () => obs.disconnect();
  }, [filtered.length]);

  // Close filter dropdown on outside click
  useEffect(() => {
    if (!filterOpen) return;
    const handle = () => setFilterOpen(false);
    window.addEventListener('click', handle);
    return () => window.removeEventListener('click', handle);
  }, [filterOpen]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
  };

  const sortIndicator = (field: SortField) =>
    sortField === field ? (sortDir === 'desc' ? ' ▼' : ' ▲') : '';

  return (
    <div ref={containerRef} className="flex flex-col flex-1 overflow-hidden text-sm">

      {/* ── Sort / Filter bar ── */}
      <div className="flex items-center gap-4 px-4 py-1 border-b border-gray-800 text-gray-400 shrink-0">
        <span>Sort:</span>
        <button
          onClick={() => toggleSort('date')}
          className={`cursor-pointer hover:text-gray-200 focus:outline-none ${sortField === 'date' ? 'text-gray-200' : ''}`}
        >
          Date{sortIndicator('date')}
        </button>

        <span className="text-gray-700">|</span>

        <span>Filter:</span>
        {/* Custom dropdown */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className="flex items-center gap-1 cursor-pointer hover:text-gray-200 focus:outline-none text-gray-200"
          >
            {filterTech} ▾
          </button>
          {filterOpen && (
            <ul className="absolute left-0 top-full mt-0.5 z-10 border border-gray-700 bg-black text-gray-300 min-w-[140px]">
              {techOptions.map((t) => (
                <li
                  key={t}
                  onClick={() => { setFilterTech(t); setFilterOpen(false); }}
                  className={`px-3 py-1 cursor-pointer hover:bg-gray-900 hover:text-gray-100 ${t === filterTech ? 'text-gray-100' : ''}`}
                >
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Main area ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Desktop table (left pane) ── */}
        <div ref={tableRef} className="hidden md:flex flex-col flex-1 overflow-y-auto no-scrollbar">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col style={{ width: '130px' }} />
              <col style={{ width: '460px' }} />
              <col style={{ width: '180px' }} />
              <col />
            </colgroup>
            <thead>
              <tr className="border-b border-gray-800 text-gray-500">
                <th className="text-left font-normal px-4 py-1 whitespace-nowrap">Date</th>
                <th className="text-left font-normal px-2 py-1">Project name</th>
                <th
                  className="text-left font-normal px-4 py-1 whitespace-nowrap cursor-pointer hover:text-gray-300"
                  onClick={() => toggleSort('technology')}
                >
                  Technology{sortIndicator('technology')}
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((project, i) => {
                const active = isActive && isRowActive(i);
                return (
                  <tr
                    key={project.id}
                    ref={(el) => { rowRefs.current[i] = el; }}
                    data-terminal-item
                    aria-selected={active}
                    onClick={() => router.push(`/projects/${project.slug}`)}
                    className={[
                      'cursor-pointer select-none',
                      active ? 'bg-gray-200 text-black' : 'text-gray-300 hover:bg-gray-900',
                    ].join(' ')}
                  >
                    <td className="px-4 py-0.5 whitespace-nowrap text-xs leading-6">{project.date}</td>
                    <td className="px-2 py-0.5 leading-6 truncate">{project.title}</td>
                    <td className={['px-4 py-0.5 leading-6', active ? 'text-black' : 'text-gray-500'].join(' ')}>
                      {project.technology}
                    </td>
                    <td />
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Vim-style tilde fill */}
          <div aria-hidden="true" className="px-4 text-gray-700 leading-6">
            {Array.from({ length: tildeCount }, (_, i) => (
              <div key={i}>~</div>
            ))}
          </div>
        </div>

        {/* ── Preview panel (right pane, desktop only) ── */}
        <aside className="hidden md:flex flex-col w-72 shrink-0 border-l border-gray-800 overflow-y-auto no-scrollbar p-4 gap-3">
          {/* Comment header */}
          <p className="text-gray-600 text-xs leading-5">
            # The currently selected / focused project
          </p>

          {focused ? (
            <>
              {/* Screenshot / placeholder */}
              <div className="border border-gray-800 w-full aspect-video overflow-hidden bg-gray-950 flex items-center justify-center">
                {focused.image ? (
                  <Image
                    src={focused.image}
                    alt={focused.title}
                    width={256}
                    height={144}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-700 text-xs">[no preview]</span>
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <p className="text-gray-400 text-xs leading-5">
                {focused.excerpt}
              </p>

              {/* See details link */}
              <button
                onClick={() => router.push(`/projects/${focused.slug}`)}
                className="text-left text-gray-300 text-xs hover:text-gray-100 focus:outline-none w-fit"
              >
                See details ›
              </button>
            </>
          ) : (
            <p className="text-gray-700 text-xs">No project selected.</p>
          )}
        </aside>

        {/* ── Mobile: stacked list ── */}
        <div className="md:hidden flex-1 overflow-y-auto no-scrollbar">
          <div className="px-4 py-1 border-b border-gray-800 text-gray-500 text-sm">
            Project name
          </div>
          <ul>
            {filtered.map((project, i) => {
              const active = isActive && isRowActive(i);
              return (
                <li
                  key={project.id}
                  ref={(el) => { rowRefs.current[i] = el as unknown as HTMLTableRowElement; }}
                  data-terminal-item
                  aria-selected={active}
                  onClick={() => router.push(`/projects/${project.slug}`)}
                  className={[
                    'px-4 py-2 cursor-pointer select-none border-b border-gray-900',
                    active ? 'bg-gray-200 text-black' : 'text-gray-300',
                  ].join(' ')}
                >
                  <div className={['text-xs mb-0.5', active ? 'text-black' : 'text-gray-500'].join(' ')}>
                    {project.date}
                  </div>
                  <div className="text-sm leading-snug">{project.title}</div>
                  <div className={['text-xs mt-0.5', active ? 'text-black' : 'text-gray-600'].join(' ')}>
                    {project.technology}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

      </div>
    </div>
  );
}
