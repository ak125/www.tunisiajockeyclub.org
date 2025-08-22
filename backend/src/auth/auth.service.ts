import { Injectable } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

const PASSWORD_SALT = 10;

@Injectable()
export class AuthService {
  private prismaAvailable: boolean = true;
  private lastPrismaCheck: number = 0;
  private readonly PRISMA_RETRY_INTERVAL = 30000; // 30 secondes

  constructor(private readonly prisma: PrismaService) {}

  public readonly checkIfUserExists = async ({
    email,
    password,
    withPassword,
  }: {
    email: string;
    withPassword: boolean;
    password: string;
  }) => {
    const now = Date.now();
    
    // Si Prisma n'était pas disponible, attendre avant de réessayer
    if (!this.prismaAvailable && (now - this.lastPrismaCheck) < this.PRISMA_RETRY_INTERVAL) {
      return this.checkUserViaSupabase(email, password, withPassword);
    }

    try {
      // Essayer Prisma
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, password: true },
      });

      // Si on arrive ici, Prisma fonctionne
      this.prismaAvailable = true;

      if (!existingUser) {
        return { message: "L'email est invalide", error: true };
      }

      if (withPassword) {
        const isPasswordValid = await compare(password, existingUser.password || '');
        if (!isPasswordValid) {
          return { message: 'Le mot de passe est invalide', error: true };
        }
      }

      return { message: "L'utilisateur existe.", error: false };

    } catch (error: any) {
      // Marquer Prisma comme indisponible
      this.prismaAvailable = false;
      this.lastPrismaCheck = now;
      
      if (this.lastPrismaCheck % 60000 < 1000) { // Log seulement toutes les minutes
        console.warn('🔄 Prisma Auth indisponible, utilisation du fallback Supabase');
      }
      
      return this.checkUserViaSupabase(email, password, withPassword);
    }
  };

  private async checkUserViaSupabase(email: string, password: string, withPassword: boolean) {
    try {
      const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'apikey': process.env.SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const users = await response.json();
        const existingUser = users.length > 0 ? users[0] : null;

        if (!existingUser) {
          return { message: "L'email est invalide", error: true };
        }

        if (withPassword) {
          const isPasswordValid = await compare(password, existingUser.password || '');
          if (!isPasswordValid) {
            return { message: 'Le mot de passe est invalide', error: true };
          }
        }

        return { message: "L'utilisateur existe.", error: false };
      } else {
        return { message: "Erreur de connexion à la base de données", error: true };
      }
    } catch (error) {
      console.error('❌ Fallback Supabase API échoué:', error);
      return { message: "Erreur de connexion à la base de données", error: true };
    }
  }

  public readonly createUser = async ({
    email,
    firstName,
    lastName,
    password,
  }: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) => {
    const hashedPassword = await hash(password, PASSWORD_SALT);
    const now = Date.now();
    
    // Si Prisma n'était pas disponible, attendre avant de réessayer
    if (!this.prismaAvailable && (now - this.lastPrismaCheck) < this.PRISMA_RETRY_INTERVAL) {
      return this.createUserViaSupabase(email, hashedPassword, firstName, lastName);
    }
    
    try {
      const result = await this.prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          firstName,
          lastName,
        },
        select: { id: true, email: true },
      });
      
      // Si on arrive ici, Prisma fonctionne
      this.prismaAvailable = true;
      return result;
      
    } catch (error: any) {
      // Marquer Prisma comme indisponible
      this.prismaAvailable = false;
      this.lastPrismaCheck = now;
      
      return this.createUserViaSupabase(email, hashedPassword, firstName, lastName);
    }
  };

  private async createUserViaSupabase(email: string, hashedPassword: string, firstName: string, lastName: string) {
    try {
      const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/users`, {
        method: 'POST',
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY || '',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password: hashedPassword,
          first_name: firstName,
          last_name: lastName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const users = await response.json();
        return { id: users[0].id, email: users[0].email };
      } else {
        const errorText = await response.text();
        throw new Error(`Erreur création utilisateur via API: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Fallback user creation échoué:', error);
      throw error;
    }
  }

  public readonly authenticateUser = async ({ email }: { email: string }) => {
    const now = Date.now();
    
    // Si Prisma n'était pas disponible, attendre avant de réessayer
    if (!this.prismaAvailable && (now - this.lastPrismaCheck) < this.PRISMA_RETRY_INTERVAL) {
      return this.authenticateUserViaSupabase(email);
    }
    
    try {
      const result = await this.prisma.session.create({
        data: {
          user: { connect: { email } },
          sessionToken: createId(),
        },
        select: { sessionToken: true },
      });
      
      // Si on arrive ici, Prisma fonctionne
      this.prismaAvailable = true;
      return result;
      
    } catch (error: any) {
      // Marquer Prisma comme indisponible
      this.prismaAvailable = false;
      this.lastPrismaCheck = now;
      
      return this.authenticateUserViaSupabase(email);
    }
  };

  private async authenticateUserViaSupabase(email: string) {
    try {
      // D'abord, récupérer l'ID de l'utilisateur
      const userResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'apikey': process.env.SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (userResponse.ok) {
        const users = await userResponse.json();
        if (users.length > 0) {
          const user = users[0];
          const sessionToken = createId();
          
          // Créer la session via API
          const sessionResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/sessions`, {
            method: 'POST',
            headers: {
              'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY || '',
              'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              user_id: user.id,
              session_token: sessionToken,
              expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              created_at: new Date().toISOString()
            }),
          });

          if (sessionResponse.ok) {
            return { sessionToken };
          } else {
            const errorText = await sessionResponse.text();
            throw new Error(`Erreur création session: ${sessionResponse.status} ${errorText}`);
          }
        } else {
          throw new Error('Utilisateur non trouvé pour création de session');
        }
      } else {
        throw new Error(`Erreur recherche utilisateur: ${userResponse.status}`);
      }
    } catch (error) {
      console.error('❌ Fallback session creation échoué:', error);
      throw error;
    }
  }
}
