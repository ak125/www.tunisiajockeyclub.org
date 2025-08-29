import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of, tap, catchError } from 'rxjs';
import { CacheService } from './cache.service';

export const CACHE_KEY = 'cache_key';
export const CACHE_TTL = 'cache_ttl';
export const CACHE_NAMESPACE = 'cache_namespace';

// Décorateurs pour le cache
export const CacheKey = (key: string) => SetMetadata(CACHE_KEY, key);
export const CacheTTL = (ttl: number) => SetMetadata(CACHE_TTL, ttl);
export const CacheNamespace = (namespace: string) =>
  SetMetadata(CACHE_NAMESPACE, namespace);

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInterceptor.name);

  constructor(
    private readonly cacheService: CacheService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    // Récupérer les métadonnées de cache
    const cacheKey = this.reflector.get<string>(
      CACHE_KEY,
      context.getHandler(),
    );
    const cacheTTL = this.reflector.get<number>(
      CACHE_TTL,
      context.getHandler(),
    );
    const cacheNamespace = this.reflector.get<string>(
      CACHE_NAMESPACE,
      context.getHandler(),
    );

    // Si pas de clé de cache définie, passer au handler suivant
    if (!cacheKey) {
      return next.handle();
    }

    // Construire la clé de cache avec les paramètres de la requête
    const request = context.switchToHttp().getRequest();
    const fullCacheKey = this.buildCacheKey(cacheKey, request);

    const options = {
      ttl: cacheTTL || 3600, // 1 heure par défaut
      namespace: cacheNamespace || 'api',
    };

    try {
      // Vérifier si la donnée est en cache
      const cachedResult = await this.cacheService.get(fullCacheKey, options);

      if (cachedResult !== null) {
        this.logger.debug(`🎯 Cache HIT: ${fullCacheKey}`);
        return of(cachedResult);
      }

      this.logger.debug(`🔍 Cache MISS: ${fullCacheKey}`);

      // Si pas en cache, exécuter la méthode et mettre en cache
      return next.handle().pipe(
        tap(async (data) => {
          if (data !== undefined && data !== null) {
            await this.cacheService.set(fullCacheKey, data, options);
            this.logger.debug(`💾 Cached: ${fullCacheKey}`);
          }
        }),
        catchError((error) => {
          this.logger.error(
            `❌ Error in cached method ${fullCacheKey}:`,
            error,
          );
          throw error;
        }),
      );
    } catch (error) {
      this.logger.error(
        `❌ Cache interceptor error for ${fullCacheKey}:`,
        error,
      );
      // En cas d'erreur cache, continuer sans cache
      return next.handle();
    }
  }

  private buildCacheKey(template: string, request: any): string {
    let key = template;

    // Remplacer les paramètres de route
    if (request.params) {
      for (const [paramKey, paramValue] of Object.entries(request.params)) {
        key = key.replace(`:${paramKey}`, String(paramValue));
      }
    }

    // Ajouter query parameters si présents
    if (request.query && Object.keys(request.query).length > 0) {
      const sortedQuery = Object.keys(request.query)
        .sort()
        .map((k) => `${k}=${request.query[k]}`)
        .join('&');
      key += `?${sortedQuery}`;
    }

    // Ajouter l'ID utilisateur si disponible (pour cache personnalisé)
    if (request.user?.id) {
      key = `user:${request.user.id}:${key}`;
    }

    return key;
  }
}

// Décorateur de méthode pour le cache automatique
export function Cacheable(
  key: string,
  ttl: number = 3600,
  namespace: string = 'api',
) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ) {
    SetMetadata(CACHE_KEY, key)(target, propertyName, descriptor);
    SetMetadata(CACHE_TTL, ttl)(target, propertyName, descriptor);
    SetMetadata(CACHE_NAMESPACE, namespace)(target, propertyName, descriptor);
  };
}
