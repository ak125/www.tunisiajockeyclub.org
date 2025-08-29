import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/global-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
@Public() // Rendre public le endpoint de santé
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async checkHealth() {
    try {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`;
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected',
        uptime: process.uptime(),
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
        uptime: process.uptime(),
      };
    }
  }

  @Get('detailed')
  async detailedHealth() {
    try {
      const dbStart = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      const dbTime = Date.now() - dbStart;

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
          database: {
            status: 'connected',
            responseTime: `${dbTime}ms`,
          },
          cache: {
            status: 'not_implemented',
            responseTime: 'N/A',
          },
        },
        system: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          version: process.version,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        services: {
          database: {
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        },
        system: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          version: process.version,
        },
      };
    }
  }
}
