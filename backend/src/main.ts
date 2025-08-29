import 'reflect-metadata';
import 'dotenv/config';
import { getPublicDir, startDevServer } from '@fafa/frontend';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { RequestMethod } from '@nestjs/common';

import RedisStore from 'connect-redis';
import session from 'express-session';
import Redis from 'ioredis';
import passport from 'passport';
import helmet from 'helmet';
import { urlencoded, json } from 'body-parser';
import { HttpExceptionFilter } from './auth/exception.filter';
import { GlobalAuthGuard } from './auth/global-auth.guard';
import { PrismaService } from './prisma/prisma.service';
import { SecurityService } from './security/security.service';

const redisStoreFactory = RedisStore(session);

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      bodyParser: false,
    });

    await startDevServer(app);
    console.log('Serveur de développement démarré.');

    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const redisClient = new Redis(redisUrl);

    redisClient.on('connect', () => console.log('Redis connecté.'));
    redisClient.on('error', (err) => console.error('Erreur Redis :', err));

    const redisStore = new redisStoreFactory({
      client: redisClient,
      ttl: 86400 * 30,
    });

    // Session middleware avec sécurité renforcée
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET === '123') {
    console.error('⚠️  ERREUR CRITIQUE: SESSION_SECRET non configuré ou utilise la valeur par défaut');
    process.exit(1);
  }

  const isProduction = process.env.NODE_ENV === 'production';
  
  app.use(
    session({
      name: 'tjc.sid', // Nom personnalisé pour Tunisia Jockey Club
      store: redisStore,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      rolling: true, // Renouvelle la session à chaque requête
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 heures au lieu de 30 jours
        httpOnly: true,
        secure: isProduction, // HTTPS uniquement en production
        sameSite: isProduction ? 'strict' : 'lax', // Plus strict en production
      },
    }),
    );
    console.log('Middleware de session initialisé.');

    // Middleware de sécurité avec Helmet
    const securityService = app.get(SecurityService);
    const securityHeaders = securityService.getSecurityHeaders();
    
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "https://*.supabase.co", "wss://*.supabase.co"],
          frameAncestors: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"]
        }
      },
      hsts: isProduction ? {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      } : false
    }));
    
    // Ajouter les headers de sécurité personnalisés
    app.use((req: any, res: any, next: any) => {
      Object.entries(securityHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
      });
      next();
    });
    
    console.log('Middlewares de sécurité initialisés.');    app.useStaticAssets(getPublicDir(), {
      immutable: true,
      maxAge: '1y',
      index: false,
    });
    console.log('Assets statiques configurés.');

    app.useGlobalFilters(new HttpExceptionFilter());

    // Activation du guard global d'authentification
    const reflector = app.get(Reflector);
    const prismaService = app.get(PrismaService);
    app.useGlobalGuards(new GlobalAuthGuard(reflector, prismaService));

    app.use(passport.initialize());
    app.use(passport.session());
    
    // Configuration du préfixe global pour les APIs
    app.setGlobalPrefix('api', {
      exclude: [
        { path: '/', method: RequestMethod.ALL },
        { path: '/*', method: RequestMethod.ALL },
        { path: '/dashboard*', method: RequestMethod.ALL },
        { path: '/auth/login*', method: RequestMethod.ALL },
        { path: '/static*', method: RequestMethod.ALL },
        { path: '/_remix*', method: RequestMethod.ALL },
        { path: '/assets*', method: RequestMethod.ALL },
        { path: 'favicon.ico', method: RequestMethod.GET },
        { path: 'robots.txt', method: RequestMethod.GET },
      ],
    });
    
    // Configuration body-parser pour tous les endpoints API
    app.use('/api', json({ limit: '10mb' }));
    app.use('/api', urlencoded({ extended: true, limit: '10mb' }));
    
    // Configuration body-parser spécifique pour l'ancien endpoint auth
    app.use('/auth/login', urlencoded({ extended: true }));
    app.use('/auth/login', json());
    console.log('Passport et body-parser initialisés.');

    app.set('trust proxy', 1);

    const selectedPort = process.env.PORT || 3000;
    console.log(`Démarrage du serveur sur le port ${selectedPort}...`);

    await app.listen(selectedPort);
    console.log(`Serveur opérationnel sur http://localhost:${selectedPort}`);
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur :', error);
  }
}

bootstrap();
