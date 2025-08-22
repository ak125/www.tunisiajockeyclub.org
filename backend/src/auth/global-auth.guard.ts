import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class GlobalAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Vérifier si la route est marquée comme publique
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    
    // Vérifier si l'utilisateur est connecté via Passport (session)
    if (request.user) {
      return true;
    }

    // Vérifier si l'utilisateur est connecté via la session Express
    if (request.session && request.session.passport && request.session.passport.user) {
      // L'utilisateur est connecté via Passport
      return true;
    }

    // Aucune session valide trouvée
    throw new UnauthorizedException('Authentification requise');
  }
}
