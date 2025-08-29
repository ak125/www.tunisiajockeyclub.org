import { Injectable, Logger } from '@nestjs/common';
import { IFHARatingService } from './ifha-rating-simple.service';
import { PerformanceMonitoringService } from './performance-monitoring.service';

export interface PerformanceResult {
  operation: string;
  averageTime: number;
  minTime: number;
  maxTime: number;
  successRate: number;
  totalOperations: number;
  samples: number;
  cacheHits?: number;
  cacheMisses?: number;
}

export interface LoadTestResult {
  operation: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  requestsPerSecond: number;
  concurrentUsers: number;
  concurrent: number;
  testDuration: number;
}

@Injectable()
export class PerformanceTestService {
  private readonly logger = new Logger(PerformanceTestService.name);

  constructor(
    private readonly ratingService: IFHARatingService,
    private readonly performanceMonitor: PerformanceMonitoringService,
  ) {}

  /**
   * Teste les performances des opérations IFHA avec cache
   */
  async runPerformanceTest(): Promise<{
    ratingTest: PerformanceResult;
    conversionTest: PerformanceResult;
    statisticsTest: PerformanceResult;
    cacheEfficiency: number;
  }> {
    this.logger.log('🚀 Début des tests de performance IFHA avec cache');

    // Test 1: Calcul de rating (avec cache miss/hit)
    const ratingTest = await this.testRatingPerformance();
    
    // Test 2: Conversion de rating (avec cache)
    const conversionTest = await this.testConversionPerformance();
    
    // Test 3: Statistiques (avec cache)
    const statisticsTest = await this.testStatisticsPerformance();

    // Calculer l'efficacité globale du cache
    const cacheEfficiency = this.calculateCacheEfficiency([
      ratingTest,
      conversionTest,
      statisticsTest,
    ]);

    this.logger.log('✅ Tests de performance terminés');
    
    return {
      ratingTest,
      conversionTest,
      statisticsTest,
      cacheEfficiency,
    };
  }

  /**
   * Test performance calcul de rating
   */
  private async testRatingPerformance(): Promise<PerformanceResult> {
    const testHorseId = 'test-horse-1';
    const iterations = 5;
    
    const times: number[] = [];
    
    this.logger.log('📊 Test performance - Calcul de rating');

    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();
      
      try {
        await this.ratingService.calculateHorseRating(testHorseId);
        const duration = Date.now() - startTime;
        times.push(duration);
        
        this.logger.debug(`Itération ${i + 1}: ${duration}ms`);
      } catch (error) {
        this.logger.warn(`Erreur test rating iteration ${i + 1}:`, error);
        times.push(0);
      }
    }

