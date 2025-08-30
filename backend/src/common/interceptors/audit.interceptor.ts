import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap, catchError } from 'rxjs';
import { Request } from 'express';
import { AuditService } from '../../security/audit.service';
import { SecurityService } from '../../security/security.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(
    private readonly auditService: AuditService,
    private readonly securityService: SecurityService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const startTime = Date.now();
    const method = request.method;
    const url = request.url;
    const userAgent = request.headers['user-agent'] || '';
    const ipAddress = request.ip || request.connection.remoteAddress || '';
    const userId = (request as any).user?.id;

    // Validation de sécurité des données entrantes
    this.validateRequestSecurity(request, ipAddress, userAgent);

    return next.handle().pipe(
      tap(async (data) => {
        const duration = Date.now() - startTime;
        
        // Audit pour les actions importantes
        if (this.shouldAudit(method, url)) {
          await this.auditService.logEvent({
            type: this.getAuditType(url),
            action: `${method} ${url}`,
            userId,
            ipAddress,
            userAgent,
            details: {
              duration,
              success: true,
              responseSize: JSON.stringify(data).length,
            },
            severity: 'low',
          });
        }

        this.logger.debug(
          `✅ ${method} ${url} - ${duration}ms - User: ${userId || 'anonymous'} - IP: ${ipAddress}`,
        );
      }),
      catchError(async (error) => {
        const duration = Date.now() - startTime;
        
        // Toujours auditer les erreurs
        await this.auditService.logEvent({
          type: 'system',
          action: `${method} ${url} - ERROR`,
          userId,
          ipAddress,
          userAgent,
          details: {
            duration,
            success: false,
            error: error.message,
            stack: error.stack,
          },
          severity: error.status >= 500 ? 'high' : 'medium',
        });

        this.logger.error(
          `❌ ${method} ${url} - ${duration}ms - Error: ${error.message} - User: ${userId || 'anonymous'} - IP: ${ipAddress}`,
        );

        throw error;
      }),
    );
  }

  private async validateRequestSecurity(
    request: Request,
    ipAddress: string,
    userAgent: string,
  ): Promise<void> {
    try {
      // Valider les données du body si présentes
      if (request.body && Object.keys(request.body).length > 0) {
        const validation = await this.securityService.validateRequest(
          request.body,
          ipAddress,
          userAgent,
        );

        if (!validation.isValid) {
          this.logger.warn(
            `🚨 SECURITY THREAT DETECTED: ${validation.threats.join(', ')} - IP: ${ipAddress}`,
          );
        }
      }

      // Valider les query parameters
      if (request.query && Object.keys(request.query).length > 0) {
        const validation = await this.securityService.validateRequest(
          request.query as Record<string, any>,
          ipAddress,
          userAgent,
        );

        if (!validation.isValid) {
          this.logger.warn(
            `🚨 SECURITY THREAT IN QUERY: ${validation.threats.join(', ')} - IP: ${ipAddress}`,
          );
        }
      }
    } catch (error) {
      this.logger.error('Error in security validation:', error);
    }
  }

  private shouldAudit(method: string, url: string): boolean {
    // Auditer toutes les mutations (POST, PUT, PATCH, DELETE)
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return true;
    }

    // Auditer les endpoints sensibles
    const sensitiveEndpoints = [
      '/api/auth',
      '/api/admin',
      '/api/security',
      '/api/users',
    ];

    return sensitiveEndpoints.some((endpoint) => url.startsWith(endpoint));
  }

  private getAuditType(url: string): 'auth' | 'data' | 'system' | 'security' {
    if (url.includes('/auth')) return 'auth';
    if (url.includes('/security')) return 'security';
    if (url.includes('/api')) return 'data';
    return 'system';
  }
}
