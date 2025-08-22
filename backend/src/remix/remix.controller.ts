import { getServerBuild } from '@fafa/frontend';
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

    return createRequestHandler({
      build: await getServerBuild(),
      getLoadContext: () => ({
        user: request.user,
        remixService: this.remixService,
      }),
    })(request, response, next);
  }
}
