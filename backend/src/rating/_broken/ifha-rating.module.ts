import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '../prisma/prisma.module';
import { IFHARatingCalculatorService } from './ifha-rating-calculator.service';
import { IFHAIntegrationService } from './ifha-integration.service';
import { IFHARatingController } from './ifha-rating.controller';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
  ],
  controllers: [IFHARatingController],
  providers: [
    IFHARatingCalculatorService,
    IFHAIntegrationService,
  ],
  exports: [
    IFHARatingCalculatorService,
    IFHAIntegrationService,
  ],
})
export class IFHARatingModule {}
