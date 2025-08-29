import { Injectable } from '@nestjs/common';

export interface NotificationData {
  id: string;
  type: string;
  message: string;
  data: Record<string, any>;
  timestamp: Date;
  userId?: string;
}

export interface RaceUpdateData {
  raceId: string;
  status: 'SCHEDULED' | 'RUNNING' | 'FINISHED' | 'CANCELLED';
  currentLap?: number;
  totalLaps?: number;
  leaders?: string[];
  timestamp: Date;
}

@Injectable()
export class EventsService {
  private notifications: NotificationData[] = [];

  createNotification(
    notification: Omit<NotificationData, 'id' | 'timestamp'>,
  ): NotificationData {
    const newNotification: NotificationData = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...notification,
    };

    this.notifications.push(newNotification);
    return newNotification;
  }

  getAllNotifications(): NotificationData[] {
    return this.notifications.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );
  }

  getNotificationStats() {
    return {
      total: this.notifications.length,
      recent: this.notifications.filter(
        (n) => Date.now() - n.timestamp.getTime() < 3600000,
      ).length,
    };
  }

  // Méthodes pour les notifications utilisateur
  getUserNotifications(userId: string, limit: number = 10): NotificationData[] {
    return this.notifications
      .filter((n) => !n.userId || n.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  getRecentNotifications(limit: number = 10): NotificationData[] {
    return this.notifications
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Méthodes pour les mises à jour de courses
  createRaceUpdate(raceData: Omit<RaceUpdateData, 'timestamp'>): NotificationData {
    return this.createNotification({
      type: 'RACE_UPDATE',
      message: `Course ${raceData.raceId}: ${raceData.status}`,
      data: {
        ...raceData,
        timestamp: new Date(),
      },
    });
  }

  // Méthodes pour les alertes météo
  createWeatherAlert(severity: string, message: string): NotificationData {
    return this.createNotification({
      type: 'WEATHER_ALERT',
      message: `Alerte météo (${severity}): ${message}`,
      data: {
        severity,
        alert: message,
      },
    });
  }

  // Méthodes pour les changements de jockey
  createJockeyChange(raceId: string, oldJockey: string, newJockey: string): NotificationData {
    return this.createNotification({
      type: 'JOCKEY_CHANGE',
      message: `Changement de jockey pour la course ${raceId}`,
      data: {
        raceId,
        oldJockey,
        newJockey,
      },
    });
  }

  // Méthode pour publier les résultats de course
  async publishRaceResults(raceId: string, results: any[]): Promise<NotificationData> {
    return this.createNotification({
      type: 'RACE_RESULTS',
      message: `Résultats de la course ${raceId} disponibles`,
      data: {
        raceId,
        results,
      },
    });
  }
}