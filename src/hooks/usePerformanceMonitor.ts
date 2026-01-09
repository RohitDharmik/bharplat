import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
}

export const usePerformanceMonitor = () => {
  const metricsRef = useRef<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });

  useEffect(() => {
    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      metricsRef.current.fcp = lastEntry.startTime;
      console.log('FCP:', lastEntry.startTime);
    });
    fcpObserver.observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      metricsRef.current.lcp = lastEntry.startTime;
      console.log('LCP:', lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        metricsRef.current.fid = entry.processingStart - entry.startTime;
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      metricsRef.current.cls = clsValue;
      console.log('CLS:', clsValue);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // Time to First Byte
    const navigationObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.entryType === 'navigation') {
          metricsRef.current.ttfb = entry.responseStart - entry.requestStart;
          console.log('TTFB:', entry.responseStart - entry.requestStart);
        }
      });
    });
    navigationObserver.observe({ entryTypes: ['navigation'] });

    // Send metrics to analytics (optional)
    const sendMetrics = () => {
      const metrics = metricsRef.current;
      // Send to your analytics service
      console.log('Performance Metrics:', metrics);

      // Example: Send to Google Analytics
      if (typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'Performance Metrics',
          value: Math.round(metrics.fcp || 0),
          custom_map: {
            metric_fcp: metrics.fcp,
            metric_lcp: metrics.lcp,
            metric_fid: metrics.fid,
            metric_cls: metrics.cls,
            metric_ttfb: metrics.ttfb,
          }
        });
      }
    };

    // Send metrics after page load
    window.addEventListener('load', () => {
      setTimeout(sendMetrics, 0);
    });

    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
      navigationObserver.disconnect();
    };
  }, []);

  return metricsRef.current;
};

// Hook to measure component render time
export const useRenderTime = (componentName: string) => {
  const startTimeRef = useRef<number>();

  useEffect(() => {
    startTimeRef.current = performance.now();
  });

  useEffect(() => {
    if (startTimeRef.current) {
      const renderTime = performance.now() - startTimeRef.current;
      console.log(`${componentName} render time:`, renderTime, 'ms');

      // Log slow renders (>16ms for 60fps)
      if (renderTime > 16) {
        console.warn(`Slow render detected in ${componentName}:`, renderTime, 'ms');
      }
    }
  });
};

// Hook to monitor memory usage
export const useMemoryMonitor = () => {
  useEffect(() => {
    const logMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        console.log('Memory Usage:', {
          used: Math.round(memory.usedJSHeapSize / 1048576 * 100) / 100 + ' MB',
          total: Math.round(memory.totalJSHeapSize / 1048576 * 100) / 100 + ' MB',
          limit: Math.round(memory.jsHeapSizeLimit / 1048576 * 100) / 100 + ' MB',
        });
      }
    };

    const interval = setInterval(logMemoryUsage, 10000); // Log every 10 seconds
    return () => clearInterval(interval);
  }, []);
};