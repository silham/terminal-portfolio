'use client';

import { useEffect } from 'react';

/** Milliseconds of inactivity before the cursor is hidden (1.75 s). */
const IDLE_TIMEOUT_MS = 1750;

/**
 * Hides the mouse cursor globally when the pointer is idle.
 *
 * - Cursor starts hidden on mount.
 * - Any `mousemove` event makes it visible and resets the idle timer.
 * - After IDLE_TIMEOUT_MS of no movement the cursor is hidden again.
 * - Cleans up on unmount (restores cursor, removes listener).
 *
 * Apply via a client-side wrapper component in the root layout so the
 * behaviour is active across every page.
 */
export function useMouseVisibility(): void {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const hideCursor = () => {
      document.documentElement.style.cursor = 'none';
    };

    const showCursor = () => {
      document.documentElement.style.cursor = 'default';

      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(hideCursor, IDLE_TIMEOUT_MS);
    };

    // Hide immediately on mount — keyboard-first, pointer-optional.
    hideCursor();

    document.addEventListener('mousemove', showCursor);

    return () => {
      document.removeEventListener('mousemove', showCursor);
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      // Restore cursor so DevTools / other tabs aren't affected.
      document.documentElement.style.cursor = 'default';
    };
  }, []);
}
