import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthApiController } from './auth-api.controller';
import { AuthService } from './auth.service';
import { CookieSerializer } from './cookie-serializer';
import { LocalAuthGuard } from './local-auth.guard';
import { LocalStrategy } from './local.strategy';
import { TokenStrategy } from './token.strategy';
import { TokenAuthGuard } from './token-auth.guard';
import { GlobalAuthGuard } from './global-auth.guard';
import { SessionAuthGuard } from './session-auth.guard';

@Module({
  imports: [PassportModule.register({ session: true })],
  controllers: [AuthController, AuthApiController],
  providers: [
    PrismaService,
    AuthService,
    LocalStrategy,
    TokenStrategy,
    LocalAuthGuard,
    TokenAuthGuard,
    CookieSerializer,
    GlobalAuthGuard,
    SessionAuthGuard,
  ],
  exports: [
    AuthService,
    LocalAuthGuard,
    TokenAuthGuard,
    GlobalAuthGuard,
    SessionAuthGuard,
  ],
})
export class AuthModule {}
