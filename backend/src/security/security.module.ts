import { Module, Global } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { SecurityService } from './security.service';
import { SecurityController } from './security.controller';
import { EncryptionService } from './encryption.service';
import { AuditService } from './audit.service';

@Global()
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 10, // limit each IP to 10 requests per second
      },
      {
        name: 'medium', 
        ttl: 60 * 1000, // 1 minute
        limit: 100, // limit each IP to 100 requests per minute
      },
      {
        name: 'long',
        ttl: 15 * 60 * 1000, // 15 minutes  
        limit: 1000, // limit each IP to 1000 requests per 15 minutes
      },
      {
        name: 'auth',
        ttl:
          process.env.NODE_ENV === 'development' ? 60 * 1000 : 15 * 60 * 1000,
        limit: process.env.NODE_ENV === 'development' ? 50 : 5,
      },
    ]),
  ],
  providers: [
    SecurityService,
    EncryptionService,
    AuditService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [SecurityController],
  exports: [SecurityService, EncryptionService, AuditService],
})
export class SecurityModule {}
