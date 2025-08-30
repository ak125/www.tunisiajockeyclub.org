import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiController } from './api.controller';

@Module({
  controllers: [ApiController],
  providers: [PrismaService],
})
export class ApiModule {}
