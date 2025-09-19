#!/bin/bash

# 🚀 Script de Déploiement - Tunisia Jockey Club
# Déploiement automatisé avec Docker et CI/CD
# Auteur: Agent IA - 25 Août 2025

set -e

# Configuration
PROJECT_NAME="tunisia-jockey-club"
VERSION="1.0.0"
REGISTRY="ghcr.io"
NAMESPACE="ak125"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Emojis
ROCKET="🚀"
CHECK="✅"
WARNING="⚠️"
ERROR="❌"
PACKAGE="📦"
SHIP="🚢"
GEAR="⚙️"
CLOUD="☁️"

echo -e "${PURPLE}${ROCKET} Déploiement Tunisia Jockey Club ${ROCKET}${NC}"
echo "=========================================================="

log() {
    echo -e "[$(date '+%H:%M:%S')] $1"
}

# Fonction pour vérifier les prérequis
check_prerequisites() {
    log "${GEAR} ${BLUE}Vérification des prérequis...${NC}"
    
    local required_commands=("docker" "git" "node" "npm")
    for cmd in "${required_commands[@]}"; do
        if command -v $cmd &> /dev/null; then
            log "${CHECK} ${GREEN}$cmd: OK${NC}"
        else
            log "${ERROR} ${RED}$cmd manquant${NC}"
            exit 1
        fi
    done
    
    # Vérifier Docker daemon
    if docker info &> /dev/null; then
        log "${CHECK} ${GREEN}Docker daemon: OK${NC}"
    else
        log "${ERROR} ${RED}Docker daemon non accessible${NC}"
        exit 1
    fi
    
    log "${CHECK} ${GREEN}Tous les prérequis sont satisfaits${NC}"
}

# Fonction pour construire l'image Docker
build_docker_images() {
    log "\n${PACKAGE} ${BLUE}Construction des images Docker...${NC}"
    
    # Build de l'image principale
    docker build -t ${PROJECT_NAME}:latest .
    docker build -t ${PROJECT_NAME}:${VERSION} .
    log "${CHECK} Image principale construite"
    
    # Tag pour le registry
    if [ "$1" = "push" ]; then
        docker tag ${PROJECT_NAME}:latest ${REGISTRY}/${NAMESPACE}/${PROJECT_NAME}:latest
        docker tag ${PROJECT_NAME}:${VERSION} ${REGISTRY}/${NAMESPACE}/${PROJECT_NAME}:${VERSION}
        log "${CHECK} Images taguées pour le registry"
    fi
}

# Fonction pour les tests avant déploiement
run_deployment_tests() {
    log "\n${GEAR} ${YELLOW}Tests de pré-déploiement...${NC}"
    
    # Test de l'image Docker
    log "Test de l'image Docker..."
    docker run --rm -d -p 3001:3000 --name test-container ${PROJECT_NAME}:latest &
    CONTAINER_ID=$!
    
    sleep 15
    
    # Test HTTP
    if curl -f http://localhost:3001 &> /dev/null; then
        log "${CHECK} Test HTTP: OK"
    else
        log "${ERROR} Test HTTP: ÉCHEC"
        docker stop test-container 2>/dev/null || true
        exit 1
    fi
    
    # Nettoyage
    docker stop test-container 2>/dev/null || true
    log "${CHECK} Tests terminés"
}

# Fonction pour le déploiement local avec Docker Compose
deploy_local() {
    log "\n${SHIP} ${GREEN}Déploiement local avec Docker Compose...${NC}"
    
    # Créer le fichier docker-compose pour la production
    cat > docker-compose.production.yml << EOF
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - SUPABASE_URL=\${SUPABASE_URL}
      - SUPABASE_ANON_KEY=\${SUPABASE_ANON_KEY}
      - REDIS_URL=\${REDIS_URL:-redis://redis:6379}
    depends_on:
      - redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: unless-stopped

volumes:
  redis_data:

networks:
  default:
    name: ${PROJECT_NAME}_network
EOF

    # Créer la configuration nginx
    cat > nginx.conf << EOF
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name localhost;
        
        location / {
            proxy_pass http://app;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
    }
}
EOF

    # Déployer
    docker-compose -f docker-compose.production.yml up -d
    
    log "${CHECK} ${GREEN}Déploiement local terminé${NC}"
    log "${CLOUD} Application disponible sur: http://localhost"
}

