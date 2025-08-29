import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { Public } from '../auth/global-auth.guard';

@Public()
@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('health')
  async getHealthCheck() {
    const metrics = await this.monitoringService.collectSystemMetrics();
    const stats = this.monitoringService.getSystemStats();
    
    return {
      status: 'ok',
      timestamp: new Date(),
      system: stats,
      latest: metrics,
    };
  }

  @Get('metrics')
  async getMetrics(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 50;
    const metrics = this.monitoringService.getRecentMetrics(limitNum);
    
    return {
      metrics,
      count: metrics.length,
      timestamp: new Date(),
    };
  }

  @Get('metrics/live')
  async getLiveMetrics() {
    const metrics = await this.monitoringService.collectSystemMetrics();
    return metrics;
  }

  @Get('alerts')
  getAlerts(@Query('active') activeOnly?: string) {
    const alerts = activeOnly === 'true' 
      ? this.monitoringService.getActiveAlerts()
      : this.monitoringService.getAllAlerts();
    
    return {
      alerts,
      count: alerts.length,
      timestamp: new Date(),
    };
  }

  @Post('alerts/:id/resolve')
  resolveAlert(@Param('id') id: string) {
    const resolved = this.monitoringService.resolveAlert(id);
    
    return {
      success: resolved,
      message: resolved ? 'Alerte résolue' : 'Alerte non trouvée',
      alertId: id,
      timestamp: new Date(),
    };
  }

  @Get('stats')
  getSystemStats() {
    return this.monitoringService.getSystemStats();
  }

  @Get('dashboard')
  async getDashboardData() {
    const stats = this.monitoringService.getSystemStats();
    const recentMetrics = this.monitoringService.getRecentMetrics(20);
    const activeAlerts = this.monitoringService.getActiveAlerts();
    
    return {
      overview: stats,
      metrics: {
        recent: recentMetrics,
        trends: this.calculateTrends(recentMetrics),
      },
      alerts: {
        active: activeAlerts,
        summary: {
          total: activeAlerts.length,
          critical: activeAlerts.filter(a => a.severity === 'critical').length,
          high: activeAlerts.filter(a => a.severity === 'high').length,
          medium: activeAlerts.filter(a => a.severity === 'medium').length,
        },
      },
      timestamp: new Date(),
    };
  }

  private calculateTrends(metrics: any[]) {
    if (metrics.length < 2) return null;
    
    const first = metrics[0];
    const last = metrics[metrics.length - 1];
    
    return {
      cpu: {
        change: last.cpu.usage - first.cpu.usage,
        trend: last.cpu.usage > first.cpu.usage ? 'up' : 'down',
      },
      memory: {
        change: last.memory.percentage - first.memory.percentage,
        trend: last.memory.percentage > first.memory.percentage ? 'up' : 'down',
      },
      database: {
        change: last.database.responseTime - first.database.responseTime,
        trend: last.database.responseTime > first.database.responseTime ? 'slower' : 'faster',
      },
    };
  }
}
