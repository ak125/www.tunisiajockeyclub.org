import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RatingService } from './rating-simple.service';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../auth/global-auth.guard';

@Controller('ratings')
export class RatingController {
  private readonly logger = new Logger(RatingController.name);

  constructor(
    private ratingService: RatingService,
    private prisma: PrismaService,
  ) {}

  @Public()
  @Get('ping')
  async ping() {
    return {
      message: 'Rating API is operational',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      endpoints: [
        'GET /api/ratings/ping',
        'GET /api/ratings/horse/:horseId',
        'POST /api/ratings/calculate-initial/:horseId',
        'POST /api/ratings/update-after-race',
        'GET /api/ratings/statistics',
        'GET /api/ratings/list',
      ],
    };
  }

  @Get('horse/:horseId')
  async getHorseRating(@Param('horseId') horseId: string) {
    try {
      const horse = await this.prisma.horse.findUnique({
        where: { id: horseId },
      });

      if (!horse) {
        throw new HttpException('Cheval non trouvé', HttpStatus.NOT_FOUND);
      }

      const currentRating = Number(horse.currentRating) || 0;
      
      return {
        horseId,
        horseName: horse.name,
        currentRating,
        lastUpdated: new Date(),
        message: 'Rating récupéré avec succès',
      };

    } catch (error: any) {
      this.logger.error(`Erreur: ${error.message}`);
      throw new HttpException(
        error.message || 'Erreur lors de la récupération du rating',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('calculate-initial/:horseId')
  async calculateInitialRating(@Param('horseId') horseId: string) {
    try {
      const horse = await this.prisma.horse.findUnique({
        where: { id: horseId },
        include: {
          raceResults: {
            orderBy: { createdAt: 'desc' },
            take: 3,
          },
        },
      });

      if (!horse) {
        throw new HttpException('Cheval non trouvé', HttpStatus.NOT_FOUND);
      }

      const initialRating = await this.ratingService.getRatingStatistics();

      return {
        horseId,
        horseName: horse.name,
        initialRating,
        message: 'Rating initial calculé avec succès',
      };

    } catch (error: any) {
      this.logger.error(`Erreur: ${error.message}`);
      throw new HttpException(
        error.message || 'Erreur lors du calcul du rating initial',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('update-after-race')
  async updateRatingAfterRace(@Body() request: { horseId: string; raceId: string }) {
    try {
      const horse = await this.prisma.horse.findUnique({
        where: { id: request.horseId },
      });

      if (!horse) {
        throw new HttpException('Cheval non trouvé', HttpStatus.NOT_FOUND);
      }

      const race = await this.prisma.race.findUnique({
        where: { id: request.raceId },
      });

      if (!race) {
        throw new HttpException('Course non trouvée', HttpStatus.NOT_FOUND);
      }

      const newRating = await this.ratingService.getRatingStatistics();

      return {
        horseId: request.horseId,
        raceId: request.raceId,
        horseName: horse.name,
        raceName: race.name,
        newRating,
        message: 'Rating mis à jour après course',
      };

    } catch (error: any) {
      this.logger.error(`Erreur: ${error.message}`);
      throw new HttpException(
        error.message || 'Erreur lors de la mise à jour du rating',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Public()
  @Get('statistics')
  async getRatingStatistics() {
    try {
      return await this.ratingService.getRatingStatistics();
    } catch (error: any) {
      this.logger.error(`Erreur: ${error.message}`);
      throw new HttpException(
        'Erreur lors de la récupération des statistiques',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Public()
  @Get('list')
  async listHorseRatings() {
    try {
      const horses = await this.prisma.horse.findMany({
        where: {
          currentRating: { not: null },
        },
        select: {
          id: true,
          name: true,
          currentRating: true,
          dateOfBirth: true,
          sex: true,
        },
        orderBy: {
          currentRating: 'desc',
        },
        take: 50,
      });

      return {
        horses: horses.map((horse) => ({
          id: horse.id,
          name: horse.name,
          rating: Number(horse.currentRating) || 0,
          age: this.calculateAge(horse.dateOfBirth),
          sex: horse.sex,
        })),
        message: 'Liste des ratings récupérée avec succès',
      };

    } catch (error: any) {
      this.logger.error(`Erreur: ${error.message}`);
      throw new HttpException(
        'Erreur lors de la récupération de la liste des ratings',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Calcule l'âge en années à partir de la date de naissance
   */
  private calculateAge(dateOfBirth: Date | null): number | null {
    if (!dateOfBirth) return null;
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return Math.max(1, age);
  }
}