# Fonction pour le déploiement sur cloud
deploy_cloud() {
    log "\n${CLOUD} ${PURPLE}Préparation pour le déploiement cloud...${NC}"
    
    # Créer les manifests Kubernetes
    mkdir -p k8s
    
    # Deployment
    cat > k8s/deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${PROJECT_NAME}
  labels:
    app: ${PROJECT_NAME}
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ${PROJECT_NAME}
  template:
    metadata:
      labels:
        app: ${PROJECT_NAME}
    spec:
      containers:
      - name: app
        image: ${REGISTRY}/${NAMESPACE}/${PROJECT_NAME}:${VERSION}
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: SUPABASE_URL
          valueFrom:
            secretKeyRef:
              name: ${PROJECT_NAME}-secrets
              key: supabase-url
        - name: SUPABASE_ANON_KEY
          valueFrom:
            secretKeyRef:
              name: ${PROJECT_NAME}-secrets
              key: supabase-key
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: ${PROJECT_NAME}-service
spec:
  selector:
    app: ${PROJECT_NAME}
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ${PROJECT_NAME}-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - ${PROJECT_NAME}.example.com
    secretName: ${PROJECT_NAME}-tls
  rules:
  - host: ${PROJECT_NAME}.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ${PROJECT_NAME}-service
            port:
              number: 80
EOF

    # Script de déploiement Kubernetes
    cat > k8s/deploy.sh << 'EOF'
#!/bin/bash

# Créer le namespace
kubectl create namespace tunisia-jockey-club --dry-run=client -o yaml | kubectl apply -f -

# Créer les secrets (à adapter avec vos vraies valeurs)
kubectl create secret generic tunisia-jockey-club-secrets \
  --from-literal=supabase-url="YOUR_SUPABASE_URL" \
  --from-literal=supabase-key="YOUR_SUPABASE_KEY" \
  --namespace=tunisia-jockey-club \
  --dry-run=client -o yaml | kubectl apply -f -

# Déployer l'application
kubectl apply -f deployment.yaml -n tunisia-jockey-club

# Vérifier le déploiement
kubectl get pods -n tunisia-jockey-club
kubectl get services -n tunisia-jockey-club

echo "Déploiement Kubernetes terminé !"
EOF

    chmod +x k8s/deploy.sh
    
    log "${CHECK} Manifests Kubernetes créés dans k8s/"
    log "${CLOUD} Pour déployer: cd k8s && ./deploy.sh"
}

