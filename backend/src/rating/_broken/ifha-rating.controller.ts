import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { IFHARatingCalculatorService, RatingCalculationResult } from './ifha-rating-calculator.service';
import { IFHAIntegrationService } from './ifha-integration.service';
import { PrismaService } from '../prisma/prisma.service';

export interface ConversionRequest {
  tunisianRating: number;
  targetScale: 'france' | 'uk' | 'uae' | 'ifha';
}

export interface ConversionResult {
  originalRating: number;
  convertedRating: number;
  targetScale: string;
  conversionFactor: number;
  confidence: number;
}

export interface ManualRatingRequest {
  horseId: string;
  localRating: number;
  reason: string;
  validatedBy: string;
}

export interface RatingValidationRequest {
  ratingId: string;
  validatedBy: string;
  notes?: string;
}

@Controller('rating/ifha')
export class IFHARatingController {
  private readonly logger = new Logger(IFHARatingController.name);

  constructor(
    private readonly ratingCalculator: IFHARatingCalculatorService,
    private readonly ifhaIntegration: IFHAIntegrationService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Calcule automatiquement le rating IFHA d'un cheval
   */
  @Post('calculate/:horseId')
  async calculateRating(@Param('horseId') horseId: string): Promise<RatingCalculationResult> {
    try {
      this.logger.log(`🏇 Calcul du rating IFHA pour cheval ${horseId}`);
      
      // Récupérer les performances récentes du cheval
      const performances = await this.prisma.raceResult.findMany({
        where: { horseId },
        include: {
          race: {
            include: {
              racecourse: true,
            },
          },
          horse: true,
        },
        orderBy: { race: { raceDate: 'desc' } },
        take: 10, // Dernières 10 courses
      });

      if (performances.length === 0) {
        throw new BadRequestException('Aucune performance trouvée pour ce cheval');
      }

      // Formater les données pour le calculateur
      const formattedPerformances = performances.map((perf) => ({
        position: perf.position,
        lengthsBehind: Number(perf.lengthsBehind || 0),
        weightCarried: Number(perf.weightCarriedKg || 0),
        distance: perf.race.distanceMeters,
        raceCategory: perf.race.category || undefined,
        terrainCondition: perf.race.terrainState || undefined,
        date: perf.race.raceDate,
        opponents: [], // Simplifié pour l'instant
      }));

      const result = await this.ratingCalculator.calculateHorseRating(horseId, formattedPerformances);

      this.logger.log(
        `✅ Rating calculé pour ${horseId}: ${result.localRating} (confiance: ${result.confidence}%)`,
      );

      return result;
    } catch (error) {
      this.logger.error(`❌ Erreur calcul rating ${horseId}:`, error);
      throw new BadRequestException(`Erreur calcul rating: ${error.message}`);
    }
  }

  /**
   * Convertit un rating entre échelles internationales
   */
  @Post('convert')
  async convertRating(@Body() request: ConversionRequest): Promise<ConversionResult> {
    try {
      const conversionFactors = {
        france: 0.9,
        uk: 2.0, // TN->UK: TN->France puis France->UK (0.9 * 2.2)
        uae: 0.9,
        ifha: 0.85,
      };

      const factor = conversionFactors[request.targetScale];
      const convertedRating = Math.round(request.tunisianRating * factor * 10) / 10;

      return {
        originalRating: request.tunisianRating,
        convertedRating,
        targetScale: request.targetScale,
        conversionFactor: factor,
        confidence: this.calculateConversionConfidence(request.tunisianRating, request.targetScale),
      };
    } catch (error) {
      this.logger.error('❌ Erreur conversion rating:', error);
      throw new BadRequestException(`Erreur conversion: ${error.message}`);
    }
  }

  /**
   * Récupère la table de conversion IFHA
   */
  @Get('conversion-table')
  async getConversionTable() {
    try {
      const table = await this.prisma.ratingConversionTable.findMany({
        where: { isActive: true },
        orderBy: { tunisiaMin: 'asc' },
      });

      return { conversionTable: table };
    } catch (error) {
      this.logger.error('❌ Erreur récupération table conversion:', error);
      throw new BadRequestException(`Erreur table conversion: ${error.message}`);
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
    @Query('validated') validated?: string,
  ) {
    try {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;

      const where: any = { isCurrent: true };

      if (minRating) {
        where.ratingValue = { ...where.ratingValue, gte: parseFloat(minRating) };
      }
      if (maxRating) {
        where.ratingValue = { ...where.ratingValue, lte: parseFloat(maxRating) };
      }
      if (validated === 'true') {
        where.isValidated = true;
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
      this.logger.error('❌ Erreur liste ratings:', error);
      throw new BadRequestException(`Erreur liste: ${error.message}`);
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
          performanceAnalyses: {
            orderBy: { analyzedAt: 'desc' },
            take: 5,
          },
          ratingAdjustments: {
            orderBy: { createdAt: 'desc' },
            take: 5,
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
      this.logger.error(`❌ Erreur détail rating ${horseId}:`, error);
      throw new BadRequestException(`Erreur détail: ${error.message}`);
    }
  }

  /**
   * Valide un rating manuellement
   */
  @Put('validate')
  async validateRating(@Body() request: RatingValidationRequest) {
    try {
      const updatedRating = await this.prisma.horseRating.update({
        where: { id: request.ratingId },
        data: {
          // isValidated: true, // Ce champ n'existe pas dans le schéma actuel
          // validatedBy: request.validatedBy,
          // validatedAt: new Date(),
          notes: request.notes,
        },
        include: {
          horse: {
            select: { name: true },
          },
        },
      });

      this.logger.log(`✅ Rating validé pour ${updatedRating.horse.name}`);

      return {
        success: true,
        message: 'Rating validé avec succès',
        rating: updatedRating,
      };
    } catch (error) {
      this.logger.error('❌ Erreur validation rating:', error);
      throw new BadRequestException(`Erreur validation: ${error.message}`);
    }
  }

  /**
   * Ajuste un rating manuellement
   */
  @Put('adjust')
  async adjustRating(@Body() request: ManualRatingRequest) {
    try {
      // Récupérer le rating actuel
      const currentRating = await this.prisma.horseRating.findFirst({
        where: { horseId: request.horseId, isCurrent: true },
        include: { horse: { select: { name: true } } },
      });

      if (!currentRating) {
        throw new NotFoundException(`Rating actuel non trouvé pour cheval ${request.horseId}`);
      }

      // Désactiver l'ancien rating
      await this.prisma.horseRating.updateMany({
        where: { horseId: request.horseId, isCurrent: true },
        data: { isCurrent: false },
      });

      // Créer le nouveau rating
      const newRating = await this.prisma.horseRating.create({
        data: {
          horseId: request.horseId,
          ratingValue: request.localRating,
          ratingType: 'manual',
          // adjustmentReason: request.reason, // Ce champ n'existe pas
          // isValidated: true,
          // validatedBy: request.validatedBy,
          // validatedAt: new Date(),
          isCurrent: true,
          assignedBy: request.validatedBy,
          notes: request.reason,
        },
      });

      // Enregistrer l'ajustement dans l'historique
      await this.prisma.ratingAdjustment.create({
        data: {
          horseRatingId: newRating.id,
          previousRating: currentRating.ratingValue,
          newRating: request.localRating,
          adjustmentType: 'manual',
          notes: request.reason,
          adjustedBy: request.validatedBy,
        },
      });

      // Mettre à jour le rating du cheval
      await this.prisma.horse.update({
        where: { id: request.horseId },
        data: { currentRating: request.localRating },
      });

      this.logger.log(
        `✅ Rating ajusté pour ${currentRating.horse.name}: ${currentRating.ratingValue} → ${request.localRating}`,
      );

      return {
        success: true,
        message: 'Rating ajusté avec succès',
        oldRating: currentRating.ratingValue,
        newRating: request.localRating,
      };
    } catch (error) {
      this.logger.error('❌ Erreur ajustement rating:', error);
      throw new BadRequestException(`Erreur ajustement: ${error.message}`);
    }
  }

  /**
   * Soumet un rating à l'IFHA pour validation
   */
  @Post('submit-ifha/:horseId')
  async submitToIFHA(@Param('horseId') horseId: string) {
    try {
      const result = await this.ifhaIntegration.submitRatingToIFHA(horseId);
      
      this.logger.log(`🌍 Soumission IFHA ${horseId}: ${result.success ? 'Acceptée' : 'Refusée'}`);
      
      return result;
    } catch (error) {
      this.logger.error(`❌ Erreur soumission IFHA ${horseId}:`, error);
      throw new BadRequestException(`Erreur soumission IFHA: ${error.message}`);
    }
  }

  /**
   * Synchronise avec les données IFHA
   */
  @Post('sync-ifha')
  async syncIFHA() {
    try {
      this.logger.log('🔄 Démarrage synchronisation IFHA...');
      
      await this.ifhaIntegration.syncIFHARatings();
      
      return {
        success: true,
        message: 'Synchronisation IFHA terminée',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('❌ Erreur synchronisation IFHA:', error);
      throw new BadRequestException(`Erreur sync IFHA: ${error.message}`);
    }
  }

  /**
   * Statistiques du système de rating
   */
  @Get('statistics')
  async getStatistics() {
    try {
      const [
        totalRatings,
        validatedRatings,
        avgRating,
        recentRatings,
        ratingDistribution,
      ] = await Promise.all([
        this.prisma.horseRating.count({ where: { isCurrent: true } }),
        this.prisma.horseRating.count({ where: { isCurrent: true } }), // Pas de isValidated
        this.prisma.horseRating.aggregate({
          where: { isCurrent: true },
          _avg: { ratingValue: true },
        }),
        this.prisma.horseRating.count({
          where: {
            isCurrent: true,
            createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          },
        }),
        this.prisma.horseRating.groupBy({
          by: ['ratingValue'],
          where: { isCurrent: true },
          _count: true,
        }),
      ]);

      // Distribuer les ratings par tranches
      const distribution = {
        '90+': 0,
        '80-89': 0,
        '70-79': 0,
        '60-69': 0,
        '50-59': 0,
        '<50': 0,
      };

      ratingDistribution.forEach((item) => {
        const rating = Number(item.ratingValue);
        const count = typeof item._count === 'number' ? item._count : 
                     typeof item._count === 'object' && item._count ? 
                     (item._count._all || 0) : 0;
                     
        if (rating >= 90) distribution['90+'] += count;
        else if (rating >= 80) distribution['80-89'] += count;
        else if (rating >= 70) distribution['70-79'] += count;
        else if (rating >= 60) distribution['60-69'] += count;
        else if (rating >= 50) distribution['50-59'] += count;
        else distribution['<50'] += count;
      });

      return {
        totalRatings,
        validatedRatings,
        averageRating: Math.round(Number(avgRating._avg?.ratingValue || 0) * 10) / 10,
        recentRatings30Days: recentRatings,
        distribution,
        lastUpdate: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('❌ Erreur statistiques:', error);
      throw new BadRequestException(`Erreur statistiques: ${error.message}`);
    }
  }

  /**
   * Calcule la confiance d'une conversion
   */
  private calculateConversionConfidence(rating: number, targetScale: string): number {
    let baseConfidence = 85;

    // Réduire la confiance pour les très hauts et très bas ratings
    if (rating > 100 || rating < 30) {
      baseConfidence -= 15;
    }

    // Ajuster selon l'échelle cible
    switch (targetScale) {
      case 'france':
      case 'uae':
        return baseConfidence; // Confiance élevée, échelles similaires
      case 'uk':
        return baseConfidence - 10; // Système différent
      case 'ifha':
        return baseConfidence - 5; // Standard international
      default:
        return baseConfidence - 20;
    }
  }
}
