import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { PrismaService } from '../prisma/prisma.service';
import { RedirectException } from './redirected-error.exception';

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy, 'token') {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async validate(request: Request) {
    console.log('🔍 TokenStrategy - Validation en cours...');
    
    const token = request.query.token as string;
    
    if (!token) {
      console.log('❌ Aucun token fourni dans la query string');
      throw new UnauthorizedException('Token de session requis');
    }

    console.log('🔑 Recherche de la session avec token:', token);

    try {
      const session = await this.prisma.session.findUnique({
        where: {
          sessionToken: token,
        },
      });

      if (!session) {
        console.log('❌ Session non trouvée pour le token:', token);
        throw new RedirectException(
          'Votre session a expiré. Veuillez vous reconnecter.',
          '/login',
        );
      }

      // Récupérer l'utilisateur séparément
      const user = await this.prisma.user.findUnique({
        where: {
          id: session.userId,
        },
        select: {
          id: true,
          email: true,
        },
      });

      if (!user) {
        console.log('❌ Utilisateur non trouvé pour la session');
        throw new RedirectException(
          'Utilisateur introuvable.',
          '/login',
        );
      }

      console.log('✅ Session trouvée pour utilisateur:', user.email);

      // Supprimer la session temporaire après utilisation
      await this.prisma.session.delete({
        where: {
          sessionToken: token,
        },
      });

      console.log('🗑️ Session temporaire supprimée');

      return {
        id: user.id,
        email: user.email,
      };
    } catch (error: any) {
      console.warn('Prisma token validation echoue, utilisation de l\'API REST Supabase:', error?.message);
      
      // Fallback vers l'API REST Supabase
      try {
        const sessionResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/sessions?session_token=eq.${token}`, {
          method: 'GET',
          headers: {
            'apikey': process.env.SUPABASE_ANON_KEY || '',
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        if (sessionResponse.ok) {
          const sessions = await sessionResponse.json();
          if (sessions.length > 0) {
            const session = sessions[0];
            
            // Récupérer l'utilisateur
            const userResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/users?id=eq.${session.user_id}`, {
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
                console.log('✅ Session trouvée via API Supabase pour utilisateur:', user.email);

                // Supprimer la session temporaire
                await fetch(`${process.env.SUPABASE_URL}/rest/v1/sessions?session_token=eq.${token}`, {
                  method: 'DELETE',
                  headers: {
                    'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY || '',
                    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
                  },
                });

                console.log('🗑️ Session temporaire supprimée via API Supabase');

                return {
                  id: user.id,
                  email: user.email,
                };
              }
            }
          }
        }

        console.log('❌ Session non trouvée via API Supabase pour le token:', token);
        throw new RedirectException(
          'Votre session a expiré. Veuillez vous reconnecter.',
          '/login',
        );
      } catch (fallbackError) {
        console.error('Fallback token validation echoue:', fallbackError);
        throw new RedirectException(
          'Erreur de validation de session. Veuillez vous reconnecter.',
          '/login',
        );
      }
    }
  }
}
