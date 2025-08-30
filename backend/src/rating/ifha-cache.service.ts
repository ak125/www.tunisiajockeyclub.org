// Cache service pour optimisation IFHA
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

interface CacheConfig {
  ratings: number; // 5 minutes
  conversions: number; // 1 heure
  statistics: number; // 15 minutes
  horses: number; // 30 minutes
}

@Injectable()
export class IFHACacheService {
  private redis: Redis;
  private readonly cacheConfig: CacheConfig = {
    ratings: 5 * 60, // 5 minutes
    conversions: 60 * 60, // 1 heure  
    statistics: 15 * 60, // 15 minutes
    horses: 30 * 60, // 30 minutes
  };

  constructor(private configService: ConfigService) {
    const redisUrl = this.configService.get('REDIS_URL', 'redis://localhost:6379');
    this.redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      connectTimeout: 10000,
    });
  }

  // Cache rating d'un cheval
  async cacheHorseRating(horseId: string, rating: any): Promise<void> {
    const key = `ifha:rating:${horseId}`;
    await this.redis.setex(
      key,
      this.cacheConfig.ratings,
      JSON.stringify(rating),
    );
  }

  // Récupérer rating en cache
  async getCachedHorseRating(horseId: string): Promise<any | null> {
    const key = `ifha:rating:${horseId}`;
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  // Cache conversions internationales
  async cacheConversions(rating: number, conversions: any): Promise<void> {
    const key = `ifha:conversions:${rating}`;
    await this.redis.setex(
      key,
      this.cacheConfig.conversions,
      JSON.stringify(conversions),
    );
  }

  // Cache conversion individuelle
  async cacheConversion(cacheKey: string, conversion: any): Promise<void> {
    await this.redis.setex(
      cacheKey,
      this.cacheConfig.conversions,
      JSON.stringify(conversion),
    );
  }

  // Récupérer conversion en cache
  async getCachedConversion(cacheKey: string): Promise<any | null> {
    const cached = await this.redis.get(cacheKey);
    return cached ? JSON.parse(cached) : null;
  }

  // Cache statistiques globales
  async cacheStatistics(stats: any): Promise<void> {
    const key = 'ifha:statistics:global';
    await this.redis.setex(
      key,
      this.cacheConfig.statistics,
      JSON.stringify(stats),
    );
  }

  // Récupérer statistiques en cache
  async getCachedStatistics(): Promise<any | null> {
    const key = 'ifha:statistics:global';
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  // Cache liste des chevaux
  async cacheHorseList(filters: any, horses: any[]): Promise<void> {
    const key = `ifha:horses:${this.hashFilters(filters)}`;
    await this.redis.setex(
      key,
      this.cacheConfig.horses,
      JSON.stringify(horses),
    );
  }

  // Invalider cache d'un cheval
  async invalidateHorseCache(horseId: string): Promise<void> {
    const patterns = [
      `ifha:rating:${horseId}`,
      `ifha:horses:*`, // Invalider listes qui contiennent ce cheval
      'ifha:statistics:global', // Invalider stats globales
    ];
    
    for (const pattern of patterns) {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    }
  }

  // Invalider tout le cache IFHA
  async invalidateAllIFHACache(): Promise<void> {
    const keys = await this.redis.keys('ifha:*');
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  // Métriques cache pour monitoring
  async getCacheMetrics(): Promise<{
    hits: number;
    misses: number;
    hitRate: number;
    keysCount: number;
  }> {
    const info = await this.redis.info('stats');
    const hits = this.extractMetric(info, 'keyspace_hits');
    const misses = this.extractMetric(info, 'keyspace_misses');
    const keysCount = (await this.redis.keys('ifha:*')).length;
    
    return {
      hits,
      misses,
      hitRate: hits + misses > 0 ? hits / (hits + misses) : 0,
      keysCount,
    };
  }

  private hashFilters(filters: any): string {
    return Buffer.from(JSON.stringify(filters)).toString('base64').slice(0, 10);
  }

  private extractMetric(info: string, metric: string): number {
    const match = info.match(new RegExp(`${metric}:(\\d+)`));
    return match ? parseInt(match[1]) : 0;
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
