import { Module } from '@nestjs/common';
import { RaceGateway } from './race.gateway';

@Module({
  providers: [RaceGateway],
  exports: [RaceGateway]
})
export class WebSocketModule {}
