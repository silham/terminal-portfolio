'use client';

import { useMouseVisibility } from '@/hooks/useMouseVisibility';

/**
 * Renders nothing — exists solely to attach the mouse-visibility side-effect
 * inside a Client Component so it can be imported from the (Server) root layout.
 */
export function MouseVisibilityController() {
  useMouseVisibility();
  return null;
}
