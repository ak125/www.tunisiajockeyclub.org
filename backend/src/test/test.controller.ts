import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Public } from '../auth/global-auth.guard';
import { exec } from 'child_process';
import { promisify } from 'util';

@Controller('test')
@Public()
export class TestController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get('supabase')
  async testSupabaseConnection() {
    try {
      const result = await this.supabaseService.testConnection();
      return {
        status: 'success',
        message: 'Test de connexion Supabase',
        data: result
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Erreur lors du test de connexion Supabase',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  @Get('health')
  async healthCheck() {
    return {
      status: 'success',
      message: 'Tunisia Jockey Club API est opérationnelle',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    };
  }

    @Get('real-data')
  async getRealDataFromSupabase() {
    console.log('🧪 Test endpoint avec vraies données via API REST');
    
    try {
      // Utiliser exec pour récupérer les vraies données via curl
      const execAsync = promisify(exec);
      
      const curlCommand = `curl -s -X GET 'https://hssigihofbbdehqrnnoz.supabase.co/rest/v1/races?select=*,racecourses(name,location)&order=race_date.desc,race_time.desc&limit=10' -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzc2lnaWhvZmJiZGVocXJubm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU1OTM0OSwiZXhwIjoyMDcxMTM1MzQ5fQ.LJXci09iPB2JrHMMQlCorfDdRnJhMQCfhVNU01YD7o4' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzc2lnaWhvZmJiZGVocXJubm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU1OTM0OSwiZXhwIjoyMDcxMTM1MzQ5fQ.LJXci09iPB2JrHMMQlCorfDdRnJhMQCfhVNU01YD7o4'`;
      
      const { stdout } = await execAsync(curlCommand);
      const races = JSON.parse(stdout);
      
      // Transformer les données au format attendu par l'API
      const transformedRaces = races.map((race: any) => ({
        id: race.id,
        name: race.name,
        date: new Date(`${race.race_date}T${race.race_time}`).toISOString(),
        status: race.status,
        distance: race.distance_meters,
        distanceMeters: race.distance_meters,
        maxParticipants: race.max_runners || 0,
        maxRunners: race.max_runners || 0,
        prizeMoney: race.prize_money ? Number(race.prize_money) : null,
        racecourse: {
          name: race.racecourses?.name || 'Hippodrome',
          location: race.racecourses?.location || 'Tunisie',
        },
        raceNumber: race.race_number,
        raceType: race.race_type,
        category: race.race_class,
      }));
      
      return {
        status: 'success',
        source: 'API REST Supabase via curl',
        message: `${races.length} courses réelles récupérées depuis la base de données`,
        courses: transformedRaces,
        total: races.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des données réelles:', error);
      
      return {
        status: 'error',
        message: 'Erreur lors de la récupération des données réelles',
        error: error instanceof Error ? error.message : String(error),
        fallback_explanation: 'Les données Prisma ne sont pas accessibles mais les données existent dans Supabase',
      };
    }
  }
}
