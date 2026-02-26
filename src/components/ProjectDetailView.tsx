'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import type { Project } from '@/types';

interface ProjectDetailViewProps {
  project: Project;
  allProjects: Project[];
  onBack?: () => void;
  isActive: boolean;
}

const SEPARATOR = '='.repeat(70);

export function ProjectDetailView({
  project,
  allProjects,
  onBack,
  isActive,
}: ProjectDetailViewProps) {
  const router = useRouter();
  const handleBack = onBack ?? (() => router.back());
  const related = allProjects.filter((p) => p.id !== project.id).slice(0, 5);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ── Escape → back to projects list ──────────────────────────────────────
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

  // ── Scroll to top on project change ─────────────────────────────────────
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [project.id]);

  // ── Related projects keyboard navigation ─────────────────────────────────
  const { isActive: isRelatedActive } = useKeyboardNavigation({
    itemCount: related.length,
    direction: 'vertical',
    initialIndex: 0,
    loop: false,
    disabled: !isActive,
    onSelect: (i) => router.push(`/projects/${related[i].slug}`),
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
          Left column — project content
      ────────────────────────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 min-w-0 overflow-y-auto no-scrollbar md:pl-72 px-6 py-4"
      >
        {/* Comment-style heading */}
        <h1 className="text-gray-200 text-sm font-normal leading-relaxed mb-0">
          # {project.title}
        </h1>

        {/* Separator */}
        <p
          aria-hidden="true"
          className="text-gray-200 mb-5 overflow-hidden whitespace-nowrap"
        >
          {SEPARATOR}
        </p>

        {/* Screenshot */}
        {project.image && (
          <div className="mb-5 border border-gray-800 w-full max-w-lg overflow-hidden">
            <Image
              src={project.image}
              alt={project.title}
              width={640}
              height={360}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        )}

        {/* Excerpt / description */}
        <p className="text-gray-300 leading-relaxed mb-8">{project.excerpt}</p>

        {/* ── Metadata — mobile only ── */}
        <div className="md:hidden mt-4 space-y-1.5 text-sm border-t border-gray-800 pt-4">
          {[
            { label: 'Date', value: project.date },
            { label: 'Technology', value: project.technology },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-3">
              <span className="text-gray-500 w-24 shrink-0">{label}</span>
              <span className="text-gray-200">{value}</span>
            </div>
          ))}
          <div className="flex gap-3">
            <span className="text-gray-500 w-24 shrink-0">Share URL</span>
            <button
              onClick={copyUrl}
              className="text-gray-200 border border-gray-600 px-1.5 text-xs
                         hover:bg-gray-200 hover:text-black transition-colors duration-100 cursor-pointer"
            >
              [copy]
            </button>
          </div>
        </div>

        {/* ── Related projects ── */}
        <div className="mt-8">
          <p className="text-gray-400 mb-2">Related projects</p>
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col style={{ width: '130px' }} />
              <col style={{ width: '180px' }} />
              <col />
            </colgroup>
            <thead>
              <tr className="border-b border-gray-700 text-gray-500">
                <th className="text-left font-normal py-1">Date</th>
                <th className="text-left font-normal py-1">Technology</th>
                <th className="text-left font-normal py-1">Project</th>
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
                    onClick={() => router.push(`/projects/${r.slug}`)}
                    className={[
                      'cursor-pointer select-none',
                      active
                        ? 'bg-gray-200 text-black'
                        : 'text-gray-300 hover:bg-gray-900',
                    ].join(' ')}
                  >
                    <td className="py-0.5 text-xs leading-6 whitespace-nowrap">{r.date}</td>
                    <td className={['py-0.5 leading-6 truncate text-xs', active ? 'text-black' : 'text-gray-500'].join(' ')}>
                      {r.technology}
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
          { label: 'Date', value: project.date },
          { label: 'Technology', value: project.technology },
        ].map(({ label, value }) => (
          <div key={label} className="flex gap-3">
            <span className="text-gray-500 w-24 shrink-0">{label}</span>
            <span className="text-gray-200">{value}</span>
          </div>
        ))}
        <div className="flex gap-3">
          <span className="text-gray-500 w-24 shrink-0">Share URL</span>
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
