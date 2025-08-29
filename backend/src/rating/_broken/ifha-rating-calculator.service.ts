import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

export interface RacePerformance {
  position: number;
  lengthsBehind: number;
  weightCarried: number;
  distance: number;
  raceCategory?: string;
  terrainCondition?: string;
  date: Date;
  opponents?: {
    name: string;
    position: number;
    isInternational?: boolean;
    knownRating?: number;
  }[];
}

export interface RatingCalculationResult {
  success: boolean;
  localRating: number;
  internationalRatings: {
    france: number;
    uk: number;
    uae: number;
    ifha: number;
  };
  confidence: number;
  racesAnalyzed: number;
  adjustmentReason?: string;
  recommendation: string;
}

@Injectable()
export class IFHARatingCalculatorService {
  private readonly logger = new Logger(IFHARatingCalculatorService.name);

  // Coefficients de conversion basés sur l'analyse IFHA
  private static readonly CONVERSION_COEFFICIENTS = {
    tunisiaToFrance: 0.9,      // TN 40 → FR 36
    franceToUK: 2.2,           // 1 kg FR = 2.2 lbs UK
    tunisiaToUAE: 0.9,         // Similaire à France
    tunisiaToIFHA: 0.85,       // Coefficient global IFHA
    confidenceThreshold: 3,     // Minimum 3 courses pour rating officiel
  };

  // Table de conversion détaillée IFHA
  private static readonly RATING_CONVERSION_TABLE = [
    { tn: 50, fr: 44, uk: 98, uae: 44, ifha: 42, comment: "Listed régional" },
    { tn: 45, fr: 41, uk: 91, uae: 41, ifha: 39, comment: "Bon handicap France" },
    { tn: 40, fr: 37, uk: 82, uae: 37, ifha: 35, comment: "Moyen handicap France" },
    { tn: 35, fr: 33, uk: 74, uae: 33, ifha: 32, comment: "Petit handicap France" },
    { tn: 30, fr: 29, uk: 66, uae: 29, ifha: 28, comment: "Limité international" },
    { tn: 25, fr: 25, uk: 57, uae: 25, ifha: 24, comment: "Niveau faible France" },
    { tn: 20, fr: 21, uk: 48, uae: 21, ifha: 20, comment: "Niveau plancher" },
  ];

  constructor(private prisma: PrismaService) {}

