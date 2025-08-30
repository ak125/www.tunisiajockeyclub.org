import { Module } from '@nestjs/common';
import { AdvancedCacheService } from './advanced-cache.service';
import { CacheController } from './cache.controller';

@Module({
  providers: [AdvancedCacheService],
  controllers: [CacheController],
  exports: [AdvancedCacheService],
})
export class CacheModule {}
