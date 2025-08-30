import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class RemixService {
  private prismaAvailable: boolean = true;
  private lastPrismaCheck: number = 0;
  private readonly PRISMA_RETRY_INTERVAL = 30000; // 30 secondes

  constructor(
    public readonly prisma: PrismaService,
    public readonly auth: AuthService,
    private readonly supabaseService: SupabaseService,
  ) {}
  
  public readonly getUser = async ({ userId }: { userId: string }) => {
    const now = Date.now();
    
    // Si Prisma n'était pas disponible, attendre avant de réessayer
    if (!this.prismaAvailable && (now - this.lastPrismaCheck) < this.PRISMA_RETRY_INTERVAL) {
      return this.getUserFromSupabase(userId);
    }

    try {
      // Essayer Prisma
      const result = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true },
      });
      
      // Si on arrive ici, Prisma fonctionne
      this.prismaAvailable = true;
      return result;
      
    } catch (error: any) {
      // Marquer Prisma comme indisponible
      this.prismaAvailable = false;
      this.lastPrismaCheck = now;
      
      if (this.lastPrismaCheck % 60000 < 1000) { // Log seulement toutes les minutes
        console.warn('🔄 Prisma indisponible, utilisation du fallback Supabase');
      }
      
      return this.getUserFromSupabase(userId);
    }
  };

  private async getUserFromSupabase(userId: string) {
    try {
      const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, {
        method: 'GET',
        headers: {
          'apikey': process.env.SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const users = await response.json();
        if (users.length > 0) {
          const user = users[0];
          return {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
          };
        }
      }
      return null;
    } catch (error) {
      console.error('❌ Fallback Supabase API échoué:', error);
      return null;
    }
  }
}
