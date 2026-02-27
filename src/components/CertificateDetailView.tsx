'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import type { Certificate } from '@/types';

interface CertificateDetailViewProps {
  certificate: Certificate;
  allCertificates: Certificate[];
  isActive: boolean;
}

const SEPARATOR = '='.repeat(70);

export function CertificateDetailView({
  certificate,
  allCertificates,
  isActive,
}: CertificateDetailViewProps) {
  const router = useRouter();
  const related = allCertificates
    .filter((c) => c.id !== certificate.id)
    .slice(0, 5);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ── Escape → back to certificates list ──────────────────────────────────
  useEffect(() => {
    if (!isActive) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        router.push('/certificates');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isActive, router]);

  // ── Scroll to top on certificate change ──────────────────────────────────
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [certificate.id]);

  // ── Related keyboard navigation ──────────────────────────────────────────
  useKeyboardNavigation({
    itemCount: related.length,
    direction: 'vertical',
    initialIndex: 0,
    loop: false,
    disabled: !isActive,
    onSelect: (i) => router.push(`/certificates/${related[i].slug}`),
  });

  const copyUrl = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden text-sm">

      {/* ── Left column ──────────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 min-w-0 overflow-y-auto no-scrollbar md:pl-72 px-6 py-4"
      >
        {/* Heading */}
        <h1 className="text-gray-200 text-sm font-normal leading-relaxed mb-0">
          # {certificate.title}
        </h1>

        {/* Separator */}
        <p
          aria-hidden="true"
          className="text-gray-200 mb-5 overflow-hidden whitespace-nowrap"
        >
          {SEPARATOR}
        </p>

        {/* Certificate image */}
        {certificate.image && (
          <div className="mb-5 border border-gray-800 w-full max-w-lg overflow-hidden">
            <Image
              src={certificate.image}
              alt={certificate.title}
              width={640}
              height={420}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        )}

        {/* Excerpt / description */}
        <p className="text-gray-300 leading-relaxed mb-8">{certificate.excerpt}</p>

        {/* ── Metadata — mobile only ─────────────────────────────────── */}
        <div className="md:hidden mt-4 space-y-1.5 text-sm border-t border-gray-800 pt-4">
          {[
            { label: 'Date', value: certificate.date },
            { label: 'Technology', value: certificate.technology },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-3">
              <span className="text-gray-500 w-24 shrink-0">{label}</span>
              <span className="text-gray-200">{value}</span>
            </div>
          ))}
          <div className="flex gap-3">
            <span className="text-gray-500 w-24 shrink-0">Issuer</span>
            {certificate.issuerUrl ? (
              <a
                href={certificate.issuerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white underline"
              >
                [{certificate.issuer}]
              </a>
            ) : (
              <span className="text-gray-300">{certificate.issuer}</span>
            )}
          </div>
          <div className="flex gap-3">
            <span className="text-gray-500 w-24 shrink-0">Share URL</span>
            <button
              onClick={copyUrl}
              className="text-gray-300 hover:text-white cursor-pointer underline"
            >
              Copy link
            </button>
          </div>
        </div>

        {/* ── Related certificates ──────────────────────────────────────── */}
        {related.length > 0 && (
          <div className="border-t border-gray-800 pt-4 mt-6">
            <p className="text-gray-500 mb-3">See also</p>
            <table className="w-full table-fixed border-collapse">
              <colgroup>
                <col style={{ width: '130px' }} />
                <col style={{ width: '180px' }} />
                <col />
              </colgroup>
              <tbody>
                {related.map((c) => (
                  <tr
                    key={c.id}
                    data-terminal-item
                    tabIndex={0}
                    onClick={() => router.push(`/certificates/${c.slug}`)}
                    className="cursor-pointer hover:bg-gray-900 transition-colors"
                  >
                    <td className="py-1 px-0 text-gray-500 whitespace-nowrap pr-4">
                      {c.date}
                    </td>
                    <td className="py-1 px-0 text-gray-400 truncate pr-4">
                      {c.topic}
                    </td>
                    <td className="py-1 px-0 text-gray-300 truncate">
                      {c.title}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Right sidebar (desktop) ──────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-l border-gray-800 px-5 py-4 overflow-y-auto no-scrollbar text-sm gap-4">

        {/* Certificate preview image */}
        {certificate.image && (
          <div className="border border-gray-700 overflow-hidden">
            <Image
              src={certificate.image}
              alt={certificate.title}
              width={320}
              height={210}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-gray-500">Date</span>
            <span className="text-gray-200">{certificate.date}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-gray-500">Technology</span>
            <span className="text-gray-200">{certificate.technology}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-gray-500">Issuer</span>
            {certificate.issuerUrl ? (
              <a
                href={certificate.issuerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white underline"
              >
                [{certificate.issuer}]
              </a>
            ) : (
              <span className="text-gray-300">{certificate.issuer}</span>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-gray-500">Share URL</span>
            <button
              onClick={copyUrl}
              className="text-left text-gray-300 hover:text-white cursor-pointer underline"
            >
              Copy link
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
