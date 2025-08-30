import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IFHACacheService } from './ifha-cache.service';
import { Decimal } from '@prisma/client/runtime/library';

export interface RatingCalculationResult {
  horseId: string;
  localRating: number;
  confidence: number;
  racesAnalyzed: number;
  adjustments: {
    weight: number;
    terrain: number;
    class: number;
    international: number;
  };
  internationalConversions: {
    france: number;
    uk: number;
    uae: number;
    ifha: number;
  };
}

@Injectable()
export class IFHARatingService {
  private readonly logger = new Logger(IFHARatingService.name);

  constructor(
    private prisma: PrismaService,
    private cacheService: IFHACacheService,
  ) {}

  /**
   * Calcule le rating IFHA simplifié d'un cheval
   */
  async calculateHorseRating(
    horseId: string,
  ): Promise<RatingCalculationResult> {
    // Vérifier le cache d'abord
    const cached = await this.cacheService.getCachedHorseRating(horseId);
    if (cached) {
      this.logger.log(`Rating trouvé en cache pour cheval ${horseId}`);
      return cached;
    }

    try {
      this.logger.log(`🏇 Calcul rating IFHA pour cheval ${horseId}`);

      // Récupérer les performances récentes
      const performances = await this.prisma.raceResult.findMany({
        where: { horseId },
        include: {
          race: {
            include: { racecourse: true },
          },
        },
        orderBy: { race: { raceDate: 'desc' } },
        take: 5,
      });

      if (performances.length === 0) {
        throw new Error('Aucune performance trouvée');
      }

      // Calcul de base selon les performances
      let baseRating = this.calculateBaseRating(performances);

      // Ajustements
      const adjustments = {
        weight: this.calculateWeightAdjustment(performances),
        terrain: this.calculateTerrainAdjustment(performances),
        class: this.calculateClassAdjustment(performances),
        international: 0,
      };

      // Rating final
      const finalRating = baseRating + 
        adjustments.weight + 
        adjustments.terrain + 
        adjustments.class;

      // Niveau de confiance
      const confidence = this.calculateConfidence(performances.length, finalRating);

      // Conversions internationales
      const internationalConversions = {
        france: Math.round(finalRating * 0.9 * 10) / 10,
        uk: Math.round(finalRating * 0.9 * 2.2 * 10) / 10,
        uae: Math.round(finalRating * 0.9 * 10) / 10,
        ifha: Math.round(finalRating * 0.85 * 10) / 10,
      };

      // Sauvegarder le rating
      await this.saveRating(horseId, finalRating, confidence, performances.length);

      const result = {
        horseId,
        localRating: Math.round(finalRating * 10) / 10,
        confidence,
        racesAnalyzed: performances.length,
        adjustments,
        internationalConversions,
      };

      this.logger.log(
        `✅ Rating calculé: ${result.localRating} (confiance: ${result.confidence}%)`,
      );

      // Mettre en cache le résultat
      await this.cacheService.cacheHorseRating(horseId, result);

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error(`❌ Erreur calcul rating ${horseId}:`, message);
      throw new Error(message);
    }
  }

  /**
   * Convertit un rating tunisien vers une échelle internationale
   */
  async convertRating(
    tunisianRating: number,
    targetScale: string,
  ): Promise<{
    original: number;
    converted: number;
    scale: string;
    confidence: number;
  }> {
    // Vérifier le cache d'abord
    const cacheKey = `conversion:${tunisianRating}:${targetScale}`;
    const cachedResult = await this.cacheService.getCachedConversion(cacheKey);
    
    if (cachedResult) {
      this.logger.debug(
        `🎯 Conversion trouvée en cache: ${tunisianRating} → ${cachedResult.converted} (${targetScale})`,
      );
      return cachedResult;
    }

    const conversionFactors: { [key: string]: number } = {
      france: 0.9,
      uk: 1.98, // 0.9 * 2.2
      uae: 0.9,
      ifha: 0.85,
    };

    const factor = conversionFactors[targetScale] || 1.0;
    const converted = Math.round(tunisianRating * factor * 10) / 10;

    const conversionResult = {
      original: tunisianRating,
      converted,
      scale: targetScale,
      confidence: this.calculateConversionConfidence(
        tunisianRating,
        targetScale,
      ),
    };

    // Mettre en cache le résultat
    await this.cacheService.cacheConversion(cacheKey, conversionResult);

    return conversionResult;
  }

