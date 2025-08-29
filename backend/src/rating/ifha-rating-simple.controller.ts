import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { IFHARatingService } from './ifha-rating-simple.service';
import { PrismaService } from '../prisma/prisma.service';
import { PerformanceTestService } from './performance-test.service';
import { IFHACacheService } from './ifha-cache.service';

export interface ConversionRequest {
  tunisianRating: number;
  targetScale: 'france' | 'uk' | 'uae' | 'ifha';
}

@Controller('rating/ifha')
export class IFHARatingSimpleController {
  private readonly logger = new Logger(IFHARatingSimpleController.name);

  constructor(
    private readonly ifhaRatingService: IFHARatingService,
    private readonly prisma: PrismaService,
    private readonly performanceTestService: PerformanceTestService,
    private readonly cacheService: IFHACacheService,
  ) {}

  /**
   * Calcule automatiquement le rating IFHA d'un cheval
   */
  @Post('calculate/:horseId')
  async calculateRating(@Param('horseId') horseId: string) {
    try {
      this.logger.log(`🏇 Calcul du rating IFHA pour cheval ${horseId}`);
      
      const result = await this.ifhaRatingService.calculateHorseRating(horseId);

      this.logger.log(
        `✅ Rating calculé pour ${horseId}: ${result.localRating} (confiance: ${result.confidence}%)`,
      );

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error(`❌ Erreur calcul rating ${horseId}:`, message);
      throw new BadRequestException(`Erreur calcul rating: ${message}`);
    }
  }

