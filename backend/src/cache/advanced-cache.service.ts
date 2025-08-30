import { Injectable, Logger } from '@nestjs/common';

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number; // Time to live en millisecondes
  hits: number;
  lastAccess: number;
}

export interface CacheStats {
  totalKeys: number;
  totalHits: number;
  totalMisses: number;
  hitRate: number;
  memoryUsage: number;
  oldestEntry: number;
  newestEntry: number;
}

@Injectable()
export class AdvancedCacheService {
  private readonly logger = new Logger(AdvancedCacheService.name);
  private cache = new Map<string, CacheEntry>();
  private stats = {
    hits: 0,
    misses: 0,
  };

  // TTL par défaut : 5 minutes
  private readonly DEFAULT_TTL = 5 * 60 * 1000;
  
  // Taille maximale du cache
  private readonly MAX_CACHE_SIZE = 1000;

  /**
   * Stocke une valeur dans le cache avec TTL
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      key,
      value,
      timestamp: Date.now(),
      ttl: ttl || this.DEFAULT_TTL,
      hits: 0,
      lastAccess: Date.now(),
    };

    // Nettoyer les entrées expirées avant d'ajouter
    this.cleanExpired();

    // Si le cache est plein, supprimer les entrées les moins utilisées
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.evictLeastUsed();
    }

    this.cache.set(key, entry);
    this.logger.debug(`Cached key: ${key} (TTL: ${entry.ttl}ms)`);
  }

  /**
   * Récupère une valeur du cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T>;

    if (!entry) {
      this.stats.misses++;
      this.logger.debug(`Cache miss: ${key}`);
      return null;
    }

    // Vérifier si l'entrée a expiré
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      this.logger.debug(`Cache expired: ${key}`);
      return null;
    }

    // Mettre à jour les statistiques
    entry.hits++;
    entry.lastAccess = now;
    this.stats.hits++;
    
    this.logger.debug(`Cache hit: ${key} (hits: ${entry.hits})`);
    return entry.value;
  }

  /**
   * Récupère ou calcule une valeur (pattern cache-aside)
   */
  async getOrSet<T>(
    key: string, 
    factory: () => Promise<T>, 
    ttl?: number
  ): Promise<T> {
    // Essayer de récupérer depuis le cache
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Calculer la valeur
    const value = await factory();
    
    // Stocker dans le cache
    this.set(key, value, ttl);
    
    return value;
  }

  /**
   * Supprime une clé du cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.logger.debug(`Deleted from cache: ${key}`);
    }
    return deleted;
  }

  /**
   * Vide tout le cache
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    this.stats.hits = 0;
    this.stats.misses = 0;
    this.logger.log(`Cache cleared (${size} entries removed)`);
  }

  /**
   * Vérifie si une clé existe dans le cache
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Vérifier si expiré
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Obtient les statistiques du cache
   */
  getStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const totalRequests = this.stats.hits + this.stats.misses;
    
    return {
      totalKeys: this.cache.size,
      totalHits: this.stats.hits,
      totalMisses: this.stats.misses,
      hitRate: totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0,
      memoryUsage: this.estimateMemoryUsage(),
      oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : 0,
      newestEntry: entries.length > 0 ? Math.max(...entries.map(e => e.timestamp)) : 0,
    };
  }

  /**
   * Obtient toutes les clés du cache
   */
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Obtient les entrées les plus populaires
   */
  getTopEntries(limit: number = 10): Array<{key: string, hits: number, lastAccess: number}> {
    return Array.from(this.cache.values())
      .sort((a, b) => b.hits - a.hits)
      .slice(0, limit)
      .map(entry => ({
        key: entry.key,
        hits: entry.hits,
        lastAccess: entry.lastAccess,
      }));
  }

  /**
   * Cache spécialisé pour les courses
   */
  async getCourseData(courseId: string): Promise<any> {
    return this.getOrSet(
      `course:${courseId}`,
      async () => {
        // Simuler un appel à la base de données
        this.logger.debug(`Fetching course data for: ${courseId}`);
        return {
          id: courseId,
          name: `Course ${courseId}`,
          status: 'active',
          participants: Math.floor(Math.random() * 20) + 5,
          fetchedAt: new Date(),
        };
      },
      2 * 60 * 1000 // 2 minutes pour les données de course
    );
  }

  /**
   * Cache spécialisé pour les statistiques
   */
  async getStats_Cached(type: string): Promise<any> {
    return this.getOrSet(
      `stats:${type}`,
      async () => {
        this.logger.debug(`Computing stats for: ${type}`);
        return {
          type,
          total: Math.floor(Math.random() * 1000),
          active: Math.floor(Math.random() * 500),
          pending: Math.floor(Math.random() * 100),
          computedAt: new Date(),
        };
      },
      10 * 60 * 1000 // 10 minutes pour les statistiques
    );
  }

  /**
   * Nettoie les entrées expirées
   */
  private cleanExpired(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.logger.debug(`Cleaned ${cleaned} expired entries`);
    }
  }

  /**
   * Supprime les entrées les moins utilisées (LRU)
   */
  private evictLeastUsed(): void {
    const entries = Array.from(this.cache.entries());
    
    // Trier par nombre de hits puis par dernier accès
    entries.sort((a, b) => {
      if (a[1].hits !== b[1].hits) {
        return a[1].hits - b[1].hits; // Moins de hits d'abord
      }
      return a[1].lastAccess - b[1].lastAccess; // Plus ancien d'abord
    });

    // Supprimer 10% des entrées les moins utilisées
    const toRemove = Math.ceil(entries.length * 0.1);
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }

    this.logger.debug(`Evicted ${toRemove} least used entries`);
  }

  /**
   * Estime l'usage mémoire du cache
   */
  private estimateMemoryUsage(): number {
    let totalSize = 0;
    
    for (const entry of this.cache.values()) {
      // Estimation basique de la taille en octets
      totalSize += JSON.stringify(entry).length * 2; // UTF-16 = 2 bytes par char
    }
    
    return totalSize;
  }

  /**
   * Préchauffe le cache avec des données fréquemment utilisées
   */
  async warmup(): Promise<void> {
    this.logger.log('Warming up cache...');
    
    // Précharger quelques données de démonstration
    const commonCourses = ['course_001', 'course_002', 'course_003'];
    const commonStats = ['races', 'horses', 'jockeys'];

    try {
      await Promise.all([
        ...commonCourses.map(id => this.getCourseData(id)),
        ...commonStats.map(type => this.getStats_Cached(type)),
      ]);

      this.logger.log(`Cache warmed up with ${this.cache.size} entries`);
    } catch (error) {
      this.logger.error('Failed to warm up cache', error);
    }
  }
}
