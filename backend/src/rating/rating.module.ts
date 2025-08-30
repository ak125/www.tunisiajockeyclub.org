import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

// Service IFHA simplifié et fonctionnel
import { IFHARatingService } from './ifha-rating-simple.service';
import { IFHARatingSimpleController } from './ifha-rating-simple.controller';
import { IFHACacheService } from './ifha-cache.service';
import { PerformanceMonitoringService } from './performance-monitoring.service';
import { PerformanceTestService } from './performance-test.service';

// Modules anciens (compatibilité temporaire)
import { RatingService } from './rating-simple.service';
import { RatingController } from './rating-simple.controller';
import { SimpleTestController } from './simple-test.controller';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseRestService } from '../supabase/supabase-rest.service';

/**
 * Module de rating IFHA simplifié et fonctionnel
 * - Version IFHA simplifiée qui compile et fonctionne
 * - Utilise seulement les champs existants du schéma
 * - Compatible avec la base de données actuelle
 */
@Module({
  imports: [PrismaModule],
  controllers: [
    // Contrôleur IFHA simplifié (fonctionne)
    IFHARatingSimpleController,
    // Anciens contrôleurs (compatibilité)
    RatingController,
    SimpleTestController,
  ],
  providers: [
    // Service IFHA simplifié (fonctionne)
    IFHARatingService,
    // Service de cache IFHA
    IFHACacheService,
    // Services de monitoring et performance
    PerformanceMonitoringService,
    PerformanceTestService,
    // Anciens services (compatibilité)
    RatingService,
    PrismaService,
    SupabaseRestService,
  ],
  exports: [
    // Nouveaux exports
    IFHARatingService,
    IFHACacheService,
    PerformanceMonitoringService,
    PerformanceTestService,
    // Anciens exports
    RatingService,
  ],
})
export class RatingModule {}
