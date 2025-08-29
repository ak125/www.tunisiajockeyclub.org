import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsGateway } from './events.gateway';
import { Public } from '../auth/global-auth.guard';

@Public()
@Controller('events-demo')
export class EventsDemoController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Get('test-notification')
  testNotification() {
    const notification = this.eventsService.createNotification({
      type: 'SYSTEM_ALERT',
      message: 'Test de notification - Système opérationnel',
      data: { test: true, timestamp: new Date() },
    });

    // Diffuser via WebSocket si disponible
    if (this.eventsGateway.server) {
      this.eventsGateway.server.emit('notification', notification);
    }

    return {
      success: true,
      notification,
      message: 'Notification de test envoyée !',
    };
  }

  @Post('test-race-update')
  testRaceUpdate(@Body() data: { raceId?: string; status?: string }) {
    const raceUpdate = this.eventsService.createRaceUpdate({
      raceId: data.raceId || 'race_demo_001',
      status: (data.status as any) || 'RUNNING',
      currentLap: 5,
      totalLaps: 10,
    });

    // Diffuser via WebSocket si disponible
    if (this.eventsGateway.server) {
      this.eventsGateway.server.emit('race-update', raceUpdate);
    }

    return {
      success: true,
      raceUpdate,
      message: 'Mise à jour de course envoyée !',
    };
  }

  @Get('test-weather')
  testWeatherAlert() {
    const alert = this.eventsService.createWeatherAlert(
      'medium',
      'Risque de pluie dans 30 minutes',
    );

    // Diffuser via WebSocket si disponible
    if (this.eventsGateway.server) {
      this.eventsGateway.server.emit('weather-alert', alert);
    }

    return {
      success: true,
      alert,
      message: 'Alerte météo envoyée !',
    };
  }

  @Get('status')
  getSystemStatus() {
    return {
      system: {
        status: 'operational',
        uptime: process.uptime(),
        timestamp: new Date(),
      },
      notifications: this.eventsService.getNotificationStats(),
      websocket: {
        connected: this.eventsGateway.server ? 'active' : 'inactive',
      },
    };
  }
}
