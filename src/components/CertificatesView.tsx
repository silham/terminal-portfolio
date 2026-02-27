'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import type { Certificate } from '@/types';

type SortField = 'date' | 'topic' | 'issuer';
type SortDir = 'asc' | 'desc';

interface CertificatesViewProps {
  certificates: Certificate[];
  isActive: boolean;
}

function sortCerts(
  list: Certificate[],
  field: SortField,
  dir: SortDir,
): Certificate[] {
  return [...list].sort((a, b) => {
    const av = field === 'topic' ? a.topic : field === 'issuer' ? a.issuer : a.date;
    const bv = field === 'topic' ? b.topic : field === 'issuer' ? b.issuer : b.date;
    if (av < bv) return dir === 'asc' ? -1 : 1;
    if (av > bv) return dir === 'asc' ? 1 : -1;
    return 0;
  });
}

const ROW_HEIGHT_PX = 24;
const TILDE_BUFFER = 6;

export function CertificatesView({ certificates, isActive }: CertificatesViewProps) {
  const router = useRouter();
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [tildeCount, setTildeCount] = useState(10);

  const containerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const sorted = useMemo(
    () => sortCerts(certificates, sortField, sortDir),
    [certificates, sortField, sortDir],
  );

  const { activeIndex } = useKeyboardNavigation({
    itemCount: sorted.length,
    direction: 'vertical',
    initialIndex: 0,
    loop: false,
    disabled: !isActive,
    onSelect: (i) => router.push(`/certificates/${sorted[i].slug}`),
  });

  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  useEffect(() => {
    rowRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  // Calculate tilde fill
  useEffect(() => {
    if (!tableRef.current || !containerRef.current) return;
    const obs = new ResizeObserver(() => {
      const containerH = containerRef.current!.clientHeight;
      const tableH = tableRef.current!.offsetHeight;
      const remaining = containerH - tableH - ROW_HEIGHT_PX;
      setTildeCount(Math.max(0, Math.floor(remaining / ROW_HEIGHT_PX) + TILDE_BUFFER));
    });
    obs.observe(containerRef.current);
    obs.observe(tableRef.current);
    return () => obs.disconnect();
  }, [sorted.length]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sortIndicator = (field: SortField) =>
    sortField === field ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  return (
    <div
      ref={containerRef}
      className="flex flex-col flex-1 overflow-hidden text-sm"
    >
      {/* ── Desktop table ──────────────────────────────────────────────── */}
      <div
        ref={tableRef}
        className="hidden md:block overflow-x-auto no-scrollbar"
      >
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col style={{ width: '130px' }} />
            <col style={{ width: '380px' }} />
            <col style={{ width: '200px' }} />
            <col />
          </colgroup>
          <thead>
            <tr className="border-b border-gray-800">
              <th
                className="py-1.5 px-3 text-left text-gray-400 font-normal cursor-pointer hover:text-gray-200 select-none"
                onClick={() => toggleSort('date')}
              >
                Date{sortIndicator('date')}
              </th>
              <th className="py-1.5 px-3 text-left text-gray-400 font-normal select-none">
                Certificate name
              </th>
              <th
                className="py-1.5 px-3 text-left text-gray-400 font-normal cursor-pointer hover:text-gray-200 select-none"
                onClick={() => toggleSort('topic')}
              >
                Topic{sortIndicator('topic')}
              </th>
              <th
                className="py-1.5 px-3 text-left text-gray-400 font-normal cursor-pointer hover:text-gray-200 select-none"
                onClick={() => toggleSort('issuer')}
              >
                Company/Issuer{sortIndicator('issuer')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((cert, i) => {
              const active = i === activeIndex;
              return (
                <tr
                  key={cert.id}
                  ref={(el) => { rowRefs.current[i] = el; }}
                  data-terminal-item
                  tabIndex={0}
                  onClick={() => router.push(`/certificates/${cert.slug}`)}
                  className={[
                    'cursor-pointer transition-colors',
                    active
                      ? 'bg-gray-200 text-black'
                      : 'hover:bg-gray-900 text-gray-300',
                  ].join(' ')}
                >
                  <td className="py-1 px-3 text-gray-400 whitespace-nowrap">
                    {cert.date}
                  </td>
                  <td className="py-1 px-3 truncate">{cert.title}</td>
                  <td className={`py-1 px-3 truncate ${active ? 'text-gray-700' : 'text-gray-400'}`}>
                    {cert.topic}
                  </td>
                  <td className={`py-1 px-3 truncate ${active ? 'text-gray-700' : 'text-gray-500'}`}>
                    {cert.issuer}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Tilde fill */}
        <div aria-hidden="true" className="px-3 mt-0.5 select-none">
          {Array.from({ length: tildeCount }).map((_, i) => (
            <div key={i} className="text-gray-700 leading-6">~</div>
          ))}
        </div>
      </div>

      {/* ── Mobile stacked list ─────────────────────────────────────────── */}
      <div className="md:hidden overflow-y-auto no-scrollbar flex-1 px-4 py-2 space-y-3">
        {sorted.map((cert, i) => {
          const active = i === activeIndex;
          return (
            <div
              key={cert.id}
              onClick={() => router.push(`/certificates/${cert.slug}`)}
              className={[
                'border p-3 cursor-pointer',
                active
                  ? 'border-gray-400 bg-gray-900'
                  : 'border-gray-800 hover:border-gray-600',
              ].join(' ')}
            >
              <p className="text-gray-200 text-sm leading-snug">{cert.title}</p>
              <p className="text-gray-500 text-xs mt-1">{cert.date}</p>
              <p className="text-gray-400 text-xs mt-0.5">{cert.topic} · {cert.issuer}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
