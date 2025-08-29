# Stratégie de Déploiement - Tunisia Jockey Club

## 1. Configuration Environnements

### .env.production
```bash
# Base de données
DATABASE_URL="postgresql://user:pass@prod-db:5432/tjc"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# Sécurité (GÉNÉRER DE NOUVEAUX SECRETS!)
SESSION_SECRET="$(openssl rand -hex 64)"
DATABASE_ENCRYPTION_KEY="$(openssl rand -hex 32)"
JWT_SECRET="$(openssl rand -hex 32)"

# Cache
REDIS_URL="redis://prod-redis:6379"

# Application
NODE_ENV="production"
PORT="3000"
FRONTEND_URL="https://tjc.tn"
```

## 2. Docker Production

### Dockerfile.prod
```dockerfile
FROM node:18-alpine AS base
WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runner
FROM node:18-alpine AS runner
WORKDIR /app

# Utilisateur non-root pour sécurité
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copier les fichiers
COPY --from=base /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

USER nestjs
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/security/health || exit 1

CMD ["node", "dist/main"]
```

### docker-compose.prod.yml
```yaml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.prod
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - redis
      - postgres
    restart: unless-stopped
    
  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    restart: unless-stopped
    
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: tjc
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

## 3. GitHub Actions CI/CD

### .github/workflows/deploy.yml
```yaml
name: Deploy Tunisia Jockey Club

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: |
          cd backend
          npm ci
          
      - name: Run tests
        run: |
          cd backend
          npm run test:cov
          
      - name: Lint
        run: |
          cd backend
          npm run lint
          
      - name: Type check
        run: |
          cd backend
          npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        env:
          DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
          DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
        run: |
          # Script de déploiement
          ./scripts/deploy.sh
```

## 4. Monitoring Production

### Scripts de surveillance
```bash
#!/bin/bash
# scripts/health-check.sh

echo "🔍 Vérification santé application..."

# API Health
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/security/health)
if [ "$API_STATUS" != "200" ]; then
  echo "❌ API non disponible (${API_STATUS})"
  exit 1
fi

# Redis
redis-cli ping > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "❌ Redis non disponible"
  exit 1
fi

# Base de données
psql $DATABASE_URL -c "SELECT 1;" > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "❌ Base de données non disponible"
  exit 1
fi

echo "✅ Tous les services sont opérationnels"
```

## 5. Sécurité Production

### nginx.conf
```nginx
server {
    listen 443 ssl http2;
    server_name tjc.tn www.tjc.tn;
    
    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://app:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Commandes de déploiement
```bash
# Build production
docker-compose -f docker-compose.prod.yml build

# Déployer
docker-compose -f docker-compose.prod.yml up -d

# Vérifier les logs
docker-compose -f docker-compose.prod.yml logs -f

# Backup base de données
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U tjc tjc > backup.sql
```
