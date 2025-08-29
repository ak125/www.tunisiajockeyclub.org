import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseRestService {
  private readonly logger = new Logger(SupabaseRestService.name);
  private supabase: SupabaseClient | null = null;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      this.logger.warn('Variables Supabase manquantes, service non disponible');
      return;
    }

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    this.logger.log('Service Supabase REST initialisé');
  }

  async isAvailable(): Promise<boolean> {
    if (!this.supabase) return false;

    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('id')
        .limit(1);

      return !error && Array.isArray(data);
    } catch (error: any) {
      this.logger.warn(
        'Supabase REST non disponible:',
        error?.message || 'Erreur inconnue',
      );
      return false;
    }
  }

  async getUsers(limit = 100) {
    if (!this.supabase) throw new Error('Supabase non initialisé');

    const { data, error } = await this.supabase
      .from('users')
      .select('id, email, first_name, last_name, role, is_active')
      .limit(limit);

    if (error) throw error;
    return data;
  }

  async getHorses(limit = 100) {
    if (!this.supabase) throw new Error('Supabase non initialisé');

    const { data, error } = await this.supabase
      .from('horses')
      .select('id, name, sex, color, date_of_birth, registration_number')
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getRaces(limit = 100) {
    if (!this.supabase) throw new Error('Supabase non initialisé');

    const { data, error } = await this.supabase
      .from('races')
      .select('id, name, race_date, prize_money')
      .limit(limit)
      .order('race_date', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getJockeys(limit = 100) {
    if (!this.supabase) throw new Error('Supabase non initialisé');

    const { data, error } = await this.supabase
      .from('jockeys')
      .select(
        `
        id,
        license_number,
        user_id,
        users!inner (
          id,
          first_name,
          last_name,
          email
        )
      `,
      )
      .limit(limit);

    if (error) throw error;
    return data;
  }

  async getOwners(limit = 100) {
    if (!this.supabase) throw new Error('Supabase non initialisé');

    const { data, error } = await this.supabase
      .from('owners')
      .select(
        `
        id,
        stable_name,
        user_id,
        users (
          id,
          first_name,
          last_name,
          email
        )
      `,
      )
      .limit(limit);

    if (error) throw error;
    return data;
  }

  async getTrainers(limit = 100) {
    if (!this.supabase) throw new Error('Supabase non initialisé');

    const { data, error } = await this.supabase
      .from('trainers')
      .select(
        `
        id,
        license_number,
        user_id,
        users!inner (
          id,
          first_name,
          last_name,
          email
        )
      `,
      )
      .limit(limit);

    if (error) throw error;
    return data;
  }

  async getCounts() {
    if (!this.supabase) throw new Error('Supabase non initialisé');

    const startTime = Date.now();

    try {
      const [
        { count: totalHorses },
        { count: totalUsers },
        { count: totalRaces },
        { count: totalJockeys },
        { count: totalOwners },
        { count: totalTrainers },
        { count: totalEntries },
        { count: totalResults },
      ] = await Promise.all([
        this.supabase
          .from('horses')
          .select('*', { count: 'exact', head: true }),
        this.supabase.from('users').select('*', { count: 'exact', head: true }),
        this.supabase.from('races').select('*', { count: 'exact', head: true }),
        this.supabase
          .from('jockeys')
          .select('*', { count: 'exact', head: true }),
        this.supabase
          .from('owners')
          .select('*', { count: 'exact', head: true }),
        this.supabase
          .from('trainers')
          .select('*', { count: 'exact', head: true }),
        this.supabase
          .from('race_entries')
          .select('*', { count: 'exact', head: true }),
        this.supabase
          .from('race_results')
          .select('*', { count: 'exact', head: true }),
      ]);

      const duration = Date.now() - startTime;
      this.logger.log(`Comptes récupérés en ${duration}ms via Supabase REST`);

      return {
        totalHorses: totalHorses || 0,
        totalUsers: totalUsers || 0,
        totalRaces: totalRaces || 0,
        totalJockeys: totalJockeys || 0,
        totalOwners: totalOwners || 0,
        totalTrainers: totalTrainers || 0,
        totalInscriptions: totalEntries || 0,
        totalResults: totalResults || 0,
        duration,
      };
    } catch (error: any) {
      this.logger.error(
        'Erreur lors du calcul des comptes:',
        error?.message || 'Erreur inconnue',
      );
      throw error;
    }
  }

  async getDashboardData() {
    if (!this.supabase) throw new Error('Supabase non initialisé');

    const startTime = Date.now();

    try {
      const [horses, users, races, jockeys, owners, trainers] =
        await Promise.all([
          this.getHorses(10),
          this.getUsers(10),
          this.getRaces(5),
          this.getJockeys(5),
          this.getOwners(5),
          this.getTrainers(5),
        ]);

      const counts = await this.getCounts();

      const duration = Date.now() - startTime;
      this.logger.log(
        `Données dashboard récupérées en ${duration}ms via Supabase REST`,
      );

      return {
        overview: counts,
        recentHorses: horses,
        recentUsers: users,
        topJockeys: jockeys,
        topOwners: owners,
        topTrainers: trainers,
        upcomingRaces: races,
        meta: {
          source: 'supabase_rest',
          performance: { duration, queryCount: 11 },
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error: any) {
      this.logger.error(
        'Erreur lors de la récupération des données dashboard:',
        error?.message || 'Erreur inconnue',
      );
      throw error;
    }
  }
}
