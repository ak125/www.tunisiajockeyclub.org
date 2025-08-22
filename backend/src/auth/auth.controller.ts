import {
  Controller,
  Get,
  Next,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { TokenAuthGuard } from './token-auth.guard';
import { Public } from './global-auth.guard';

@Controller()
export class AuthController {
  @Public()
  @UseGuards(TokenAuthGuard)
  @Get('/authenticate')
  @Redirect('/')
  login() {
    console.log('🎉 Authentification réussie - Redirection vers la page d\'accueil');
  }

  @Post('auth/logout')
  async logout(
    @Req() request: Express.Request,
    @Res() response: Response,
    @Next() next: NextFunction,
  ) {
    console.log('👋 Déconnexion en cours...');
    
    // this will ensure that re-using the old session id
    // does not have a logged in user
    request.logOut(function (err) {
      if (err) {
        console.error('❌ Erreur lors de la déconnexion:', err);
        return next(err);
      }
      
      // Ensure the session is destroyed and the user is redirected.
      request.session.destroy(() => {
        response.clearCookie('tjc.sid'); // Nom de cookie mis à jour
        console.log('✅ Session détruite et cookie supprimé');
        response.redirect('/'); // Redirect to website after logout
      });
    });
  }
}