  /**
   * Convertit un rating entre échelles internationales
   */
  @Post('convert')
  async convertRating(@Body() request: ConversionRequest) {
    try {
      const result = await this.ifhaRatingService.convertRating(
        request.tunisianRating,
        request.targetScale,
      );

      return {
        originalRating: result.original,
        convertedRating: result.converted,
        targetScale: result.scale,
        confidence: result.confidence,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error('❌ Erreur conversion rating:', message);
      throw new BadRequestException(`Erreur conversion: ${message}`);
    }
  }

  /**
   * Liste les ratings avec filtres
   */
  @Get('list')
  async listRatings(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('minRating') minRating?: string,
    @Query('maxRating') maxRating?: string,
  ) {
    try {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;

      const where: any = { isCurrent: true };

      if (minRating) {
        where.ratingValue = { 
          ...where.ratingValue, 
          gte: parseFloat(minRating),
        };
      }
      if (maxRating) {
        where.ratingValue = { 
          ...where.ratingValue, 
          lte: parseFloat(maxRating),
        };
      }

      const [ratings, total] = await Promise.all([
        this.prisma.horseRating.findMany({
          where,
          include: {
            horse: {
              select: {
                name: true,
                registrationNumber: true,
              },
            },
          },
          orderBy: {
            ratingValue: 'desc',
          },
          skip,
          take: limitNum,
        }),
        this.prisma.horseRating.count({ where }),
      ]);

      return {
        ratings,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalItems: total,
          itemsPerPage: limitNum,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error('❌ Erreur liste ratings:', message);
      throw new BadRequestException(`Erreur liste: ${message}`);
    }
  }

  /**
   * Détail du rating d'un cheval
   */
  @Get('horse/:horseId/detail')
  async getRatingDetail(@Param('horseId') horseId: string) {
    try {
      const rating = await this.prisma.horseRating.findFirst({
        where: { horseId, isCurrent: true },
        include: {
          horse: {
            select: {
              name: true,
              registrationNumber: true,
            },
          },
        },
      });

      if (!rating) {
        throw new NotFoundException(`Rating non trouvé pour cheval ${horseId}`);
      }

      // Calculer les conversions internationales
      const tunisianRating = Number(rating.ratingValue);
      const conversions = {
        france: Math.round(tunisianRating * 0.9 * 10) / 10,
        uk: Math.round(tunisianRating * 0.9 * 2.2 * 10) / 10,
        uae: Math.round(tunisianRating * 0.9 * 10) / 10,
        ifha: Math.round(tunisianRating * 0.85 * 10) / 10,
      };

      return {
        rating,
        internationalConversions: conversions,
        confidence: Number(rating.confidenceLevel),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error(`❌ Erreur détail rating ${horseId}:`, message);
      throw new BadRequestException(`Erreur détail: ${message}`);
    }
  }

  /**
   * Statistiques du système de rating
   */
  @Get('statistics')
  async getStatistics() {
    try {
      const stats = await this.ifhaRatingService.getStatistics();
      return stats;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error('❌ Erreur statistiques:', message);
      throw new BadRequestException(`Erreur statistiques: ${message}`);
    }
  }

  /**
   * Conversion rapide multiple
   */
  @Post('convert-all/:rating')
  async convertAllScales(@Param('rating') rating: string) {
    try {
      const tunisianRating = parseFloat(rating);
      
      if (isNaN(tunisianRating)) {
        throw new BadRequestException('Rating invalide');
      }

      const scales = ['france', 'uk', 'uae', 'ifha'] as const;
      const conversions: Record<string, { rating: number; confidence: number }> = {};

      for (const scale of scales) {
        const result = await this.ifhaRatingService.convertRating(
          tunisianRating,
          scale,
        );
        conversions[scale] = {
          rating: result.converted,
          confidence: result.confidence,
        };
      }

      return {
        originalRating: tunisianRating,
        conversions,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error('❌ Erreur conversion multiple:', message);
      throw new BadRequestException(`Erreur conversion: ${message}`);
    }
  }

  /**
   * Recalcule tous les ratings obsolètes
   */
  @Post('recalculate-all')
  async recalculateAll() {
    try {
      this.logger.log('🔄 Démarrage recalcul massif des ratings...');

      // Récupérer tous les chevaux avec des ratings anciens
      const horses = await this.prisma.horse.findMany({
        where: {
          isActive: true,
          ratings: {
            some: { isCurrent: true },
          },
        },
        include: {
          ratings: {
            where: { isCurrent: true },
            take: 1,
          },
        },
      });

      let recalculated = 0;
      let errors = 0;

      for (const horse of horses) {
        try {
          await this.ifhaRatingService.calculateHorseRating(horse.id);
          recalculated++;
          
          // Petit délai pour éviter la surcharge
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Erreur inconnue';
          this.logger.warn(`⚠️ Erreur recalcul ${horse.name}:`, message);
          errors++;
        }
      }

      const result = {
        success: true,
        message: `Recalcul terminé: ${recalculated} succès, ${errors} erreurs`,
        processed: horses.length,
        recalculated,
        errors,
        timestamp: new Date().toISOString(),
      };

      this.logger.log(`✅ ${result.message}`);
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error('❌ Erreur recalcul massif:', message);
      throw new BadRequestException(`Erreur recalcul: ${message}`);
    }
  }

  /**
   * Test de performance du système avec cache
   */
  @Get('test/performance')
  async testPerformance() {
    try {
      this.logger.log('🚀 Lancement test de performance IFHA');
      
      const results = await this.performanceTestService.runPerformanceTest();
      
      this.logger.log('✅ Test de performance terminé');
      return results;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error('❌ Erreur test performance:', message);
      throw new BadRequestException(`Erreur test performance: ${message}`);
    }
  }

  /**
   * Test de charge concurrent
   */
  @Get('test/load')
  async testLoad(@Query('concurrent') concurrent?: string) {
    try {
      const concurrentCount = concurrent ? parseInt(concurrent) : 10;
      this.logger.log(`🔥 Test de charge avec ${concurrentCount} requêtes`);
      
      const results = await this.performanceTestService.runLoadTest(
        concurrentCount,
      );
      
      this.logger.log('✅ Test de charge terminé');
      return results;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error('❌ Erreur test charge:', message);
      throw new BadRequestException(`Erreur test charge: ${message}`);
    }
  }

  /**
   * Métriques du cache Redis
   */
  @Get('cache/metrics')
  async getCacheMetrics() {
    try {
      this.logger.log('📊 Récupération métriques cache');
      
      const metrics = await this.cacheService.getCacheMetrics();
      
      return {
        success: true,
        metrics,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error('❌ Erreur métriques cache:', message);
      throw new BadRequestException(`Erreur métriques: ${message}`);
    }
  }

  /**
   * Vider le cache IFHA
   */
  @Post('cache/clear')
  async clearCache() {
    try {
      this.logger.log('🗑️ Vidage du cache IFHA');
      
      await this.cacheService.invalidateAllIFHACache();
      
      this.logger.log('✅ Cache IFHA vidé');
      return {
        success: true,
        message: 'Cache IFHA vidé avec succès',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error('❌ Erreur vidage cache:', message);
      throw new BadRequestException(`Erreur vidage cache: ${message}`);
    }
  }
}