# Fonction pour créer les scripts de monitoring
create_monitoring_scripts() {
    log "\n${GEAR} ${YELLOW}Création des scripts de monitoring...${NC}"
    
    # Script de health check
    cat > health-check.sh << 'EOF'
#!/bin/bash

# Health check pour Tunisia Jockey Club

URL="${1:-http://localhost:3000}"
TIMEOUT=10

echo "🏥 Health Check - Tunisia Jockey Club"
echo "URL: $URL"
echo "----------------------------------------"

# Test de base
if curl -f -s --max-time $TIMEOUT "$URL" > /dev/null; then
    echo "✅ Application: OK"
else
    echo "❌ Application: ERREUR"
    exit 1
fi

# Test de l'API
if curl -f -s --max-time $TIMEOUT "$URL/api/horses?limit=1" > /dev/null; then
    echo "✅ API: OK"
else
    echo "⚠️  API: Peut-être pas prête"
fi

# Test de la base de données (via l'API)
RESPONSE=$(curl -s --max-time $TIMEOUT "$URL/dashboard-main" | grep -o "chevaux" | wc -l)
if [ $RESPONSE -gt 0 ]; then
    echo "✅ Base de données: OK"
else
    echo "⚠️  Base de données: Vérification recommandée"
fi

echo "✅ Health check terminé"
EOF

    chmod +x health-check.sh

    # Script de monitoring des ressources
    cat > monitor-resources.sh << 'EOF'
#!/bin/bash

# Monitoring des ressources système

echo "📊 Monitoring Ressources - Tunisia Jockey Club"
echo "=============================================="

while true; do
    clear
    echo "📊 $(date)"
    echo "----------------------------------------"
    
    # CPU et mémoire
    echo "💻 Système:"
    top -bn1 | grep "Cpu(s)" | head -1
    free -h | grep "Mem:"
    
    echo ""
    echo "🐳 Docker:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
    
    echo ""
    echo "🌐 Réseau:"
    netstat -tuln | grep :3000 || echo "Port 3000 fermé"
    
    echo ""
    echo "Actualisation dans 10s... (Ctrl+C pour arrêter)"
    sleep 10
done
EOF

    chmod +x monitor-resources.sh
    
    log "${CHECK} Scripts de monitoring créés"
}

# Menu principal
show_menu() {
    echo -e "\n${YELLOW}Choisissez le type de déploiement:${NC}"
    echo "1) 🏠 Déploiement local (Docker Compose)"
    echo "2) ☁️  Préparation déploiement cloud (Kubernetes)"
    echo "3) 📦 Build images Docker seulement"
    echo "4) 🧪 Tests de pré-déploiement"
    echo "5) 📊 Créer scripts de monitoring"
    echo "6) 🚀 Déploiement complet (build + test + deploy local)"
    echo "0) ❌ Annuler"
    
    read -p "Votre choix: " choice
    
    case $choice in
        1)
            check_prerequisites
            build_docker_images
            deploy_local
            create_monitoring_scripts
            ;;
        2)
            check_prerequisites
            build_docker_images push
            deploy_cloud
            ;;
        3)
            check_prerequisites
            build_docker_images
            ;;
        4)
            check_prerequisites
            build_docker_images
            run_deployment_tests
            ;;
        5)
            create_monitoring_scripts
            ;;
        6)
            check_prerequisites
            build_docker_images
            run_deployment_tests
            deploy_local
            create_monitoring_scripts
            ;;
        0)
            log "${YELLOW}Déploiement annulé${NC}"
            exit 0
            ;;
        *)
            log "${ERROR} Choix invalide${NC}"
            show_menu
            ;;
    esac
}

# Vérifier si des arguments sont passés
if [ $# -eq 0 ]; then
    show_menu
else
    case $1 in
        "local")
            check_prerequisites
            build_docker_images
            deploy_local
            ;;
        "cloud")
            check_prerequisites
            build_docker_images push
            deploy_cloud
            ;;
        "build")
            check_prerequisites
            build_docker_images
            ;;
        "test")
            check_prerequisites
            build_docker_images
            run_deployment_tests
            ;;
        *)
            echo -e "${ERROR} Usage: $0 [local|cloud|build|test]${NC}"
            exit 1
            ;;
    esac
fi

log "\n${ROCKET} ${GREEN}Déploiement terminé !${NC}"
log "${CLOUD} ${BLUE}Tunisia Jockey Club est prêt pour la production${NC}"

# Afficher les informations post-déploiement
echo -e "\n${SPARKLES} ${PURPLE}Informations post-déploiement:${NC}"
echo "• Logs: docker-compose logs -f"
echo "• Status: docker-compose ps"  
echo "• Health check: ./health-check.sh"
echo "• Monitoring: ./monitor-resources.sh"
echo "• Arrêter: docker-compose down"
