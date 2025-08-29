import { Injectable } from '@nestjs/common';

export interface SystemMetrics {
  id: string;
  timestamp: Date;
  cpu: {
    usage: number;
    load: number[];
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  database: {
    connections: number;
    responseTime: number;
    errors: number;
  };
  api: {
    requests: number;
    errors: number;
    avgResponseTime: number;
  };
  websockets: {
    connections: number;
    messagesPerSecond: number;
  };
}

export interface PerformanceAlert {
  id: string;
  timestamp: Date;
  type: 'CPU_HIGH' | 'MEMORY_HIGH' | 'DB_SLOW' | 'API_ERRORS' | 'DISK_SPACE';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  value: number;
  threshold: number;
  resolved: boolean;
}

@Injectable()
export class MonitoringService {
  private metrics: SystemMetrics[] = [];
  private alerts: PerformanceAlert[] = [];
  private thresholds = {
    cpu: 80, // %
    memory: 85, // %
    dbResponseTime: 1000, // ms
    apiErrorRate: 5, // %
  };

  // Métriques système en temps réel
  async collectSystemMetrics(): Promise<SystemMetrics> {
    const process = await import('process');
    const os = await import('os');

    const metrics: SystemMetrics = {
      id: Date.now().toString(),
      timestamp: new Date(),
      cpu: {
        usage: this.getCpuUsage(),
        load: os.loadavg(),
      },
      memory: {
        used: process.memoryUsage().heapUsed,
        total: process.memoryUsage().heapTotal,
        percentage: (process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100,
      },
      database: {
        connections: this.getDatabaseConnections(),
        responseTime: await this.measureDatabaseResponseTime(),
        errors: this.getDatabaseErrors(),
      },
      api: {
        requests: this.getApiRequests(),
        errors: this.getApiErrors(),
        avgResponseTime: this.getApiResponseTime(),
      },
      websockets: {
        connections: this.getWebSocketConnections(),
        messagesPerSecond: this.getWebSocketMessages(),
      },
    };

    // Stocker les métriques (garder seulement les 1000 dernières)
    this.metrics.push(metrics);
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    // Vérifier les seuils et créer des alertes
    this.checkThresholds(metrics);

    return metrics;
  }

  // Obtenir les métriques récentes
  getRecentMetrics(limit: number = 50): SystemMetrics[] {
    return this.metrics.slice(-limit);
  }

  // Obtenir les alertes actives
  getActiveAlerts(): PerformanceAlert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  // Obtenir toutes les alertes
  getAllAlerts(limit: number = 100): PerformanceAlert[] {
    return this.alerts.slice(-limit);
  }

  // Résoudre une alerte
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      return true;
    }
    return false;
  }

  // Statistiques du système
  getSystemStats() {
    const recentMetrics = this.getRecentMetrics(10);
    const activeAlerts = this.getActiveAlerts();

    if (recentMetrics.length === 0) {
      return {
        status: 'unknown',
        uptime: process.uptime(),
        alerts: activeAlerts.length,
        timestamp: new Date(),
      };
    }

    const latest = recentMetrics[recentMetrics.length - 1];
    const avgCpu = recentMetrics.reduce((sum, m) => sum + m.cpu.usage, 0) / recentMetrics.length;
    const avgMemory = recentMetrics.reduce((sum, m) => sum + m.memory.percentage, 0) / recentMetrics.length;

    return {
      status: this.getSystemStatus(latest, activeAlerts),
      uptime: process.uptime(),
      metrics: {
        cpu: {
          current: latest.cpu.usage,
          average: avgCpu,
        },
        memory: {
          current: latest.memory.percentage,
          average: avgMemory,
          used: `${(latest.memory.used / 1024 / 1024).toFixed(2)} MB`,
          total: `${(latest.memory.total / 1024 / 1024).toFixed(2)} MB`,
        },
        database: {
          connections: latest.database.connections,
          responseTime: `${latest.database.responseTime}ms`,
          errors: latest.database.errors,
        },
        api: {
          requests: latest.api.requests,
          errors: latest.api.errors,
          responseTime: `${latest.api.avgResponseTime}ms`,
        },
        websockets: {
          connections: latest.websockets.connections,
          messagesPerSecond: latest.websockets.messagesPerSecond,
        },
      },
      alerts: {
        total: this.alerts.length,
        active: activeAlerts.length,
        critical: activeAlerts.filter(a => a.severity === 'critical').length,
        high: activeAlerts.filter(a => a.severity === 'high').length,
      },
      timestamp: new Date(),
    };
  }

