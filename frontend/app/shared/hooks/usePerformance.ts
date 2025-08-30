import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage?: number;
}

export function usePerformanceMonitor(pageName: string) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    const startTime = performance.now();
    
    // Measure initial render
    const measureRender = () => {
      const renderTime = performance.now() - startTime;
      
      // Measure memory usage if available
      const memoryUsage = (performance as any).memory?.usedJSHeapSize;
      
      const initialMetrics: PerformanceMetrics = {
        loadTime: startTime,
        renderTime,
        interactionTime: 0,
        memoryUsage
      };
      
      setMetrics(initialMetrics);
      
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`📊 Performance Metrics for ${pageName}:`, {
          renderTime: `${renderTime.toFixed(2)}ms`,
          memoryUsage: memoryUsage ? `${(memoryUsage / 1024 / 1024).toFixed(2)}MB` : 'N/A'
        });
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(measureRender);

    // Measure first interaction
    const measureInteraction = (event: Event) => {
      const interactionTime = performance.now() - startTime;
      setMetrics(prev => prev ? { ...prev, interactionTime } : null);
      
      // Remove listener after first interaction
      document.removeEventListener('click', measureInteraction);
      document.removeEventListener('keydown', measureInteraction);
    };

    document.addEventListener('click', measureInteraction);
    document.addEventListener('keydown', measureInteraction);

    return () => {
      document.removeEventListener('click', measureInteraction);
      document.removeEventListener('keydown', measureInteraction);
    };
  }, [pageName]);

  return metrics;
}

// Bundle size analyzer utility
export function logBundleInfo() {
  if (process.env.NODE_ENV === 'development') {
    // Estimate bundle size from loaded scripts
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const totalScripts = scripts.length;
    
    console.log('📦 Bundle Info:', {
      totalScripts,
      estimatedSize: 'Run `npm run build:analyze` for detailed bundle analysis'
    });
  }
}
