'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  getSessionId,
  isAnalyticsEnabled,
  categorizeReferrer,
} from '@/lib/analytics-utils';

export default function PageTracker() {
  const pathname = usePathname();
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    // Check if analytics is enabled (cookie consent)
    if (!isAnalyticsEnabled()) {
      return;
    }

    // Don't track admin pages
    if (pathname?.startsWith('/admin')) {
      return;
    }

    // Get conversation ID from localStorage (set by chatbot)
    const storedConvId = localStorage.getItem('sakshamai:conversationId');
    if (storedConvId) {
      setConversationId(storedConvId);
    }

    // Collect performance metrics
    const collectPerformanceMetrics = () => {
      if (typeof window === 'undefined' || !('performance' in window)) {
        return null;
      }

      const perfData: any = {};

      try {
        // Page load time
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          perfData.loadTime = Math.round(navigation.loadEventEnd - navigation.fetchStart);
        }

        // Core Web Vitals
        // First Contentful Paint (FCP)
        const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
        if (fcpEntry) {
          perfData.firstContentfulPaint = Math.round(fcpEntry.startTime);
        }

        // Largest Contentful Paint (LCP) - needs to be observed
        // We'll use PerformanceObserver if available
        if ('PerformanceObserver' in window) {
          try {
            const lcpObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const lastEntry = entries[entries.length - 1] as any;
              perfData.largestContentfulPaint = Math.round(lastEntry.renderTime || lastEntry.loadTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
          } catch (e) {
            // LCP observation not supported
          }
        }

        // Cumulative Layout Shift (CLS) - needs to be observed
        if ('PerformanceObserver' in window) {
          try {
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (!(entry as any).hadRecentInput) {
                  clsValue += (entry as any).value;
                }
              }
              perfData.cumulativeLayoutShift = clsValue;
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
          } catch (e) {
            // CLS observation not supported
          }
        }

        // First Input Delay (FID) - needs to be observed
        if ('PerformanceObserver' in window) {
          try {
            const fidObserver = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                perfData.firstInputDelay = Math.round((entry as any).processingStart - entry.startTime);
              }
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
            // Store observer for later (inside try block where fidObserver is defined)
            (window as any).__fidObserver = fidObserver;
          } catch (e) {
            // FID observation not supported
          }
        }
      } catch (error) {
        console.error('Error collecting performance metrics:', error);
      }

      return perfData;
    };

    // Track page visit with performance data
    const trackVisit = async () => {
      try {
        // Wait a bit for performance metrics to be collected
        await new Promise(resolve => setTimeout(resolve, 2000));

        const perfData = collectPerformanceMetrics();
        const sessionId = getSessionId();
        const referer = document.referrer || null;
        const storedConvId = localStorage.getItem('sakshamai:conversationId');

        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: pathname || '/',
            referer,
            sessionId,
            loadTime: perfData?.loadTime,
            firstContentfulPaint: perfData?.firstContentfulPaint,
            largestContentfulPaint: perfData?.largestContentfulPaint,
            cumulativeLayoutShift: perfData?.cumulativeLayoutShift,
            firstInputDelay: perfData?.firstInputDelay,
            conversationId: conversationId || storedConvId,
          }),
        });
      } catch (error) {
        // Silently fail - don't interrupt user experience
        console.error('Failed to track page visit:', error);
      }
    };

    // Small delay to ensure page is fully loaded
    const timer = setTimeout(trackVisit, 500);
    return () => clearTimeout(timer);
  }, [pathname, conversationId]);

  // Listen for conversation ID updates from chatbot
  useEffect(() => {
    const handleConversationUpdate = () => {
      const convId = localStorage.getItem('sakshamai:conversationId');
      if (convId) {
        setConversationId(convId);
      }
    };

    window.addEventListener('storage', handleConversationUpdate);
    window.addEventListener('conversationStarted', handleConversationUpdate);

    return () => {
      window.removeEventListener('storage', handleConversationUpdate);
      window.removeEventListener('conversationStarted', handleConversationUpdate);
    };
  }, []);

  return null; // This component doesn't render anything
}