    return this.analyzePerformance('Rating Calculation', times);
  }

  /**
   * Test performance conversion de rating
   */
  private async testConversionPerformance(): Promise<PerformanceResult> {
    const testRatings = [85, 92, 78, 95, 88];
    const targetScales = ['france', 'uk', 'uae', 'ifha'];
    const times: number[] = [];
    
    this.logger.log('📊 Test performance - Conversion de rating');

    for (const rating of testRatings) {
      for (const scale of targetScales) {
        const startTime = Date.now();
        
        try {
          await this.ratingService.convertRating(rating, scale);
          const duration = Date.now() - startTime;
          times.push(duration);
          
          this.logger.debug(`Conversion ${rating} → ${scale}: ${duration}ms`);
        } catch (error) {
          this.logger.warn(`Erreur test conversion ${rating}→${scale}:`, error);
          times.push(0);
        }
      }
    }

    return this.analyzePerformance('Rating Conversion', times);
  }

  /**
   * Test performance statistiques
   */
  private async testStatisticsPerformance(): Promise<PerformanceResult> {
    const iterations = 3;
    const times: number[] = [];
    
    this.logger.log('📊 Test performance - Statistiques');

    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();
      
      try {
        await this.ratingService.getStatistics();
        const duration = Date.now() - startTime;
        times.push(duration);
        
        this.logger.debug(`Stats itération ${i + 1}: ${duration}ms`);
      } catch (error) {
        this.logger.warn(`Erreur test stats iteration ${i + 1}:`, error);
        times.push(0);
      }
    }

    return this.analyzePerformance('Statistics', times);
  }

  /**
   * Analyse les résultats de performance
   */
  private analyzePerformance(operation: string, times: number[]): PerformanceResult {
    const validTimes = times.filter(t => t > 0);
    
    if (validTimes.length === 0) {
      return {
        operation,
        averageTime: 0,
        minTime: 0,
        maxTime: 0,
        successRate: 0,
        totalOperations: times.length,
        samples: times.length,
      };
    }

    const sum = validTimes.reduce((a, b) => a + b, 0);
    const avg = sum / validTimes.length;
    const min = Math.min(...validTimes);
    const max = Math.max(...validTimes);
    const successRate = (validTimes.length / times.length) * 100;

    this.logger.log(
      `📈 ${operation}: avg=${avg.toFixed(1)}ms, min=${min}ms, max=${max}ms, success=${successRate.toFixed(1)}%`,
    );

    return {
      operation,
      averageTime: Math.round(avg * 10) / 10,
      minTime: min,
      maxTime: max,
      successRate: Math.round(successRate * 10) / 10,
      totalOperations: times.length,
      samples: times.length,
    };
  }

  /**
   * Calcule l'efficacité globale du cache
   */
  private calculateCacheEfficiency(results: PerformanceResult[]): number {
    const totalSamples = results.reduce((sum, r) => sum + r.samples, 0);
    const successfulSamples = results.reduce(
      (sum, r) => sum + (r.samples * r.successRate / 100),
      0,
    );
    
    const avgResponseTime = results.reduce(
      (sum, r) => sum + r.averageTime,
      0,
    ) / results.length;

    // Efficacité basée sur succès + vitesse (plus c'est rapide, plus c'est efficace)
    const efficiency = (successfulSamples / totalSamples) * 
      Math.max(0, 100 - (avgResponseTime / 10)); // Pénalité pour temps lent

    return Math.round(efficiency * 10) / 10;
  }

  /**
   * Test de charge pour mesurer la résistance du cache
   */
  async runLoadTest(concurrent: number = 10): Promise<LoadTestResult> {
    this.logger.log(`🔥 Test de charge avec ${concurrent} requêtes concurrentes`);

    const globalStartTime = Date.now();
    
    const operations = Array(concurrent).fill(null).map(async (_, index) => {
      const startTime = Date.now();
      
      try {
        // Mix d'opérations
        if (index % 3 === 0) {
          await this.ratingService.calculateHorseRating(`test-horse-${index}`);
        } else if (index % 3 === 1) {
          await this.ratingService.convertRating(85 + index, 'france');
        } else {
          await this.ratingService.getStatistics();
        }
        
        return {
          success: true,
          duration: Date.now() - startTime,
        };
      } catch (error) {
        return {
          success: false,
          duration: Date.now() - startTime,
        };
      }
    });

    const results = await Promise.all(operations);
    const globalEndTime = Date.now();
    
    const successful = results.filter(r => r.success);
    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    const successRate = (successful.length / results.length) * 100;

    this.logger.log(
      `🎯 Test de charge terminé: ${successRate.toFixed(1)}% succès, ${avgDuration.toFixed(1)}ms moyen`,
    );

    return {
      operation: 'load-test',
      concurrent,
      totalRequests: concurrent,
      successfulRequests: successful.length,
      failedRequests: results.length - successful.length,
      averageResponseTime: Math.round(avgDuration * 10) / 10,
      minResponseTime: Math.min(...successful.map((r) => r.duration)),
      maxResponseTime: Math.max(...successful.map((r) => r.duration)),
      requestsPerSecond: successful.length / ((globalEndTime - globalStartTime) / 1000),
      concurrentUsers: concurrent,
      testDuration: globalEndTime - globalStartTime,
    };
  }
}


