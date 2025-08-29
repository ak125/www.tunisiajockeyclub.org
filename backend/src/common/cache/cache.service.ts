import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export interface CacheOptions {
  ttl?: number; // Time To Live en secondes
  namespace?: string;
}

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private redis!: Redis;
  private readonly defaultTTL = 3600; // 1 heure par défaut

  constructor(private configService: ConfigService) {
    this.initializeRedis();
  }

  private initializeRedis(): void {
    const redisUrl = this.configService.get('REDIS_URL', 'redis://localhost:6379');
    
    this.redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      connectTimeout: 10000,
    });

    this.redis.on('connect', () => {
      this.logger.log('✅ Redis connected successfully');
    });

    this.redis.on('error', (error) => {
      this.logger.error('❌ Redis connection error:', error);
    });

    this.redis.on('ready', () => {
      this.logger.log('🚀 Redis is ready to accept commands');
    });
  }

  // Générer une clé avec namespace
  private generateKey(key: string, namespace?: string): string {
    const prefix = namespace || 'tjc';
    return `${prefix}:${key}`;
  }

  // Cache avec TTL
  async set(key: string, value: any, options: CacheOptions = {}): Promise<void> {
    try {
      const cacheKey = this.generateKey(key, options.namespace);
      const ttl = options.ttl || this.defaultTTL;
      
      await this.redis.setex(
        cacheKey,
        ttl,
        JSON.stringify(value)
      );
      
      this.logger.debug(`✅ Cached: ${cacheKey} (TTL: ${ttl}s)`);
    } catch (error) {
      this.logger.error(`❌ Cache set error for key ${key}:`, error);
    }
  }

  // Récupérer du cache
  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    try {
      const cacheKey = this.generateKey(key, options.namespace);
      const cached = await this.redis.get(cacheKey);
      
      if (!cached) {
        this.logger.debug(`🔍 Cache miss: ${cacheKey}`);
        return null;
      }
      
      this.logger.debug(`✅ Cache hit: ${cacheKey}`);
      return JSON.parse(cached) as T;
    } catch (error) {
      this.logger.error(`❌ Cache get error for key ${key}:`, error);
      return null;
    }
  }

  // Cache avec fonction de récupération
  async getOrSet<T>(
    key: string, 
    fetchFunction: () => Promise<T>, 
    options: CacheOptions = {}
  ): Promise<T> {
    try {
      // Essayer de récupérer depuis le cache
      const cached = await this.get<T>(key, options);
      
      if (cached !== null) {
        return cached;
      }
      
      // Si pas en cache, récupérer et mettre en cache
      this.logger.debug(`🔄 Cache miss, fetching: ${key}`);
      const data = await fetchFunction();
      
      if (data) {
        await this.set(key, data, options);
      }
      
      return data;
    } catch (error) {
      this.logger.error(`❌ Cache getOrSet error for key ${key}:`, error);
      throw error;
    }
  }

  // Supprimer une clé
  async del(key: string, options: CacheOptions = {}): Promise<void> {
    try {
      const cacheKey = this.generateKey(key, options.namespace);
      await this.redis.del(cacheKey);
      this.logger.debug(`🗑️ Deleted: ${cacheKey}`);
    } catch (error) {
      this.logger.error(`❌ Cache delete error for key ${key}:`, error);
    }
  }

  // Supprimer par pattern
  async delPattern(pattern: string, options: CacheOptions = {}): Promise<void> {
    try {
      const searchPattern = this.generateKey(pattern, options.namespace);
      const keys = await this.redis.keys(searchPattern);
      
      if (keys.length > 0) {
        await this.redis.del(...keys);
        this.logger.debug(`🗑️ Deleted ${keys.length} keys matching: ${searchPattern}`);
      }
    } catch (error) {
      this.logger.error(`❌ Cache delete pattern error for ${pattern}:`, error);
    }
  }

  // Vérifier si une clé existe
  async exists(key: string, options: CacheOptions = {}): Promise<boolean> {
    try {
      const cacheKey = this.generateKey(key, options.namespace);
      const exists = await this.redis.exists(cacheKey);
      return exists === 1;
    } catch (error) {
      this.logger.error(`❌ Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  // TTL d'une clé
  async ttl(key: string, options: CacheOptions = {}): Promise<number> {
    try {
      const cacheKey = this.generateKey(key, options.namespace);
      return await this.redis.ttl(cacheKey);
    } catch (error) {
      this.logger.error(`❌ Cache TTL error for key ${key}:`, error);
      return -1;
    }
  }

  // Cache pour listes avec pagination
  async setList(
    key: string, 
    items: any[], 
    page: number = 1, 
    limit: number = 20, 
    options: CacheOptions = {}
  ): Promise<void> {
    const listKey = `${key}:page:${page}:limit:${limit}`;
    await this.set(listKey, items, options);
  }

  async getList<T>(
    key: string, 
    page: number = 1, 
    limit: number = 20, 
    options: CacheOptions = {}
  ): Promise<T[] | null> {
    const listKey = `${key}:page:${page}:limit:${limit}`;
    return await this.get<T[]>(listKey, options);
  }

  // Cache pour compteurs
  async increment(key: string, options: CacheOptions = {}): Promise<number> {
    try {
      const cacheKey = this.generateKey(key, options.namespace);
      const result = await this.redis.incr(cacheKey);
      
      // Définir TTL si spécifié
      if (options.ttl) {
        await this.redis.expire(cacheKey, options.ttl);
      }
      
      return result;
    } catch (error) {
      this.logger.error(`❌ Cache increment error for key ${key}:`, error);
      return 0;
    }
  }

  // Cache pour sets (collections uniques)
  async addToSet(key: string, value: string, options: CacheOptions = {}): Promise<void> {
    try {
      const cacheKey = this.generateKey(key, options.namespace);
      await this.redis.sadd(cacheKey, value);
      
      if (options.ttl) {
        await this.redis.expire(cacheKey, options.ttl);
      }
    } catch (error) {
      this.logger.error(`❌ Cache addToSet error for key ${key}:`, error);
    }
  }

  async getSet(key: string, options: CacheOptions = {}): Promise<string[]> {
    try {
      const cacheKey = this.generateKey(key, options.namespace);
      return await this.redis.smembers(cacheKey);
    } catch (error) {
      this.logger.error(`❌ Cache getSet error for key ${key}:`, error);
      return [];
    }
  }

  // Statistiques du cache
  async getStats(): Promise<{
    keysCount: number;
    memoryUsage: number;
    hitRate: number;
    uptime: number;
  }> {
    try {
      const info = await this.redis.info();
      const stats = this.parseRedisInfo(info);
      
      return {
        keysCount: await this.redis.dbsize(),
        memoryUsage: stats.used_memory || 0,
        hitRate: this.calculateHitRate(stats),
        uptime: stats.uptime_in_seconds || 0,
      };
    } catch (error) {
      this.logger.error('❌ Error getting cache stats:', error);
      return {
        keysCount: 0,
        memoryUsage: 0,
        hitRate: 0,
        uptime: 0,
      };
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; latency: number }> {
    try {
      const start = Date.now();
      await this.redis.ping();
      const latency = Date.now() - start;
      
      return {
        status: latency < 100 ? 'healthy' : 'unhealthy',
        latency,
      };
    } catch (error) {
      this.logger.error('❌ Cache health check failed:', error);
      return {
        status: 'unhealthy',
        latency: -1,
      };
    }
  }

  // Utilitaires privés
  private parseRedisInfo(info: string): Record<string, number> {
    const lines = info.split('\r\n');
    const result: Record<string, number> = {};
    
    for (const line of lines) {
      if (line.includes(':') && !line.startsWith('#')) {
        const [key, value] = line.split(':');
        const numValue = parseInt(value);
        if (!isNaN(numValue)) {
          result[key] = numValue;
        }
      }
    }
    
    return result;
  }

  private calculateHitRate(stats: Record<string, number>): number {
    const hits = stats.keyspace_hits || 0;
    const misses = stats.keyspace_misses || 0;
    const total = hits + misses;
    
    return total > 0 ? (hits / total) * 100 : 0;
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('🔌 Closing Redis connection...');
    await this.redis.quit();
  }
}
