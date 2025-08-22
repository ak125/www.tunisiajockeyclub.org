import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RemixController } from './remix/remix.controller';
import { RemixService } from './remix/remix.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ApiModule } from './api/api.module';
import { SupabaseService } from './supabase/supabase.service';
import { TestController } from './test/test.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule, 
    ApiModule
  ],
  controllers: [TestController, RemixController], // TestController en premier, Remix en dernier pour capturer tout le reste
  providers: [PrismaService, RemixService, SupabaseService],
})
export class AppModule {}
