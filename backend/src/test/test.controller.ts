import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('test')
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
}
