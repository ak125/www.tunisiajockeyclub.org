import { usePerformanceMonitor } from '~/shared/hooks/usePerformance';

// Performance badge component for development
export function PerformanceBadge({ pageName }: { pageName: string }) {
  const metrics = usePerformanceMonitor(pageName);

  if (process.env.NODE_ENV !== 'development' || !metrics) {
    return null;
  }

  const getRenderColor = (time: number) => {
    if (time < 100) return 'bg-green-500';
    if (time < 300) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white p-3 rounded-lg text-xs font-mono">
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-2 h-2 rounded-full ${getRenderColor(metrics.renderTime)}`}></div>
        <span>{pageName}</span>
      </div>
      <div>Render: {metrics.renderTime.toFixed(1)}ms</div>
      {metrics.memoryUsage && (
        <div>Memory: {(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB</div>
      )}
    </div>
  );
}
