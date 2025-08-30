import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RemixModule } from './remix/remix.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ApiModule } from './api/api.module';
import { SupabaseService } from './supabase/supabase.service';
import { SupabaseRestService } from './supabase/supabase-rest.service';
import { TestController } from './test/test.controller';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthApiController } from './auth/auth-api.controller';
import { HorsesController } from './horses/horses.controller';
import { RatingModule } from './rating/rating.module';
import { SecurityModule } from './security/security.module';
import { CacheModule } from './common/cache/cache.module';
import { CacheModule as AdvancedCacheModule } from './cache/cache.module';
import { ValidationModule } from './validation/validation.module';
import { HealthModule } from './health/health.module';
import { CoursesModule } from './courses/courses.module';
import { EventsModule } from './events/events.module';
import { MonitoringModule } from './monitoring/monitoring.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RemixModule,
    AuthModule,
    ApiModule,
    DashboardModule,
    RatingModule,
    SecurityModule,
    CacheModule,
    AdvancedCacheModule,
    ValidationModule,
    HealthModule,
    CoursesModule,
    EventsModule,
    MonitoringModule,
  ],
  controllers: [TestController, AuthApiController, HorsesController],
  providers: [PrismaService, SupabaseService, SupabaseRestService],
})
export class AppModule {}
