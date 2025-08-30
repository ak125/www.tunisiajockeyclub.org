import { Controller, Get, Post, Delete, Param, Query } from '@nestjs/common';
import { AdvancedCacheService } from './advanced-cache.service';
import { Public } from '../auth/global-auth.guard';

@Public()
@Controller('cache')
export class CacheController {
  constructor(private readonly cacheService: AdvancedCacheService) {}

  @Get('stats')
  getCacheStats() {
    return {
      cache: this.cacheService.getStats(),
      timestamp: new Date(),
    };
  }

  @Get('keys')
  getCacheKeys() {
    return {
      keys: this.cacheService.getKeys(),
      count: this.cacheService.getKeys().length,
      timestamp: new Date(),
    };
  }

  @Get('top')
  getTopEntries(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return {
      entries: this.cacheService.getTopEntries(limitNum),
      timestamp: new Date(),
    };
  }

  @Delete('clear')
  clearCache() {
    this.cacheService.clear();
    return {
      success: true,
      message: 'Cache vidé avec succès',
      timestamp: new Date(),
    };
  }

  @Delete('key/:key')
  deleteKey(@Param('key') key: string) {
    const deleted = this.cacheService.delete(key);
    return {
      success: deleted,
      message: deleted ? `Clé ${key} supprimée` : `Clé ${key} non trouvée`,
      key,
      timestamp: new Date(),
    };
  }

  @Post('warmup')
  async warmupCache() {
    await this.cacheService.warmup();
    return {
      success: true,
      message: 'Cache préchauffé avec succès',
      stats: this.cacheService.getStats(),
      timestamp: new Date(),
    };
  }

  @Get('test/course/:id')
  async testCourseCache(@Param('id') courseId: string) {
    const start = Date.now();
    const data = await this.cacheService.getCourseData(courseId);
    const duration = Date.now() - start;
    
    return {
      data,
      performance: {
        duration: `${duration}ms`,
        cached: duration < 10, // Si très rapide, probablement depuis le cache
      },
      timestamp: new Date(),
    };
  }

  @Get('test/stats/:type')
  async testStatsCache(@Param('type') type: string) {
    const start = Date.now();
    const data = await this.cacheService.getStats_Cached(type);
    const duration = Date.now() - start;
    
    return {
      data,
      performance: {
        duration: `${duration}ms`,
        cached: duration < 10,
      },
      timestamp: new Date(),
    };
  }
}
