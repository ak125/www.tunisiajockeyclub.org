import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { IFHARatingService } from './ifha-rating-simple.service';
import { IFHARatingSimpleController } from './ifha-rating-simple.controller';

@Module({
  imports: [PrismaModule],
  controllers: [IFHARatingSimpleController],
  providers: [IFHARatingService],
  exports: [IFHARatingService],
})
export class IFHARatingSimpleModule {}
