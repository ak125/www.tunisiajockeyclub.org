import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EventsDemoController } from './events-demo.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EventsController, EventsDemoController],
  providers: [EventsGateway, EventsService],
  exports: [EventsService, EventsGateway],
})
export class EventsModule {}
