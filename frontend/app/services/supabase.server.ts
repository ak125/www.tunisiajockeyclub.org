import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Variables d\'environnement Supabase manquantes');
}

// Client Supabase avec service role pour les opérations server-side
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Types de base pour la base de données
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          role: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      races: {
        Row: {
          id: string;
          race_number: number;
          race_date: string;
          race_time: string;
          racecourse_id: string;
          name: string;
          race_type: string | null;
          distance_meters: number;
          status: string;
          created_at: string;
        };
      };
      horses: {
        Row: {
          id: string;
          name: string;
          registration_number: string;
          date_of_birth: string;
          sex: string | null;
          color: string | null;
          breed: string | null;
          is_active: boolean;
          created_at: string;
        };
      };
      jockeys: {
        Row: {
          id: string;
          user_id: string | null;
          license_number: string;
          weight_kg: number | null;
          height_cm: number | null;
          wins: number;
          places: number;
          shows: number;
          is_active: boolean;
          created_at: string;
        };
      };
      racecourses: {
        Row: {
          id: string;
          name: string;
          code: string;
          location: string | null;
          track_type: string | null;
          capacity: number | null;
          created_at: string;
        };
      };
    };
  };
}