  /**
   * Récupère les statistiques globales
   */
  async getStatistics() {
    // Vérifier le cache d'abord
    const cachedStats = await this.cacheService.getCachedStatistics();
    
    if (cachedStats) {
      this.logger.debug('📊 Statistiques trouvées en cache');
      return cachedStats;
    }

    try {
      const [totalRatings, avgRating] = await Promise.all([
        this.prisma.horseRating.count({ where: { isCurrent: true } }),
        this.prisma.horseRating.aggregate({
          where: { isCurrent: true },
          _avg: { ratingValue: true },
        }),
      ]);

      const stats = {
        totalRatings,
        averageRating:
          Math.round(Number(avgRating._avg?.ratingValue || 0) * 10) / 10,
        lastUpdate: new Date().toISOString(),
      };

      // Mettre en cache les statistiques
      await this.cacheService.cacheStatistics(stats);

      return stats;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error('❌ Erreur statistiques:', message);
      return {
        totalRatings: 0,
        averageRating: 0,
        lastUpdate: new Date().toISOString(),
      };
    }
  }

  /**
   * Calcule le rating de base selon les performances
   */
  private calculateBaseRating(performances: any[]): number {
    let totalPoints = 0;
    let weightedRaces = 0;

    performances.forEach((perf, index) => {
      // Poids décroissant pour les courses plus anciennes
      const raceWeight = Math.max(0.5, 1 - (index * 0.1));
      
      // Points selon la position
      let points = 0;
      if (perf.position === 1) points = 100;
      else if (perf.position === 2) points = 85;
      else if (perf.position === 3) points = 75;
      else if (perf.position <= 5) points = 65 - (perf.position - 4) * 5;
      else points = Math.max(30, 60 - (perf.position - 5) * 2);

      // Ajustement selon la distance de battement
      const lengthsBehind = Number(perf.lengthsBehind || 0);
      if (lengthsBehind > 0) {
        points -= Math.min(20, lengthsBehind * 2);
      }

      totalPoints += points * raceWeight;
      weightedRaces += raceWeight;
    });

    return weightedRaces > 0 ? totalPoints / weightedRaces : 50;
  }

  /**
   * Calcule l'ajustement de poids
   */
  private calculateWeightAdjustment(performances: any[]): number {
    const avgWeight = performances.reduce(
      (sum, perf) => sum + Number(perf.weightCarriedKg || 55),
      0,
    ) / performances.length;

    // Référence: 55kg
    const weightDiff = avgWeight - 55;
    return -weightDiff * 2; // -2 points par kg supplémentaire
  }

  /**
   * Calcule l'ajustement de terrain
   */
  private calculateTerrainAdjustment(performances: any[]): number {
    // Bonus pour diversité des terrains
    const terrains = new Set(
      performances.map(p => p.race.terrainState).filter(Boolean)
    );
    return terrains.size > 2 ? 2 : 0;
  }

  /**
   * Calcule l'ajustement de classe
   */
  private calculateClassAdjustment(performances: any[]): number {
    const hasGroupRace = performances.some(
      p => p.race.category && p.race.category.toLowerCase().includes('group')
    );
    const hasListedRace = performances.some(
      p => p.race.category && p.race.category.toLowerCase().includes('listed')
    );

    if (hasGroupRace) return 5;
    if (hasListedRace) return 3;
    return 0;
  }

  /**
   * Calcule le niveau de confiance
   */
  private calculateConfidence(raceCount: number, rating: number): number {
    let confidence = 50; // Base

    // Plus de courses = plus de confiance
    confidence += Math.min(30, raceCount * 6);

    // Ratings extrêmes = moins de confiance
    if (rating > 100 || rating < 30) {
      confidence -= 15;
    }

    return Math.min(95, Math.max(20, Math.round(confidence)));
  }

  /**
   * Calcule la confiance d'une conversion
   */
  private calculateConversionConfidence(rating: number, targetScale: string): number {
    let confidence = 80;

    // Ajustement selon l'échelle
    switch (targetScale) {
      case 'france':
      case 'uae':
        confidence = 85; // Échelles similaires
        break;
      case 'uk':
        confidence = 70; // Système différent
        break;
      case 'ifha':
        confidence = 75; // Standard international
        break;
    }

    // Réduction pour ratings extrêmes
    if (rating > 100 || rating < 30) {
      confidence -= 10;
    }

    return confidence;
  }

  /**
   * Sauvegarde un rating calculé
   */
  private async saveRating(
    horseId: string,
    rating: number,
    confidence: number,
    racesAnalyzed: number,
  ): Promise<void> {
    try {
      // Désactiver l'ancien rating
      await this.prisma.horseRating.updateMany({
        where: { horseId, isCurrent: true },
        data: { isCurrent: false },
      });

      // Créer le nouveau rating
      await this.prisma.horseRating.create({
        data: {
          horseId,
          ratingValue: new Decimal(rating),
          ratingType: 'calculated',
          confidenceLevel: new Decimal(confidence),
          isCurrent: true,
          assignedBy: 'system',
          notes: `Calculé automatiquement sur ${racesAnalyzed} courses`,
        },
      });

      // Mettre à jour le cheval
      await this.prisma.horse.update({
        where: { id: horseId },
        data: { currentRating: new Decimal(rating) },
      });

    } catch (error) {
      this.logger.error(`❌ Erreur sauvegarde rating ${horseId}:`, error);
    }
  }
}
