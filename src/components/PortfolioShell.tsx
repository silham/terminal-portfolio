'use client';

import { useEffect, useCallback, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { TabNav } from '@/components/TabNav';
import { Newsletter } from '@/components/Newsletter';
import { StatusBar } from '@/components/StatusBar';
import { TABS } from '@/data';
import type { TabId } from '@/types';

/**
 * Persistent shell rendered around every page.
 * Owns the shared Header, TabNav, Newsletter, StatusBar, and all
 * keyboard shortcuts for tab switching (number keys 1–5, ←/→ arrows).
 */
export function PortfolioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ── Derive active tab from current pathname ──────────────────────────────
  const activeTabIndex = (() => {
    for (let i = TABS.length - 1; i >= 0; i--) {
      const { path } = TABS[i];
      if (path === '/') {
        if (pathname === '/' || pathname.startsWith('/articles')) return i;
      } else if (pathname.startsWith(path)) {
        return i;
      }
    }
    return 0;
  })();

  const activeTabId = TABS[activeTabIndex].id as TabId;

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      // Number keys 1–5 → jump to tab
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= TABS.length) {
        e.preventDefault();
        router.push(TABS[n - 1].path);
        setMobileMenuOpen(false);
        return;
      }

      // ← / → arrow keys → cycle tabs (only on list pages, not article detail)
      if (!pathname.startsWith('/articles/') && !pathname.startsWith('/projects/')) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prev = (activeTabIndex - 1 + TABS.length) % TABS.length;
          router.push(TABS[prev].path);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          const next = (activeTabIndex + 1) % TABS.length;
          router.push(TABS[next].path);
        }
      }
    },
    [router, pathname, activeTabIndex],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-black text-gray-200">
      <Header />

      <TabNav
        tabs={TABS}
        activeId={activeTabId}
        onSelect={(id) => {
          const tab = TABS.find((t) => t.id === id);
          if (tab) router.push(tab.path);
        }}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={() => setMobileMenuOpen((v) => !v)}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>

      <Newsletter />
      <StatusBar />
    </div>
  );
}
