import { Controller, Get } from '@nestjs/common';
import { SupabaseRestService } from '../supabase/supabase-rest.service';
import { Public } from '../auth/global-auth.guard';

@Controller('horses')
@Public()
export class HorsesController {
  constructor(private readonly supabaseService: SupabaseRestService) {}

  @Get()
  async getHorses() {
    const startTime = Date.now();
    try {
      console.log('🐎 Récupération des chevaux...');

      const available = await this.supabaseService.isAvailable();
      if (available) {
        const horses = await this.supabaseService.getHorses(50); // Plus de chevaux
        const duration = Date.now() - startTime;

        console.log(`✅ ${horses.length} chevaux récupérés en ${duration}ms via Supabase REST`);

        return {
          horses: horses.map((horse: any) => ({
            id: horse.id,
            name: horse.name,
            breed: horse.breed || 'Race non spécifiée',
            age: horse.age || (horse.date_of_birth ? 
              Math.floor((new Date().getTime() - new Date(horse.date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 365)) : 
              null),
            sex: horse.sex,
            color: horse.color,
            registrationNumber: horse.registration_number,
            dateOfBirth: horse.date_of_birth,
            isActive: horse.is_active !== false,
            createdAt: horse.created_at
          })),
          total: horses.length,
          meta: {
            source: 'supabase_rest',
            performance: { duration },
            timestamp: new Date().toISOString()
          }
        };
      }

      throw new Error('Supabase non disponible');

    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.warn(`⚠️ Erreur chevaux (${duration}ms), données fallback`);
      console.error('Erreur:', error?.message || error);

      return {
        horses: [
          {
            id: 1,
            name: 'Thunder Bay',
            breed: 'Pur-sang Arabe',
            age: 5,
            sex: 'stallion',
            color: 'Bai brun',
            registrationNumber: 'TJC-2020-001',
            dateOfBirth: '2020-03-15',
            isActive: true
          },
          {
            id: 2,
            name: 'Desert Storm',
            breed: 'Pur-sang Anglais',
            age: 4,
            sex: 'mare',
            color: 'Alezan',
            registrationNumber: 'TJC-2021-002',
            dateOfBirth: '2021-05-22',
            isActive: true
          }
        ],
        total: 2,
        meta: {
          source: 'fallback',
          performance: { duration },
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  @Get('stats')
  async getHorsesStats() {
    try {
      const available = await this.supabaseService.isAvailable();
      if (available) {
        const counts = await this.supabaseService.getCounts();
        return {
          totalHorses: counts.totalHorses,
          activeHorses: Math.floor(counts.totalHorses * 0.8), // Approximation
          veteranHorses: Math.floor(counts.totalHorses * 0.1),
          risingHorses: Math.floor(counts.totalHorses * 0.1),
          source: 'supabase_rest'
        };
      }

      return {
        totalHorses: 45,
        activeHorses: 36,
        veteranHorses: 5,
        risingHorses: 4,
        source: 'fallback'
      };
    } catch (error) {
      console.error('❌ Erreur stats chevaux:', error);
      return {
        totalHorses: 0,
        activeHorses: 0,
        veteranHorses: 0,
        risingHorses: 0,
        source: 'error'
      };
    }
  }
}
