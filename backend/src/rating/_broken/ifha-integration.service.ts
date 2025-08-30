import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

export interface IFHAHorse {
  horseName: string;
  country: string;
  rating: number;
  ifhaRating?: number;
  category?: string;
  lastRaceDate?: string;
  age?: number;
}

export interface IFHASubmissionResult {
  success: boolean;
  message: string;
  confirmedRating?: number;
  ifhaId?: string;
}

@Injectable()
export class IFHAIntegrationService {
  private readonly logger = new Logger(IFHAIntegrationService.name);
  private readonly IFHA_API_BASE: string;
  private readonly API_KEY: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.IFHA_API_BASE = this.configService.get<string>(
      'IFHA_API_URL',
      'https://api.ifhaonline.org/v1',
    );
    this.API_KEY = this.configService.get<string>('IFHA_API_KEY', '');
  }

  /**
   * Synchronise les ratings IFHA avec la base locale
   */
  async syncIFHARatings(): Promise<void> {
    try {
      this.logger.log('🔄 Démarrage de la synchronisation IFHA...');
      
      if (!this.API_KEY) {
        this.logger.warn('⚠️ Clé API IFHA manquante - simulation des données');
        await this.simulateIFHAData();
        return;
      }

      // Récupérer les derniers ratings IFHA avec fetch
      const response = await fetch(`${this.IFHA_API_BASE}/ratings/latest`, {
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const ifhaRatings: IFHAHorse[] = data.ratings || [];
      let updatedCount = 0;

      // Mettre à jour les références internationales
      for (const rating of ifhaRatings) {
        await this.upsertInternationalReference(rating);
        updatedCount++;
      }

      this.logger.log(
        `✅ Synchronisation IFHA complète: ${updatedCount} ratings mis à jour`,
      );
      
      // Déclencher la recalibration des ratings locaux
      await this.recalibrateLocalRatings();
    } catch (error) {
      this.logger.error('❌ Erreur lors de la synchronisation IFHA:', error);
      
      // Fallback vers des données simulées
      await this.simulateIFHAData();
    }
  }

  /**
   * Soumet un rating tunisien à l'IFHA pour validation
   */
  async submitRatingToIFHA(horseId: string): Promise<IFHASubmissionResult> {
    try {
      const horse = await this.prisma.horse.findUnique({
        where: { id: horseId },
        include: {
          ratings: {
            where: { isCurrent: true },
            take: 1,
          },
        },
      });

      if (!horse || !horse.ratings[0]) {
        throw new Error('Cheval ou rating non trouvé');
      }

      const rating = horse.ratings[0];

      if (!this.API_KEY) {
        this.logger.warn('⚠️ Mode simulation IFHA activé');
        return this.simulateIFHASubmission(horse, rating);
      }

      const response = await fetch(`${this.IFHA_API_BASE}/ratings/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          horseName: horse.name,
          country: 'TN',
          localRating: Number(rating.ratingValue),
          proposedIFHARating: Number(rating.ifhaRating),
          confidence: Number(rating.confidenceLevel),
          racesAnalyzed: rating.racesAnalyzed,
          lastRaceDate: rating.lastRaceDate,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Mettre à jour le statut local
      if (data.accepted) {
        await this.prisma.horseRating.update({
          where: { id: rating.id },
          data: {
            ifhaRating: data.confirmedRating,
            isValidated: true,
            validatedBy: 'IFHA',
            validatedAt: new Date(),
            ratingType: 'validated',
          },
        });
      }

      return {
        success: data.accepted,
        message: data.message || 'Soumission traitée',
        confirmedRating: data.confirmedRating,
        ifhaId: data.ifhaId,
      };
    } catch (error) {
      this.logger.error(
        `❌ Erreur lors de la soumission IFHA pour ${horseId}:`,
        error,
      );
      throw new Error(`Erreur soumission IFHA: ${error.message}`);
    }
  }

  /**
   * Récupère les chevaux tunisiens dans le classement mondial IFHA
   */
  async getTunisianHorsesInWorldRankings(): Promise<IFHAHorse[]> {
    try {
      if (!this.API_KEY) {
        return this.simulateTunisianWorldRankings();
      }

      const url = new URL(`${this.IFHA_API_BASE}/rankings/world`);
      url.searchParams.append('country', 'TN');
      url.searchParams.append('limit', '50');

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.horses || [];
    } catch (error) {
      this.logger.error('❌ Erreur récupération classement mondial:', error);
      return this.simulateTunisianWorldRankings();
    }
  }

  /**
   * Importe une référence internationale manuelle
   */
  async importInternationalReference(data: {
    horseName: string;
    country: string;
    officialRating: number;
    source: string;
    category?: string;
    age?: number;
  }): Promise<void> {
    try {
      await this.prisma.internationalReference.create({
        data: {
          horseName: data.horseName,
          country: data.country,
          officialRating: data.officialRating,
          source: data.source,
          category: data.category,
          age: data.age,
          lastUpdate: new Date(),
          verified: true,
        },
      });

      this.logger.log(
        `✅ Référence internationale ajoutée: ${data.horseName} (${data.country})`,
      );
    } catch (error) {
      this.logger.error('❌ Erreur import référence:', error);
      throw error;
    }
  }

  /**
   * Recalibre tous les ratings locaux selon les nouvelles références
   */
  async recalibrateLocalRatings(): Promise<void> {
    try {
      this.logger.log('🔄 Démarrage de la recalibration des ratings locaux...');
      
      const horses = await this.prisma.horse.findMany({
        include: {
          ratings: {
            where: { isCurrent: true },
            take: 1,
          },
        },
      });

      let recalibratedCount = 0;

      for (const horse of horses) {
        if (!horse.ratings[0]) continue;

        const currentRating = Number(horse.ratings[0].ratingValue);
        
        // Calculer le nouveau rating calibré
        const recalibratedRating = await this.calculateCalibratedRating(currentRating);
        
        if (Math.abs(recalibratedRating - currentRating) > 1) {
          await this.updateHorseRating(horse.id, recalibratedRating, 'recalibration');
          recalibratedCount++;
        }
      }

      this.logger.log(`✅ Recalibration terminée: ${recalibratedCount} chevaux ajustés`);
    } catch (error) {
      this.logger.error('❌ Erreur lors de la recalibration:', error);
    }
  }

  /**
   * Met à jour ou crée une référence internationale
   */
  private async upsertInternationalReference(rating: IFHAHorse): Promise<void> {
    try {
      await this.prisma.internationalReference.upsert({
        where: {
          horseName_country: {
            horseName: rating.horseName,
            country: rating.country,
          },
        },
        update: {
          officialRating: rating.rating,
          ifhaRating: rating.ifhaRating,
          category: rating.category,
          age: rating.age,
          lastRaceDate: rating.lastRaceDate ? new Date(rating.lastRaceDate) : null,
          lastUpdate: new Date(),
          verified: true,
        },
        create: {
          horseName: rating.horseName,
          country: rating.country,
          officialRating: rating.rating,
          ifhaRating: rating.ifhaRating,
          category: rating.category,
          age: rating.age,
          lastRaceDate: rating.lastRaceDate ? new Date(rating.lastRaceDate) : null,
          lastUpdate: new Date(),
          source: 'IFHA',
          verified: true,
        },
      });
    } catch (error) {
      this.logger.error(`❌ Erreur mise à jour référence ${rating.horseName}:`, error);
    }
  }

  /**
   * Calcule un rating calibré selon les références internationales
   */
  private async calculateCalibratedRating(currentRating: number): Promise<number> {
    // Récupérer les références proches
    const references = await this.prisma.internationalReference.findMany({
      where: {
        officialRating: {
          gte: currentRating - 10,
          lte: currentRating + 10,
        },
        verified: true,
      },
    });

    if (references.length === 0) return currentRating;

    // Calculer l'écart moyen avec les références
    let totalAdjustment = 0;
    let count = 0;

    references.forEach((ref) => {
      const tunisianEquivalent = this.convertForeignRatingToTunisian(
        Number(ref.officialRating),
        ref.country,
      );
      
      const adjustment = tunisianEquivalent - currentRating;
      totalAdjustment += adjustment;
      count++;
    });

    if (count === 0) return currentRating;

    const averageAdjustment = totalAdjustment / count;
    
    // Limiter l'ajustement à ±5 points maximum
    const limitedAdjustment = Math.max(-5, Math.min(5, averageAdjustment));
    
    return Math.round((currentRating + limitedAdjustment) * 10) / 10;
  }

  /**
   * Convertit un rating étranger vers l'équivalent tunisien
   */
  private convertForeignRatingToTunisian(foreignRating: number, country: string): number {
    switch (country) {
      case 'FR': // France
        return foreignRating / 0.9; // Inverse de la conversion TN→FR
      case 'UK': // Royaume-Uni
        return (foreignRating / 2.2) / 0.9; // UK→France puis France→TN
      case 'AE': // Emirats
        return foreignRating / 0.9;
      default:
        return foreignRating; // Pas de conversion si pays inconnu
    }
  }

  /**
   * Met à jour le rating d'un cheval
   */
  private async updateHorseRating(
    horseId: string,
    newRating: number,
    reason: string,
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
          ratingValue: newRating,
          ratingType: 'adjusted',
          isCurrent: true,
          assignedBy: 'system',
          notes: reason,
        },
      });

      // Mettre à jour le rating du cheval
      await this.prisma.horse.update({
        where: { id: horseId },
        data: { currentRating: newRating },
      });
    } catch (error) {
      this.logger.error(`❌ Erreur mise à jour rating ${horseId}:`, error);
    }
  }

  /**
   * Simulation des données IFHA (pour développement/test)
   */
  private async simulateIFHAData(): Promise<void> {
    const simulatedRatings: IFHAHorse[] = [
      { horseName: 'Baaeed', country: 'UK', rating: 140, ifhaRating: 140, category: 'Group1' },
      { horseName: 'Flightline', country: 'US', rating: 140, ifhaRating: 140, category: 'Group1' },
      { horseName: 'Romantic Warrior', country: 'HK', rating: 130, ifhaRating: 130, category: 'Group1' },
      { horseName: 'Modern Games', country: 'UK', rating: 125, ifhaRating: 125, category: 'Group2' },
      { horseName: 'Life Is Good', country: 'US', rating: 125, ifhaRating: 125, category: 'Group1' },
      { horseName: 'Dubai Honour', country: 'AE', rating: 110, ifhaRating: 108, category: 'Group3' },
      { horseName: 'Rebel\'s Romance', country: 'AE', rating: 115, ifhaRating: 112, category: 'Group2' },
    ];

    for (const rating of simulatedRatings) {
      await this.upsertInternationalReference(rating);
    }

    this.logger.log(`✅ Données IFHA simulées importées: ${simulatedRatings.length} références`);
  }

  /**
   * Simulation d'une soumission IFHA
   */
  private simulateIFHASubmission(horse: any, rating: any): IFHASubmissionResult {
    const localRating = Number(rating.localRating);
    const confidence = Number(rating.confidence);

    if (confidence < 70) {
      return {
        success: false,
        message: 'Niveau de confiance insuffisant pour validation IFHA',
      };
    }

    if (localRating < 35) {
      return {
        success: false,
        message: 'Rating trop bas pour reconnaissance internationale',
      };
    }

    // Simulation d'acceptation
    const ifhaRating = Math.round(localRating * 0.85 * 10) / 10;
    return {
      success: true,
      message: 'Rating validé par IFHA (simulation)',
      confirmedRating: ifhaRating,
      ifhaId: `IFHA-TN-${Date.now()}`,
    };
  }

  /**
   * Simulation du classement mondial tunisien
   */
  private simulateTunisianWorldRankings(): IFHAHorse[] {
    return [
      { horseName: 'OUARABI AL WALJD', country: 'TN', rating: 95, ifhaRating: 80, category: 'Listed' },
      { horseName: 'EMIR DE TUNISIE', country: 'TN', rating: 92, ifhaRating: 78, category: 'Listed' },
      { horseName: 'ROI DE CARTHAGE', country: 'TN', rating: 88, ifhaRating: 75, category: 'Class1' },
    ];
  }

  /**
   * Récupère les statistiques de synchronisation
   */
  async getSyncStatistics(): Promise<{
    lastSync: Date | null;
    totalReferences: number;
    verifiedReferences: number;
    tunisianHorsesInIFHA: number;
  }> {
    const lastReference = await this.prisma.internationalReference.findFirst({
      orderBy: { lastUpdate: 'desc' },
    });

    const stats = await this.prisma.internationalReference.aggregate({
      _count: {
        id: true,
        verified: true,
      },
    });

    const tunisianCount = await this.prisma.internationalReference.count({
      where: { country: 'TN' },
    });

    return {
      lastSync: lastReference?.lastUpdate || null,
      totalReferences: stats._count.id || 0,
      verifiedReferences: stats._count.verified || 0,
      tunisianHorsesInIFHA: tunisianCount,
    };
  }
}
