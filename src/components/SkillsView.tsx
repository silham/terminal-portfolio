'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { SkillCategory, Skill } from '@/types';

interface SkillsViewProps {
  categories: SkillCategory[];
}

const SEPARATOR = '='.repeat(70);
const DASH_TOTAL = 70;

function categoryDashes(label: string): string {
  const prefix = ` -- ${label} `;
  return '-'.repeat(Math.max(0, DASH_TOTAL - prefix.length - 1));
}

export function SkillsView({ categories }: SkillsViewProps) {
  // Which category ids are expanded
  const [openIds, setOpenIds] = useState<Set<string>>(
    new Set([categories[0]?.id]),
  );
  // Selected skill per category
  const [selected, setSelected] = useState<Record<string, Skill>>({});

  const toggleCategory = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectSkill = (catId: string, skill: Skill) => {
    setSelected((prev) => ({
      ...prev,
      [catId]: prev[catId]?.name === skill.name ? (undefined as unknown as Skill) : skill,
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4 text-sm">
      <div className="max-w-2xl mx-auto">

        {/* Heading */}
        <h1 className="text-gray-200 font-normal mb-0">
          # Shakil&apos;s Skills
        </h1>
        <p aria-hidden="true" className="text-gray-200 mb-5 overflow-hidden whitespace-nowrap">
          {SEPARATOR}
        </p>

        {/* Categories */}
        <div className="space-y-3">
          {categories.map((cat) => {
            const isOpen = openIds.has(cat.id);
            const activeCrumb = selected[cat.id];

            return (
              <div key={cat.id}>
                {/* Category toggle row */}
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full text-left text-gray-400 hover:text-gray-200
                             focus:outline-none cursor-pointer font-mono text-sm
                             flex items-center gap-2 overflow-hidden"
                >
                  <Image
                    src="/arrow-down.svg"
                    alt={isOpen ? 'collapse' : 'expand'}
                    width={14}
                    height={8}
                    className="shrink-0 opacity-60 transition-transform"
                    style={{ transform: isOpen ? 'none' : 'rotate(180deg)' }}
                  />
                  <span className="whitespace-nowrap overflow-hidden">
                    {` -- ${cat.label} ${categoryDashes(cat.label)}`}
                  </span>
                </button>

                {/* Expanded body */}
                {isOpen && (
                  <div className="mt-3 space-y-3">
                    {/* Description */}
                    <p className="text-gray-400 leading-relaxed">{cat.description}</p>

                    {/* Skill tags */}
                    <div className="space-y-2">
                      <p className="text-gray-500">Experience in:</p>
                      <div className="flex flex-wrap gap-2">
                        {cat.skills.map((skill) => {
                          const active = activeCrumb?.name === skill.name;
                          return (
                            <button
                              key={skill.name}
                              onClick={() => selectSkill(cat.id, skill)}
                              className={[
                                'px-1.5 py-0 border text-sm focus:outline-none cursor-pointer',
                                active
                                  ? 'border-gray-300 bg-gray-200 text-black'
                                  : 'border-gray-600 text-gray-300 hover:border-gray-400 hover:text-gray-100',
                              ].join(' ')}
                            >
                              [{skill.name}]
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Skill detail box */}
                    {activeCrumb && (
                      <div className="border border-gray-700 p-4 space-y-3">
                        <p className="text-gray-300"># {activeCrumb.name}</p>
                        <p className="text-gray-400 leading-relaxed text-xs">
                          {activeCrumb.excerpt}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
