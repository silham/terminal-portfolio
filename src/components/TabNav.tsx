'use client';

import type { Tab, TabId } from '@/types';

interface TabNavProps {
  tabs: Tab[];
  activeId: TabId;
  onSelect: (id: TabId) => void;
  mobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

export function TabNav({
  tabs,
  activeId,
  onSelect,
  mobileMenuOpen,
  onMobileMenuToggle,
}: TabNavProps) {
  const activeTab = tabs.find((t) => t.id === activeId);

  return (
    <>
      {/* ── Desktop: horizontal tab bar ── */}
      <nav
        aria-label="Main navigation"
        className="hidden md:flex items-center gap-0 border-b border-gray-700 px-4"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'px-3 py-1.5 text-sm cursor-pointer select-none',
                'focus:outline-none',
                isActive
                  ? 'border border-gray-500 border-b-black text-gray-200 -mb-px bg-black'
                  : 'border border-transparent text-gray-500 hover:text-gray-300',
              ].join(' ')}
            >
              ({tab.id}) {tab.label}
            </button>
          );
        })}
      </nav>

      {/* ── Mobile: hamburger button + dropdown ── */}
      <div className="md:hidden border-b border-gray-700">
        <button
          onClick={onMobileMenuToggle}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-200
                     bg-gray-900 hover:bg-gray-800 focus:outline-none cursor-pointer"
        >
          {/* Hamburger icon */}
          <svg viewBox="0 0 16 12" width="18" height="14" fill="currentColor" aria-hidden="true">
            <rect x="0" y="0" width="16" height="2" />
            <rect x="0" y="5" width="16" height="2" />
            <rect x="0" y="10" width="16" height="2" />
          </svg>
          Menu
        </button>

        {/* Dropdown list */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-800">
            {tabs.map((tab) => {
              const isActive = tab.id === activeId;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelect(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'flex items-center w-full px-4 py-2.5 text-sm cursor-pointer select-none focus:outline-none',
                    isActive
                      ? 'bg-gray-200 text-black'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200',
                  ].join(' ')}
                >
                  ({tab.id}) {tab.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Mobile: active tab label shown below menu ── */}
      {!mobileMenuOpen && activeTab && (
        <div className="md:hidden px-4 py-1.5 border-b border-gray-800 text-xs text-gray-500">
          {activeTab.label}
        </div>
      )}
    </>
  );
}
