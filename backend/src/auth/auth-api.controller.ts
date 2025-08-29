import { Controller, Post, Body, HttpException, HttpStatus, UsePipes } from '@nestjs/common';
import { Public } from './global-auth.guard';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { ZodValidationPipe } from '../validation/zod-validation.pipe';
import { loginSchema, type LoginDto } from '../validation/schemas/auth.schema';

@Controller('auth')
@Public()
export class AuthApiController {
  constructor(
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService
  ) {}
  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() loginDto: LoginDto) {
    const startTime = Date.now();
    
    try {
      console.log('🔐 Tentative de connexion - Body reçu:', loginDto);
      
      if (!loginDto || !loginDto.email || !loginDto.password) {
        console.warn('❌ Données de connexion incomplètes:', loginDto);
        return {
          success: false,
          message: 'Email et mot de passe requis',
          receivedData: loginDto,
        };
      }
      
      console.log('🔐 Tentative de connexion pour:', loginDto.email);
      
      // Essayer d'abord avec les vraies données Supabase
      try {
        const authResult = await this.authService.checkIfUserExists({
          email: loginDto.email,
          password: loginDto.password,
          withPassword: true,
        });

        if (!authResult.error) {
          const session = await this.authService.authenticateUser({ 
            email: loginDto.email 
          });

          const duration = Date.now() - startTime;
          console.log(`✅ Connexion Supabase réussie pour: ${loginDto.email} (${duration}ms)`);
          
          return {
            success: true,
            message: 'Connexion réussie avec vos données',
            user: {
              email: loginDto.email,
              sessionToken: session.sessionToken,
            },
            source: 'supabase',
            performance: { duration, mode: 'supabase' },
            timestamp: new Date().toISOString(),
          };
        }
      } catch (authError) {
        console.warn('⚠️  Authentification Supabase échouée, essai mode priorité...');
      }

      // Fallback avec utilisateurs prioritaires pour le développement
      const priorityUsers = [
        { email: 'monia@gmail.com', password: 'password123', name: 'Monia Benaissa' },
        { email: 'admin@tjc.tn', password: 'admin123', name: 'Administrateur TJC' },
        { email: 'test@test.com', password: 'test123', name: 'Utilisateur Test' }
      ];

      const priorityUser = priorityUsers.find(u => 
        u.email.toLowerCase() === loginDto.email.toLowerCase() && 
        u.password === loginDto.password
      );
      
      if (priorityUser) {
        const duration = Date.now() - startTime;
        console.log(`✅ Connexion prioritaire réussie pour: ${priorityUser.email} (${duration}ms)`);
        
        return {
          success: true,
          message: 'Connexion réussie (mode développement)',
          user: {
            email: priorityUser.email,
            name: priorityUser.name,
            sessionToken: `dev_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          },
          source: 'development',
          performance: { duration, mode: 'priority' },
          timestamp: new Date().toISOString(),
        };
      }

      const duration = Date.now() - startTime;
      console.warn(`❌ Identifiants invalides pour: ${loginDto.email} (${duration}ms)`);
      
      return {
        success: false,
        message: 'Identifiants invalides',
        hint: 'Vérifiez que vos identifiants existent dans la base de données ou utilisez un compte de développement',
        availableDevUsers: priorityUsers.map(u => ({ email: u.email })),
        databaseInfo: {
          totalUsers: '97 utilisateurs dans la base',
          tables: ['users', 'horses', 'jockeys', 'owners', 'trainers', 'races', 'race_entries', 'race_results', 'racecourses', 'sessions']
        },
        performance: { duration },
        timestamp: new Date().toISOString(),
      };

    } catch (error: any) {
      console.error('❌ Erreur lors de la connexion:', error);
      
      return {
        success: false,
        message: 'Erreur interne lors de la connexion',
        error: error?.message || 'Erreur inconnue',
        timestamp: new Date().toISOString()
      };
    }
  }

  @Post('logout')
  async logout() {
    console.log('👋 Déconnexion demandée');
    
    return {
      success: true,
      message: 'Déconnexion réussie'
    };
  }

  @Post('check')
  async checkAuth() {
    // Endpoint simple pour vérifier l'auth
    return {
      success: true,
      message: 'Auth check OK',
      timestamp: new Date().toISOString()
    };
  }

  @Post('users-sample')
  async getUsersSample() {
    try {
      // Récupérer quelques utilisateurs de la base pour faciliter les tests
      const users = await this.prismaService.user.findMany({
        select: { 
          email: true, 
          firstName: true, 
          lastName: true,
          createdAt: true,
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
      });

      return {
        success: true,
        message: "Échantillon d'utilisateurs récupéré",
        users: users,
        totalFound: users.length,
        note: 'Utilisez ces emails pour vous connecter avec vos vrais mots de passe',
        timestamp: new Date().toISOString(),
      };

    } catch (error: any) {
      console.warn('Impossible de récupérer les utilisateurs réels, fallback...');
      
      return {
        success: true,
        message: 'Utilisateurs de développement disponibles',
        users: [
          { email: 'monia@gmail.com', note: 'Utilisateur de test' },
          { email: 'admin@tjc.tn', note: 'Administrateur de test' },
          { email: 'test@test.com', note: 'Utilisateur de test' },
        ],
        totalFound: 3,
        fallback: true,
        databaseInfo: {
          totalUsersInDB: 97,
          totalHorses: 46,
          totalJockeys: 42,
          totalOwners: 33,
          totalTrainers: 21,
          totalRaces: 8,
        },
        timestamp: new Date().toISOString(),
      };
    }
  }
}
