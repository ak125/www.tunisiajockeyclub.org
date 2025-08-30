import { Controller, Get, Req } from '@nestjs/common';
import { Public } from '../auth/global-auth.guard';
import { CurrentUser, CurrentSession } from '../auth/user.decorator';

@Controller('api')
export class ApiController {
  @Public()
  @Get('status')
  getStatus() {
    return {
      message: 'Tunisia Jockey Club API - Service opérationnel',
      timestamp: new Date().toISOString(),
      status: 'OK',
      environment: process.env.NODE_ENV || 'development',
    };
  }

  @Public()
  @Get('session-info')
  getSessionInfo(@Req() request: any) {
    return {
      message: 'Informations de session',
      isAuthenticated: !!request.user,
      user: request.user || null,
      sessionId: request.session?.id || null,
      passport: request.session?.passport || null,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('profile')
  getUserProfile(@CurrentUser() user: any, @CurrentSession() session: any) {
    return {
      message: 'Profil utilisateur',
      user,
      session,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('protected')
  getProtectedData(@CurrentUser() user: any) {
    return {
      message: 'Données protégées - accès autorisé',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      timestamp: new Date().toISOString(),
      accessLevel: 'authenticated',
    };
  }
}
