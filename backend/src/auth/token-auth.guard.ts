import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TokenAuthGuard extends AuthGuard('token') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<any>();
    
    // Vérifier si un token est présent
    const token = request.query.token as string;
    if (!token) {
      throw new UnauthorizedException('Token de session manquant');
    }

    console.log('🔐 TokenAuthGuard - Validation du token:', token);

    // Exécuter la validation de la stratégie
    const result = (await super.canActivate(context)) as boolean;
    
    // Établir la session utilisateur
    if (result) {
      await super.logIn(request);
      console.log('✅ Session utilisateur établie');
    }
    
    return result;
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('📝 TokenAuthGuard - Résultat:', { err, user, info });
    
    if (err || !user) {
      throw err || new UnauthorizedException('Authentification par token échouée');
    }
    
    return user;
  }
}
