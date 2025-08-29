import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { EventsService, RaceUpdateData, NotificationData } from './events.service';

interface ConnectedClient {
  id: string;
  userId?: string;
  subscribedRaces: string[];
  connectedAt: Date;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  },
  namespace: '/events',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(EventsGateway.name);
  private connectedClients = new Map<string, ConnectedClient>();

  constructor(private readonly eventsService: EventsService) {}

  // Connexion d'un client
  handleConnection(client: Socket) {
    const clientInfo: ConnectedClient = {
      id: client.id,
      subscribedRaces: [],
      connectedAt: new Date(),
    };

    this.connectedClients.set(client.id, clientInfo);
    this.logger.log(`Client connecté: ${client.id}`);

    // Envoyer les notifications récentes au client
    const recentNotifications = this.eventsService.getRecentNotifications(10);
    client.emit('recent-notifications', recentNotifications);

    // Envoyer les statistiques de connexion
    client.emit('connection-stats', {
      connectedClients: this.connectedClients.size,
      timestamp: new Date(),
    });
  }

  // Déconnexion d'un client
  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`Client déconnecté: ${client.id}`);
  }

  // S'abonner aux mises à jour d'une course
  @SubscribeMessage('subscribe-race')
  handleSubscribeRace(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { raceId: string; userId?: string },
  ) {
    const clientInfo = this.connectedClients.get(client.id);
    if (clientInfo) {
      if (!clientInfo.subscribedRaces.includes(data.raceId)) {
        clientInfo.subscribedRaces.push(data.raceId);
        clientInfo.userId = data.userId;
        this.connectedClients.set(client.id, clientInfo);
      }

      client.join(`race:${data.raceId}`);
      client.emit('subscribed', { raceId: data.raceId, status: 'success' });

      this.logger.log(
        `Client ${client.id} abonné à la course ${data.raceId}`,
      );
    }
  }

  // Se désabonner des mises à jour d'une course
  @SubscribeMessage('unsubscribe-race')
  handleUnsubscribeRace(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { raceId: string },
  ) {
    const clientInfo = this.connectedClients.get(client.id);
    if (clientInfo) {
      clientInfo.subscribedRaces = clientInfo.subscribedRaces.filter(
        (id) => id !== data.raceId,
      );
      this.connectedClients.set(client.id, clientInfo);
    }

    client.leave(`race:${data.raceId}`);
    client.emit('unsubscribed', { raceId: data.raceId, status: 'success' });

    this.logger.log(
      `Client ${client.id} désabonné de la course ${data.raceId}`,
    );
  }

  // Obtenir les notifications utilisateur
  @SubscribeMessage('get-notifications')
  handleGetNotifications(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId?: string; limit?: number },
  ) {
    const notifications = data.userId
      ? this.eventsService.getUserNotifications(data.userId, data.limit)
      : this.eventsService.getRecentNotifications(data.limit);

    client.emit('notifications', notifications);
  }

  // Obtenir les statistiques
  @SubscribeMessage('get-stats')
  handleGetStats(@ConnectedSocket() client: Socket) {
    const stats = this.eventsService.getNotificationStats();
    const connectionStats = {
      connectedClients: this.connectedClients.size,
      clientsWithRaceSubscriptions: Array.from(
        this.connectedClients.values(),
      ).filter((c) => c.subscribedRaces.length > 0).length,
    };

    client.emit('stats', { ...stats, connection: connectionStats });
  }

  // === MÉTHODES POUR ÉMETTRE DES ÉVÉNEMENTS ===

  // Diffuser une mise à jour de course
  broadcastRaceUpdate(update: RaceUpdateData) {
    this.server.to(`race:${update.raceId}`).emit('race-update', update);
    this.server.emit('global-race-update', update);

    this.logger.log(
      `Mise à jour diffusée pour la course ${update.raceId}: ${update.status}`,
    );
  }

  // Diffuser une notification
  broadcastNotification(notification: NotificationData) {
    if (notification.userId) {
      // Notification spécifique à un utilisateur
      this.server.emit('user-notification', notification);
    } else {
      // Notification globale
      this.server.emit('global-notification', notification);
    }

    this.logger.log(
      `Notification diffusée: ${notification.message} (${notification.type})`,
    );
  }

  // Diffuser les résultats d'une course
  broadcastRaceResults(raceId: string, results: any[]) {
    const notification = this.eventsService.createNotification({
      type: 'RACE_RESULTS',
      message: `Les résultats de la course ${raceId} sont publiés`,
      data: { raceId, results },
    });

    this.server.to(`race:${raceId}`).emit('race-results', {
      raceId,
      results,
      timestamp: new Date(),
    });

    this.broadcastNotification(notification);
  }

  // Diffuser une alerte météo
  broadcastWeatherAlert(severity: 'low' | 'medium' | 'high', message: string) {
    const alert = this.eventsService.createWeatherAlert(severity, message);
    this.server.emit('weather-alert', alert);
    this.broadcastNotification(alert);
  }

  // Obtenir les clients connectés
  getConnectedClientsInfo() {
    return Array.from(this.connectedClients.entries()).map(([id, info]) => ({
      id,
      userId: info.userId,
      subscribedRacesCount: info.subscribedRaces.length,
      subscribedRaces: info.subscribedRaces,
      connectedAt: info.connectedAt,
      connectedDuration: new Date().getTime() - info.connectedAt.getTime(),
    }));
  }

  // Obtenir les statistiques de connexion
  getConnectionStats() {
    const clients = Array.from(this.connectedClients.values());
    return {
      totalConnected: clients.length,
      withSubscriptions: clients.filter((c) => c.subscribedRaces.length > 0)
        .length,
      uniqueRaces: new Set(
        clients.flatMap((c) => c.subscribedRaces),
      ).size,
      averageConnectionTime:
        clients.length > 0
          ? clients.reduce(
              (sum, c) => sum + (new Date().getTime() - c.connectedAt.getTime()),
              0,
            ) / clients.length
          : 0,
    };
  }
}
