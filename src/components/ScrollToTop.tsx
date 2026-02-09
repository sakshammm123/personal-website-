'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Scrolls to top when route changes
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Smooth scroll to top on navigation (but ensure we really reach 0).
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });

    // Safety: some layouts/content shifts can leave you slightly below 0 after smooth scroll.
    // After a short delay, force to absolute top if needed (no animation).
    const t = window.setTimeout(() => {
      if (window.scrollY > 0) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    }, prefersReducedMotion ? 0 : 600);

    return () => window.clearTimeout(t);
  }, [pathname]);

  return null;
}
