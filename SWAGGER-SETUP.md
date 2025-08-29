# Documentation API - Tunisia Jockey Club

## Installation Swagger
```bash
cd backend
npm install @nestjs/swagger swagger-ui-express
```

## Configuration
```typescript
// main.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('Tunisia Jockey Club API')
    .setDescription('API complète pour la gestion des courses hippiques')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentification et autorisation')
    .addTag('races', 'Gestion des courses')
    .addTag('horses', 'Gestion des chevaux')
    .addTag('security', 'Endpoints de sécurité')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'TJC API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  await app.listen(3000);
}
```

## Décorateurs pour les Controllers
```typescript
// auth/auth-api.controller.ts
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('api/auth')
export class AuthApiController {
  
  @ApiOperation({ 
    summary: 'Connexion utilisateur',
    description: 'Authentifie un utilisateur avec email/mot de passe' 
  })
  @ApiBody({
    description: 'Données de connexion',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'monia@gmail.com' },
        password: { type: 'string', example: 'password123' }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Connexion réussie',
    schema: {
      example: {
        success: true,
        user: { email: 'monia@gmail.com', sessionToken: 'xxx' },
        source: 'supabase'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Identifiants incorrects' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // Implementation...
  }
}
```

## DTO avec Validation
```typescript
// dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Adresse email de l\'utilisateur',
    example: 'monia@gmail.com',
    format: 'email'
  })
  email: string;

  @ApiProperty({
    description: 'Mot de passe',
    example: 'password123',
    minLength: 8
  })
  password: string;
}
```

## URLs
- **Documentation** : http://localhost:3000/api/docs
- **JSON Schema** : http://localhost:3000/api/docs-json