  // Méthodes privées pour collecter les données
  private getCpuUsage(): number {
    // Simulation de l'usage CPU (dans un vrai système, utiliser des libs comme 'pidusage')
    return Math.random() * 100;
  }

  private getDatabaseConnections(): number {
    // Simulation (dans un vrai système, récupérer depuis Prisma/DB)
    return Math.floor(Math.random() * 20) + 1;
  }

  private async measureDatabaseResponseTime(): Promise<number> {
    // Simulation d'un ping vers la DB
    const start = Date.now();
    await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
    return Date.now() - start;
  }

  private getDatabaseErrors(): number {
    return Math.floor(Math.random() * 3);
  }

  private getApiRequests(): number {
    return Math.floor(Math.random() * 1000) + 100;
  }

  private getApiErrors(): number {
    return Math.floor(Math.random() * 10);
  }

  private getApiResponseTime(): number {
    return Math.floor(Math.random() * 200) + 50;
  }

  private getWebSocketConnections(): number {
    return Math.floor(Math.random() * 50);
  }

  private getWebSocketMessages(): number {
    return Math.floor(Math.random() * 100);
  }

  private checkThresholds(metrics: SystemMetrics): void {
    // Vérifier CPU
    if (metrics.cpu.usage > this.thresholds.cpu) {
      this.createAlert('CPU_HIGH', 'high', 
        `Usage CPU élevé: ${metrics.cpu.usage.toFixed(1)}%`,
        metrics.cpu.usage, this.thresholds.cpu);
    }

    // Vérifier mémoire
    if (metrics.memory.percentage > this.thresholds.memory) {
      this.createAlert('MEMORY_HIGH', 'high',
        `Usage mémoire élevé: ${metrics.memory.percentage.toFixed(1)}%`,
        metrics.memory.percentage, this.thresholds.memory);
    }

    // Vérifier temps de réponse DB
    if (metrics.database.responseTime > this.thresholds.dbResponseTime) {
      this.createAlert('DB_SLOW', 'medium',
        `Base de données lente: ${metrics.database.responseTime}ms`,
        metrics.database.responseTime, this.thresholds.dbResponseTime);
    }

    // Vérifier taux d'erreur API
    const errorRate = (metrics.api.errors / metrics.api.requests) * 100;
    if (errorRate > this.thresholds.apiErrorRate) {
      this.createAlert('API_ERRORS', 'medium',
        `Taux d'erreur API élevé: ${errorRate.toFixed(1)}%`,
        errorRate, this.thresholds.apiErrorRate);
    }
  }

  private createAlert(
    type: PerformanceAlert['type'],
    severity: PerformanceAlert['severity'],
    message: string,
    value: number,
    threshold: number
  ): void {
    // Éviter les doublons d'alertes récentes
    const recentAlert = this.alerts
      .filter(a => !a.resolved && a.type === type)
      .find(a => Date.now() - a.timestamp.getTime() < 300000); // 5 minutes

    if (!recentAlert) {
      const alert: PerformanceAlert = {
        id: Date.now().toString(),
        timestamp: new Date(),
        type,
        severity,
        message,
        value,
        threshold,
        resolved: false,
      };

      this.alerts.push(alert);
      console.warn(`🚨 ALERTE SYSTÈME: ${message}`);
    }
  }

  private getSystemStatus(latest: SystemMetrics, activeAlerts: PerformanceAlert[]): string {
    const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical');
    const highAlerts = activeAlerts.filter(a => a.severity === 'high');

    if (criticalAlerts.length > 0) return 'critical';
    if (highAlerts.length > 0) return 'warning';
    if (latest.cpu.usage > 70 || latest.memory.percentage > 80) return 'stressed';
    return 'healthy';
  }
}
