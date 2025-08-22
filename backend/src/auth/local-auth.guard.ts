import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<any>();
    
    // Récupérer les données du token depuis la query string
    const token = request.query.token as string;
    if (!token) {
      throw new UnauthorizedException('Token de session manquant');
    }

    // Le token sera validé par LocalStrategy
    const result = (await super.canActivate(context)) as boolean;
    
    // Établir la session utilisateur
    await super.logIn(request);
    
    return result;
  }

  handleRequest(err: any, user: any, info: any) {
    console.log({ err, user, info });
    
    if (err || !user) {
      throw err || new UnauthorizedException('Authentification échouée');
    }
    
    return user;
  }
}
