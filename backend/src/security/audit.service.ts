import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AuditEvent {
  type: 'auth' | 'data' | 'system' | 'security';
  action: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  resource?: string;
  details?: Record<string, any>;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async logEvent(event: Omit<AuditEvent, 'timestamp'>): Promise<void> {
    const auditEvent: AuditEvent = {
      ...event,
      timestamp: new Date(),
    };

    // Log critique immédiatement
    if (event.severity === 'critical' || event.severity === 'high') {
      this.logger.error(`🚨 SECURITY ALERT: ${event.action}`, {
        ...auditEvent,
        details: JSON.stringify(event.details),
      });
    } else {
      this.logger.log(`📋 Audit: ${event.action}`, {
        type: event.type,
        userId: event.userId,
        severity: event.severity,
      });
    }

    // Enregistrer en base de données (table à créer)
    try {
      // Pour l'instant, on utilise un log structuré
      // TODO: Créer une table audit_logs dans Prisma
      this.logger.log('AUDIT_EVENT', JSON.stringify(auditEvent));
    } catch (error) {
      this.logger.error('Failed to save audit event', error);
    }
  }

  async logAuthEvent(action: string, details: {
    userId?: string;
    email?: string;
    ipAddress?: string;
    userAgent?: string;
    success: boolean;
    reason?: string;
  }): Promise<void> {
    await this.logEvent({
      type: 'auth',
      action,
      userId: details.userId,
      ipAddress: details.ipAddress,
      userAgent: details.userAgent,
      details: {
        email: details.email,
        success: details.success,
        reason: details.reason,
      },
      severity: details.success ? 'low' : 'medium',
    });
  }

  async logDataAccess(action: string, details: {
    userId: string;
    resource: string;
    ipAddress?: string;
    recordId?: string;
    changes?: Record<string, any>;
  }): Promise<void> {
    await this.logEvent({
      type: 'data',
      action,
      userId: details.userId,
      ipAddress: details.ipAddress,
      resource: details.resource,
      details: {
        recordId: details.recordId,
        changes: details.changes,
      },
      severity: 'low',
    });
  }

  async logSecurityEvent(action: string, details: {
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    threat?: string;
    blocked?: boolean;
  }): Promise<void> {
    await this.logEvent({
      type: 'security',
      action,
      userId: details.userId,
      ipAddress: details.ipAddress,
      userAgent: details.userAgent,
      details: {
        threat: details.threat,
        blocked: details.blocked,
      },
      severity: details.blocked ? 'high' : 'critical',
    });
  }

  async logSystemEvent(action: string, details: {
    component: string;
    status: 'success' | 'error' | 'warning';
    message?: string;
    error?: any;
  }): Promise<void> {
    await this.logEvent({
      type: 'system',
      action,
      details: {
        component: details.component,
        status: details.status,
        message: details.message,
        error: details.error instanceof Error ? {
          message: details.error.message,
          stack: details.error.stack,
        } : details.error,
      },
      severity: details.status === 'error' ? 'high' : 'low',
    });
  }

  // Analyse des événements suspects
  async detectSuspiciousActivity(userId: string, timeWindowMinutes: number = 15): Promise<boolean> {
    // Pour l'instant, simulation basique
    // TODO: Implémenter une vraie détection basée sur les patterns
    
    const now = new Date();
    const windowStart = new Date(now.getTime() - (timeWindowMinutes * 60 * 1000));

    // Compter les tentatives d'authentification échouées récentes
    // Cette logique sera implémentée quand on aura la table audit_logs
    
    this.logger.debug(`Checking suspicious activity for user ${userId} in last ${timeWindowMinutes} minutes`);
    
    return false; // Temporaire
  }

  // Génération de rapport de sécurité
  async generateSecurityReport(startDate: Date, endDate: Date): Promise<{
    totalEvents: number;
    criticalEvents: number;
    authFailures: number;
    suspiciousActivity: number;
    topIpAddresses: Array<{ ip: string; count: number }>;
  }> {
    // TODO: Implémenter quand la table audit_logs sera créée
    return {
      totalEvents: 0,
      criticalEvents: 0,
      authFailures: 0,
      suspiciousActivity: 0,
      topIpAddresses: [],
    };
  }
}
