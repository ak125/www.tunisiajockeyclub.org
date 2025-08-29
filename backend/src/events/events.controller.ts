import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsGateway } from './events.gateway';
import { Public } from '../auth/global-auth.guard';
import {
  CreateNotificationDto,
  CreateNotificationSchema,
} from './dto/create-notification.dto';

@Public()
@Controller('api/events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Get('notifications')
  getNotifications() {
    return {
      success: true,
      data: this.eventsService.getAllNotifications(),
    };
  }

  @Get('stats')
  getStats() {
    return {
      success: true,
      data: this.eventsService.getNotificationStats(),
    };
  }

  @Post('notification')
  createNotification(@Body() createNotificationDto: CreateNotificationDto) {
    // Validation avec Zod
    const validatedData = CreateNotificationSchema.parse(createNotificationDto);
    
    const notification = this.eventsService.createNotification(validatedData);

    // Diffuser via WebSocket
    this.eventsGateway.server.emit('notification', notification);

    return {
      success: true,
      data: notification,
    };
  }

  @Post('test-broadcast')
  testBroadcast() {
    const testNotification = this.eventsService.createNotification({
      type: 'SYSTEM_ALERT',
      message: 'Test de diffusion WebSocket',
      data: {
        test: true,
        timestamp: new Date().toISOString(),
      },
    });

    // Diffuser via WebSocket
    this.eventsGateway.server.emit('notification', testNotification);

    return {
      success: true,
      message: 'Test de diffusion envoyé',
      data: testNotification,
    };
  }
}
