import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CoursesTestController } from './courses-test.controller';
import { CoursesTestService } from './courses-test.service';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { SupabaseRestService } from '../supabase/supabase-rest.service';
import { CacheModule } from '../common/cache/cache.module';
import { CacheModule as AdvancedCacheModule } from '../cache/cache.module';

@Module({
  imports: [CacheModule, AdvancedCacheModule],
  controllers: [CoursesController, CoursesTestController],
  providers: [
    CoursesService,
    CoursesTestService,
    PrismaService,
    SupabaseService,
    SupabaseRestService,
  ],
  exports: [CoursesService, CoursesTestService],
})
export class CoursesModule {}
