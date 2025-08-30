import { All, Controller, Next, Req, Res } from '@nestjs/common';
import { createRequestHandler } from '@remix-run/express';
import { NextFunction, Request, Response } from 'express';
import { RemixService } from './remix.service';
import { Public } from '../auth/global-auth.guard';

@Controller()
export class RemixController {
  constructor(private remixService: RemixService) {}

  @Public()
  @All('*')
  async handler(
    @Req() request: Request,
    @Res() response: Response,
    @Next() next: NextFunction,
  ) {
    // Ignorer les routes API pour laisser NestJS les gérer
    if (request.path.startsWith('/api/')) {
      return next();
    }

    // Ignorer les routes d'authentification pour laisser NestJS les gérer
    if (request.path.startsWith('/auth/') || request.path === '/authenticate') {
      return next();
    }

    try {
      // Import dynamique pour éviter que le contrôleur ne se charge pas si le frontend a un problème
      const { getServerBuild } = await import('@fafa/frontend');
      const build = await getServerBuild();
      
      return createRequestHandler({
        build,
        getLoadContext: () => ({
          user: request.user,
          remixService: this.remixService,
        }),
      })(request, response, next);
    } catch (error: unknown) {
      console.error('❌ Erreur lors du chargement du frontend:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      response.status(500).json({
        error: 'Frontend non disponible',
        message: 'Le serveur frontend ne peut pas être chargé. Vérifiez que le build frontend est correctement compilé.',
        details: errorMessage
      });
    }
  }
}
