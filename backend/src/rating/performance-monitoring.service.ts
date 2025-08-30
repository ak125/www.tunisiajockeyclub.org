import { Injectable } from '@nestjs/common';

interface PerformanceMetric {
  operation: string;
  duration: number;
  timestamp: Date;
  success: boolean;
  details?: any;
}

@Injectable()
export class PerformanceMonitoringService {
  private metrics: PerformanceMetric[] = [];

  // Mesurer une opération
  async measure<T>(
    operation: string,
    fn: () => Promise<T>,
    details?: any
  ): Promise<{ result: T; duration: number }> {
    const startTime = performance.now();
    let success = true;
    let result: T;

    try {
      result = await fn();
    } catch (error) {
      success = false;
      throw error;
    } finally {
      const duration = performance.now() - startTime;
      
      this.metrics.push({
        operation,
        duration,
        timestamp: new Date(),
        success,
        details,
      });

      // Garder seulement les 1000 dernières métriques
      if (this.metrics.length > 1000) {
        this.metrics = this.metrics.slice(-1000);
      }
    }

    return { result, duration: performance.now() - startTime };
  }

  // Obtenir les statistiques de performance
  getStats(operation?: string): {
    count: number;
    avgDuration: number;
    minDuration: number;
    maxDuration: number;
    successRate: number;
    recentMetrics: PerformanceMetric[];
  } {
    const filteredMetrics = operation 
      ? this.metrics.filter(m => m.operation === operation)
      : this.metrics;

    if (filteredMetrics.length === 0) {
      return {
        count: 0,
        avgDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        successRate: 0,
        recentMetrics: [],
      };
    }

    const durations = filteredMetrics.map(m => m.duration);
    const successCount = filteredMetrics.filter(m => m.success).length;

    return {
      count: filteredMetrics.length,
      avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      successRate: (successCount / filteredMetrics.length) * 100,
      recentMetrics: filteredMetrics.slice(-10),
    };
  }

  // Obtenir un résumé global
  getSummary(): {
    operations: string[];
    totalMeasurements: number;
    avgResponseTime: number;
    slowestOperations: Array<{ operation: string; avgDuration: number }>;
  } {
    const operations = [...new Set(this.metrics.map(m => m.operation))];
    const totalMeasurements = this.metrics.length;
    const avgResponseTime = this.metrics.length > 0 
      ? this.metrics.reduce((sum, m) => sum + m.duration, 0) / this.metrics.length
      : 0;

    const slowestOperations = operations
      .map(op => ({
        operation: op,
        avgDuration: this.getStats(op).avgDuration,
      }))
      .sort((a, b) => b.avgDuration - a.avgDuration)
      .slice(0, 5);

    return {
      operations,
      totalMeasurements,
      avgResponseTime,
      slowestOperations,
    };
  }

  // Nettoyer les métriques
  clearMetrics(): void {
    this.metrics = [];
  }
}
