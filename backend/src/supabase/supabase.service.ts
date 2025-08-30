import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private readonly supabaseUrl: string;
  private readonly supabaseKey: string;
  private readonly supabaseServiceKey: string;

  constructor(private readonly configService: ConfigService) {
    this.supabaseUrl = this.configService.get<string>('SUPABASE_URL') || '';
    this.supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY') || '';
    this.supabaseServiceKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') || '';
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/users?limit=1`, {
        method: 'GET',
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Connexion Supabase réussie via API REST'
        };
      } else {
        return {
          success: false,
          message: `Erreur HTTP: ${response.status} ${response.statusText}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Erreur de connexion: ${error}`
      };
    }
  }

  async createUser(userData: {
    email: string;
    name: string;
    password: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/users`, {
        method: 'POST',
        headers: {
          'apikey': this.supabaseServiceKey,
          'Authorization': `Bearer ${this.supabaseServiceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          email: userData.email.toLowerCase(),
          name: userData.name,
          password: userData.password,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data[0];
      } else {
        const error = await response.text();
        throw new Error(`Erreur création utilisateur: ${response.status} ${error}`);
      }
    } catch (error) {
      throw new Error(`Erreur lors de la création de l'utilisateur: ${error}`);
    }
  }

  async findUserByEmail(email: string): Promise<any> {
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.length > 0 ? data[0] : null;
      } else {
        const error = await response.text();
        throw new Error(`Erreur recherche utilisateur: ${response.status} ${error}`);
      }
    } catch (error) {
      throw new Error(`Erreur lors de la recherche de l'utilisateur: ${error}`);
    }
  }

  async createSession(sessionData: {
    user_id: string;
    session_token: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/sessions`, {
        method: 'POST',
        headers: {
          'apikey': this.supabaseServiceKey,
          'Authorization': `Bearer ${this.supabaseServiceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          user_id: sessionData.user_id,
          session_token: sessionData.session_token,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 jours
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data[0];
      } else {
        const error = await response.text();
        throw new Error(`Erreur création session: ${response.status} ${error}`);
      }
    } catch (error) {
      throw new Error(`Erreur lors de la création de la session: ${error}`);
    }
  }
}
