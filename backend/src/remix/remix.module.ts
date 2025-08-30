import { Module } from '@nestjs/common';
import { RemixController } from './remix.controller';
import { RemixService } from './remix.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [RemixController],
  providers: [RemixService, SupabaseService],
  exports: [RemixService],
})
export class RemixModule {}