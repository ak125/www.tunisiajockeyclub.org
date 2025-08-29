import { Controller, Get, Post, Param } from '@nestjs/common';

@Controller('test/ratings')
export class RatingTestController {

  @Get('status')
  getStatus() {
    return {
      message: 'Système de rating opérationnel',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  @Get('horses-sample')
  async getHorsesWithRatings() {
    return {
      message: 'Simulation - chevaux avec ratings',
      horses: [
        { id: '1', name: 'Étoile du Désert', rating: 35.5, age: 4, sex: 'M' },
        { id: '2', name: 'Gazelle de Tunis', rating: 32.0, age: 3, sex: 'F' },
        { id: '3', name: 'Champion Arabe', rating: 42.0, age: 5, sex: 'M' }
      ],
      total: 3
    };
  }

  @Get('horse/:horseId')
  async getHorseRating(@Param('horseId') horseId: string) {
    return {
      horseId,
      horseName: `Cheval Test ${horseId}`,
      currentRating: Math.round((Math.random() * 20 + 30) * 10) / 10,
      lastUpdated: new Date(),
      message: 'Rating simulé récupéré avec succès'
    };
  }

  @Post('calculate-initial/:horseId')
  async calculateInitialRating(@Param('horseId') horseId: string) {
    const simulatedRating = Math.round((Math.random() * 10 + 30) * 10) / 10;
    
    return {
      horseId,
      horseName: `Cheval Test ${horseId}`,
      initialRating: simulatedRating,
      message: 'Rating initial simulé calculé avec succès'
    };
  }
}
