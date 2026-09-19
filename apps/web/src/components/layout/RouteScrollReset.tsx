'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * RouteScrollReset
 * Ensures that on cross-route navigation (when pathname changes), the window is immediately
 * scrolled to the top before paint, preventing any visible jump or stranded scroll offset.
 *
 * Does not trigger on hash changes or same-page anchor scrolling.
 */
export default function RouteScrollReset() {
  const pathname = usePathname();
  const prevPathnameRef = useRef<string | null>(null);

  useIsomorphicLayoutEffect(() => {
    // Initial mount: record pathname
    if (prevPathnameRef.current === null) {
      prevPathnameRef.current = pathname;
      return;
    }

    // When pathname changes to a new route:
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [pathname]);

  return null;
}
