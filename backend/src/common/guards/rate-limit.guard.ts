import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { CacheService } from '../cache/cache.service';

const RATE_LIMIT_KEY = 'rate_limit';

// Décorateur pour configurer le rate limiting par endpoint
export const RateLimit = (options: {
  requests: number;
  windowMs: number;
  skipSuccessfulRequests?: boolean;
}) => SetMetadata(RATE_LIMIT_KEY, options);

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly logger = new Logger(RateLimitGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly cacheService: CacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const rateLimitOptions = this.reflector.get<{
      requests: number;
      windowMs: number;
      skipSuccessfulRequests?: boolean;
    }>(RATE_LIMIT_KEY, context.getHandler());

    // Si pas de rate limiting configuré, autoriser
    if (!rateLimitOptions) {
      return true;
    }

    const ipAddress = this.getClientIp(request);
    const key = `rate_limit:${context.getClass().name}:${context.getHandler().name}:${ipAddress}`;

    try {
      // Récupérer le compteur actuel
      const currentCount = await this.cacheService.get<number>(key);
      const requestCount = currentCount || 0;

      // Vérifier si la limite est atteinte
      if (requestCount >= rateLimitOptions.requests) {
        this.logger.warn(
          `🚫 RATE LIMIT EXCEEDED: ${ipAddress} - ${requestCount}/${rateLimitOptions.requests} requests`,
        );

        throw new HttpException(
          {
            message: 'Trop de requêtes. Veuillez attendre avant de réessayer.',
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            retryAfter: Math.ceil(rateLimitOptions.windowMs / 1000),
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      // Incrémenter le compteur
      await this.cacheService.increment(key, {
        ttl: Math.ceil(rateLimitOptions.windowMs / 1000),
        namespace: 'rate_limit',
      });

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error('Error in rate limiting:', error);
      return true;
    }
  }

  private getClientIp(request: Request): string {
    const forwarded = request.headers['x-forwarded-for'] as string;

    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }

    return (
      (request.headers['x-real-ip'] as string) ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      request.ip ||
      'unknown'
    );
  }
}
