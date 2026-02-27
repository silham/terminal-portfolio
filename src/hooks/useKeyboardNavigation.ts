'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** Which axis the navigation listens on. */
export type NavDirection = 'vertical' | 'horizontal' | 'both';

export interface UseKeyboardNavigationOptions {
  /** Total number of navigable items in the list. */
  itemCount: number;
  /**
   * Arrow-key axis to listen on.
   * @default 'vertical'
   */
  direction?: NavDirection;
  /**
   * Index that is active on mount.
   * @default 0
   */
  initialIndex?: number;
  /**
   * When true the index wraps around at both ends.
   * @default true
   */
  loop?: boolean;
  /**
   * Called when the user presses Enter on the currently active item.
   * Receives the current active index.
   */
  onSelect?: (index: number) => void;
  /**
   * When true the hook does not attach any keyboard listeners.
   * Useful when the component using this hook is not "in focus" or is hidden.
   * @default false
   */
  disabled?: boolean;
}

export interface UseKeyboardNavigationReturn {
  /** Currently active (highlighted) item index. */
  activeIndex: number;
  /** Imperatively set the active index (e.g. on mouse hover). */
  setActiveIndex: (index: number) => void;
  /** Returns true when the given index matches the active one. */
  isActive: (index: number) => boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Manages a single "active index" driven entirely by keyboard input.
 *
 * Bypasses DOM focus entirely so components can render custom terminal-style
 * focus states (inverted colours, `█ ` prefix caret, etc.) without fighting
 * browser default focus styles.
 *
 * ### Key map
 * | Key         | Effect                                      |
 * |-------------|---------------------------------------------|
 * | ArrowDown / ArrowRight | Move to next item (wraps if `loop`) |
 * | ArrowUp / ArrowLeft    | Move to previous item (wraps if `loop`) |
 * | Enter       | Calls `onSelect` with the current index     |
 *
 * Only the axis selected by `direction` is handled; unrelated arrow keys are
 * left to propagate normally.
 */
export function useKeyboardNavigation({
  itemCount,
  direction = 'vertical',
  initialIndex = 0,
  loop = true,
  onSelect,
  disabled = false,
}: UseKeyboardNavigationOptions): UseKeyboardNavigationReturn {
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);

  // Keep a stable ref to `onSelect` so the keydown handler never stales.
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const clamp = useCallback(
    (next: number): number => {
      if (next < 0) return loop ? itemCount - 1 : 0;
      if (next >= itemCount) return loop ? 0 : itemCount - 1;
      return next;
    },
    [itemCount, loop],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (disabled || itemCount === 0) return;

      const listensVertical =
        direction === 'vertical' || direction === 'both';
      const listensHorizontal =
        direction === 'horizontal' || direction === 'both';

      switch (e.key) {
        case 'ArrowUp':
        case 'k':
          if (!listensVertical) return;
          e.preventDefault();
          setActiveIndex((prev) => clamp(prev - 1));
          break;

        case 'ArrowDown':
        case 'j':
          if (!listensVertical) return;
          e.preventDefault();
          setActiveIndex((prev) => clamp(prev + 1));
          break;

        case 'ArrowLeft':
          if (!listensHorizontal) return;
          e.preventDefault();
          setActiveIndex((prev) => clamp(prev - 1));
          break;

        case 'ArrowRight':
          if (!listensHorizontal) return;
          e.preventDefault();
          setActiveIndex((prev) => clamp(prev + 1));
          break;

        case 'Enter':
          e.preventDefault();
          onSelectRef.current?.(activeIndex);
          break;

        default:
          break;
      }
    },
    [disabled, itemCount, direction, clamp, activeIndex],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Reset to initialIndex if itemCount changes (e.g. list filtered/replaced).
  useEffect(() => {
    setActiveIndex((prev) =>
      itemCount > 0 ? Math.min(prev, itemCount - 1) : 0,
    );
  }, [itemCount]);

  const isActive = useCallback(
    (index: number) => index === activeIndex,
    [activeIndex],
  );

  return { activeIndex, setActiveIndex, isActive };
}
