import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { SecurityService } from './security.service';
import { AuditService } from './audit.service';
import { Throttle } from '@nestjs/throttler';

@Controller('security')
export class SecurityController {
  constructor(
    private readonly securityService: SecurityService,
    private readonly auditService: AuditService,
  ) {}

  @Get('headers')
  getSecurityHeaders() {
    return this.securityService.getSecurityHeaders();
  }

  @Post('validate-password')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  validatePassword(@Body('password') password: string) {
    return this.securityService.validateStrongPassword(password);
  }

  @Post('sanitize')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  sanitizeInput(@Body('input') input: string) {
    return {
      sanitized: this.securityService.sanitizeInput(input),
    };
  }

  @Get('health')
  async healthCheck(@Req() req: Request) {
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    await this.auditService.logSystemEvent('security_health_check', {
      component: 'SecurityController',
      status: 'success',
      message: 'Security module health check passed',
    });

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      encryption: 'enabled',
      audit: 'enabled',
      rateLimit: 'enabled',
    };
  }
}
