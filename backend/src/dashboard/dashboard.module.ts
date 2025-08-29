import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseRestService } from '../supabase/supabase-rest.service';
import { RatingService } from '../rating/rating-simple.service';

@Module({
  controllers: [DashboardController],
  providers: [PrismaService, SupabaseRestService, RatingService],
})
export class DashboardModule {}