  /**
   * Calcule automatiquement le rating IFHA d'un cheval
   */
  async calculateHorseRating(
    horseId: string,
    performances: RacePerformance[]
  ): Promise<RatingCalculationResult> {
    try {
      this.logger.log(`🏇 Calcul du rating pour le cheval ${horseId}`);
      
      // Récupérer les dernières performances (maximum 10)
      const recentPerformances = performances
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 10);

      if (recentPerformances.length < 3) {
        const provisionalRating = this.calculateProvisionalRating(recentPerformances);
        return {
          success: false,
          localRating: provisionalRating,
          internationalRatings: this.convertToInternationalScales(provisionalRating),
          confidence: 25,
          racesAnalyzed: recentPerformances.length,
          recommendation: "Rating provisoire - minimum 3 courses requises pour validation IFHA",
        };
      }

      // Calculer le rating de base selon la méthode IFHA
      const baseRating = this.calculateBaseRating(recentPerformances);
      
      // Ajuster selon les références internationales
      const adjustedRating = await this.adjustWithInternationalReferences(
        baseRating,
        recentPerformances
      );

      // Convertir vers les échelles internationales
      const internationalRatings = this.convertToInternationalScales(adjustedRating);

      // Calculer le niveau de confiance
      const confidence = this.calculateConfidence(recentPerformances, adjustedRating);

      // Sauvegarder en base
      await this.saveRating(horseId, adjustedRating, internationalRatings, confidence, recentPerformances);

      return {
        success: true,
        localRating: adjustedRating,
        internationalRatings,
        confidence,
        racesAnalyzed: recentPerformances.length,
        recommendation: this.getRecommendation(adjustedRating, confidence),
      };

    } catch (error) {
      this.logger.error(`❌ Erreur calcul rating pour ${horseId}:`, error);
      throw error;
    }
  }

  /**
   * Calcule le rating de base selon les performances (méthode IFHA)
   */
  private calculateBaseRating(performances: RacePerformance[]): number {
    let totalPoints = 0;
    let totalWeight = 0;

    performances.forEach((perf, index) => {
      // Plus la performance est récente, plus elle a de poids
      const recencyWeight = 1 / (index + 1);
      const performanceScore = this.calculatePerformanceScore(perf);
      
      totalPoints += performanceScore * recencyWeight;
      totalWeight += recencyWeight;
    });

    const baseRating = totalPoints / totalWeight;
    return Math.round(baseRating * 10) / 10;
  }

  /**
   * Calcule le score de performance pour une course (standard IFHA)
   */
  private calculatePerformanceScore(performance: RacePerformance): number {
    let score = 35; // Base IFHA

    // Ajustement selon la position
    if (performance.position === 1) score += 15;
    else if (performance.position === 2) score += 8;
    else if (performance.position === 3) score += 5;
    else if (performance.position === 4) score += 2;
    else score -= (performance.position - 4) * 1.5;

    // Ajustement selon l'écart (1 longueur = 1 kg sur 1600-2000m)
    const lengthPenalty = this.getLengthPenalty(
      performance.lengthsBehind, 
      performance.distance
    );
    score -= lengthPenalty;

    // Ajustement selon le poids porté (référence 56kg)
    const weightAdjustment = (performance.weightCarried - 56) * 0.5;
    score += weightAdjustment;

    // Bonus selon la classe de course (standard IFHA)
    if (performance.raceCategory === 'Group1') score += 20;
    else if (performance.raceCategory === 'Group2') score += 15;
    else if (performance.raceCategory === 'Group3') score += 10;
    else if (performance.raceCategory === 'Listed') score += 7;
    else if (performance.raceCategory === 'Class1') score += 5;
    else if (performance.raceCategory === 'Class2') score += 3;

    // Ajustement terrain (si différent du bon)
    if (performance.terrainCondition === 'lourd') score -= 2;
    else if (performance.terrainCondition === 'très_lourd') score -= 4;
    else if (performance.terrainCondition === 'ferme') score += 1;

    return Math.max(20, Math.min(60, score));
  }

  /**
   * Convertit les longueurs en pénalité selon la distance (norme IFHA)
   */
  private getLengthPenalty(lengths: number, distance: number): number {
    if (!lengths || lengths <= 0) return 0;
    
    if (distance <= 1200) {
      return lengths * 2; // Sprint: 1 longueur = 2kg
    } else if (distance <= 1600) {
      return lengths * 1.5; // Mile court: 1 longueur = 1.5kg
    } else if (distance <= 2000) {
      return lengths * 1; // Mile: 1 longueur = 1kg (référence IFHA)
    } else if (distance <= 2400) {
      return lengths * 0.8; // Mile étendu: 1 longueur = 0.8kg
    } else {
      return lengths * 0.6; // Fond: 1 longueur = 0.6kg
    }
  }

  /**
   * Ajuste le rating avec les références internationales
   */
  private async adjustWithInternationalReferences(
    baseRating: number,
    performances: RacePerformance[]
  ): Promise<number> {
    let adjustedRating = baseRating;
    let totalAdjustments = 0;

    // Chercher des chevaux de référence dans les courses récentes
    for (const perf of performances) {
      if (!perf.opponents) continue;

      for (const opponent of perf.opponents) {
        if (!opponent.isInternational || !opponent.knownRating) continue;

        // Chercher dans notre base de références
        const reference = await this.prisma.internationalReference.findFirst({
          where: { 
            horseName: opponent.name,
            verified: true,
          },
        });

        if (reference) {
          // Calculer l'ajustement basé sur la performance relative
          const expectedDiff = Number(reference.officialRating) - baseRating;
          const actualDiff = opponent.position - perf.position;
          
          if (Math.abs(expectedDiff - actualDiff) > 2) {
            const adjustment = (actualDiff - expectedDiff) * 0.3;
            adjustedRating += adjustment;
            totalAdjustments++;
            
            this.logger.log(`🔄 Ajustement basé sur ${opponent.name}: ${adjustment.toFixed(1)}`);
          }
        }
      }
    }

    // Limiter l'impact des ajustements
    if (totalAdjustments > 0) {
      const maxAdjustment = baseRating * 0.15; // Maximum 15% d'ajustement
      const totalChange = adjustedRating - baseRating;
      if (Math.abs(totalChange) > maxAdjustment) {
        adjustedRating = baseRating + (totalChange > 0 ? maxAdjustment : -maxAdjustment);
      }
    }

    return Math.round(adjustedRating * 10) / 10;
  }

  /**
   * Convertit vers les échelles internationales (méthode IFHA)
   */
  private convertToInternationalScales(localRating: number): {
    france: number;
    uk: number;
    uae: number;
    ifha: number;
  } {
    // Utiliser la table de conversion pour plus de précision
    const conversionEntry = IFHARatingCalculatorService.RATING_CONVERSION_TABLE
      .find(entry => localRating >= entry.tn - 2.5 && localRating < entry.tn + 2.5);

    if (conversionEntry) {
      return {
        france: conversionEntry.fr,
        uk: conversionEntry.uk,
        uae: conversionEntry.uae,
        ifha: conversionEntry.ifha,
      };
    }

    // Interpolation linéaire si pas de correspondance exacte
    const france = localRating * IFHARatingCalculatorService.CONVERSION_COEFFICIENTS.tunisiaToFrance;
    const uk = france * IFHARatingCalculatorService.CONVERSION_COEFFICIENTS.franceToUK;
    const uae = localRating * IFHARatingCalculatorService.CONVERSION_COEFFICIENTS.tunisiaToUAE;
    const ifha = localRating * IFHARatingCalculatorService.CONVERSION_COEFFICIENTS.tunisiaToIFHA;

    return {
      france: Math.round(france * 10) / 10,
      uk: Math.round(uk),
      uae: Math.round(uae * 10) / 10,
      ifha: Math.round(ifha * 10) / 10,
    };
  }

  /**
   * Calcule le niveau de confiance du rating (0-100%)
   */
  private calculateConfidence(performances: RacePerformance[], rating: number): number {
    let confidence = 40; // Base

    // Bonus pour le nombre de courses
    confidence += Math.min(performances.length * 8, 40);

    // Analyse de la consistance
    const ratings = performances.map(p => this.calculatePerformanceScore(p));
    const variance = this.calculateVariance(ratings);
    confidence += Math.max(0, 20 - variance);

    // Bonus pour les références internationales
    const hasInternationalRefs = performances.some(p => 
      p.opponents?.some(o => o.isInternational)
    );
    if (hasInternationalRefs) confidence += 15;

    // Bonus pour la récence des performances
    const mostRecentDays = Math.floor(
      (Date.now() - performances[0].date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (mostRecentDays <= 90) confidence += 10;
    else if (mostRecentDays <= 180) confidence += 5;

    return Math.min(100, Math.max(0, Math.round(confidence)));
  }

  /**
   * Calcule la variance pour mesurer la consistance
   */
  private calculateVariance(values: number[]): number {
    if (values.length <= 1) return 0;
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / values.length);
  }

  /**
   * Génère une recommandation IFHA
   */
  private getRecommendation(rating: number, confidence: number): string {
    if (confidence < 60) {
      return "Rating provisoire - plus de courses nécessaires pour certification IFHA";
    }

    if (rating >= 45) {
      return "🌟 Niveau international confirmé - Eligible pour courses Groupe/Listed à l'étranger";
    } else if (rating >= 40) {
      return "🔥 Très bon niveau - Tentative en handicap international recommandée";
    } else if (rating >= 35) {
      return "✅ Bon cheval local - Compétitif en région MENA";
    } else if (rating >= 30) {
      return "📈 Niveau moyen - Courses locales et régionales";
    } else {
      return "🎯 En progression - Focus sur l'amélioration locale";
    }
  }

  /**
   * Calcule un rating provisoire pour moins de 3 courses
   */
  private calculateProvisionalRating(performances: RacePerformance[]): number {
    if (performances.length === 0) return 25; // Débutant

    const baseScore = performances.length > 0 
      ? this.calculateBaseRating(performances)
      : 30;

    // Pénalité pour manque de données
    return Math.round(baseScore * 0.85 * 10) / 10;
  }

  /**
   * Sauvegarde le rating en base de données
   */
  private async saveRating(
    horseId: string,
    localRating: number,
    internationalRatings: any,
    confidence: number,
    performances: RacePerformance[]
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
          localRating: new Decimal(localRating),
          franceRating: new Decimal(internationalRatings.france),
          ukRating: new Decimal(internationalRatings.uk),
          uaeRating: new Decimal(internationalRatings.uae),
          ifhaRating: new Decimal(internationalRatings.ifha),
          ratingType: 'auto',
          confidence: new Decimal(confidence),
          racesAnalyzed: performances.length,
          lastRaceDate: performances[0]?.date,
          isCurrent: true,
          assignedBy: 'system',
          calculationDate: new Date(),
        },
      });

      // Mettre à jour le rating courant du cheval
      await this.prisma.horse.update({
        where: { id: horseId },
        data: { currentRating: new Decimal(localRating) },
      });

      this.logger.log(`✅ Rating sauvegardé pour ${horseId}: ${localRating} (${confidence}% confiance)`);
    } catch (error) {
      this.logger.error('❌ Erreur sauvegarde rating:', error);
      throw error;
    }
  }

  /**
   * Récupère la table de conversion complète
   */
  static getConversionTable(): typeof IFHARatingCalculatorService.RATING_CONVERSION_TABLE {
    return IFHARatingCalculatorService.RATING_CONVERSION_TABLE;
  }

  /**
   * Conversion rapide d'un rating tunisien vers une échelle internationale
   */
  static convertRating(tunisianRating: number, targetScale: 'france' | 'uk' | 'uae' | 'ifha'): number {
    const coefficients = IFHARatingCalculatorService.CONVERSION_COEFFICIENTS;
    
    switch (targetScale) {
      case 'france':
        return Math.round(tunisianRating * coefficients.tunisiaToFrance * 10) / 10;
      case 'uk':
        return Math.round(tunisianRating * coefficients.tunisiaToFrance * coefficients.franceToUK);
      case 'uae':
        return Math.round(tunisianRating * coefficients.tunisiaToUAE * 10) / 10;
      case 'ifha':
        return Math.round(tunisianRating * coefficients.tunisiaToIFHA * 10) / 10;
      default:
        return tunisianRating;
    }
  }
}
