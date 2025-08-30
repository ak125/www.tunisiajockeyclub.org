import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Vérifier si l'utilisateur est déjà authentifié via Passport
    if (request.user) {
      return true;
    }

    // Vérifier la session Express
    if (!request.session || !request.session.passport?.user) {
      throw new UnauthorizedException('Utilisateur non connecté');
    }

    const userId = request.session.passport.user.id;
    
    // Vérifier que l'utilisateur existe toujours
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      // Détruire la session si l'utilisateur n'existe plus
      request.session.destroy();
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    // Ajouter l'utilisateur au contexte
    request.user = user;
    
    return true;
  }
}
