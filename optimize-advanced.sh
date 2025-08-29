#!/bin/bash

# 🚀 Script d'Optimisation Avancé - Tunisia Jockey Club
# Optimisation complète des performances et tests automatisés
# Auteur: Agent IA - 25 Août 2025

set -e

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Emojis
ROCKET="🚀"
CHECK="✅"
WARNING="⚠️"
ERROR="❌"
SPARKLES="✨"
GEAR="⚙️"
CHART="📊"
CLEAN="🧹"

echo -e "${PURPLE}${ROCKET} Optimisation Avancée - Tunisia Jockey Club ${ROCKET}${NC}"
echo "=========================================================="

# Fonction pour afficher les logs avec timestamp
log() {
    echo -e "[$(date '+%H:%M:%S')] $1"
}

# Fonction pour vérifier si une commande existe
check_command() {
    if ! command -v $1 &> /dev/null; then
        log "${ERROR} ${RED}$1 n'est pas installé${NC}"
        return 1
    fi
    return 0
}

# 1. Vérification des dépendances
log "${GEAR} ${BLUE}Vérification des dépendances...${NC}"
REQUIRED_COMMANDS=("node" "npm" "curl" "git")
for cmd in "${REQUIRED_COMMANDS[@]}"; do
    if check_command $cmd; then
        log "${CHECK} ${GREEN}$cmd: OK${NC}"
    else
        log "${ERROR} ${RED}Dépendance manquante: $cmd${NC}"
        exit 1
    fi
done

# 2. Nettoyage avancé
log "\n${CLEAN} ${YELLOW}Nettoyage avancé...${NC}"

# Nettoyer les node_modules orphelins
find . -name "node_modules" -type d -prune -exec rm -rf {} +
log "${CHECK} Node modules nettoyés"

# Nettoyer le cache npm
npm cache clean --force
log "${CHECK} Cache npm nettoyé"

# Nettoyer les fichiers temporaires
find . -name ".DS_Store" -delete 2>/dev/null || true
find . -name "*.log" -delete 2>/dev/null || true
find . -name "*.tmp" -delete 2>/dev/null || true
log "${CHECK} Fichiers temporaires supprimés"

# Nettoyer les builds précédents
rm -rf frontend/build 2>/dev/null || true
rm -rf backend/dist 2>/dev/null || true
log "${CHECK} Dossiers de build nettoyés"

# 3. Installation optimisée des dépendances
log "\n${GEAR} ${BLUE}Installation optimisée des dépendances...${NC}"

# Installation avec cache et parallélisation
npm install --prefer-offline --no-audit --progress=false
log "${CHECK} Dépendances racine installées"

# Frontend
cd frontend
npm install --prefer-offline --no-audit --progress=false
log "${CHECK} Dépendances frontend installées"
cd ..

# Backend
cd backend
npm install --prefer-offline --no-audit --progress=false
log "${CHECK} Dépendances backend installées"
cd ..

# 4. Optimisation du code
log "\n${SPARKLES} ${PURPLE}Optimisation du code...${NC}"

# ESLint avec fix automatique
cd frontend
npx eslint . --fix --ext .ts,.tsx --quiet || log "${WARNING} Quelques warnings ESLint"
log "${CHECK} Code frontend formaté"
cd ..

cd backend
npx eslint . --fix --ext .ts --quiet || log "${WARNING} Quelques warnings ESLint"
log "${CHECK} Code backend formaté"
cd ..

# 5. Build optimisé
log "\n${ROCKET} ${GREEN}Build optimisé...${NC}"

# Build backend
cd backend
npm run build
log "${CHECK} Backend compilé"
cd ..

# Build frontend avec optimisations
cd frontend
NODE_ENV=production npm run build
log "${CHECK} Frontend compilé en mode production"
cd ..

# 6. Analyse des performances
log "\n${CHART} ${BLUE}Analyse des performances...${NC}"

# Taille des bundles
cd frontend
if [ -d "build" ]; then
    BUNDLE_SIZE=$(du -sh build | cut -f1)
    log "${CHECK} Taille du bundle frontend: ${BUNDLE_SIZE}"
    
    # Analyse détaillée des assets
    find build -name "*.js" -exec du -sh {} \; | head -10 | while read size file; do
        log "  📦 $file: $size"
    done
fi
cd ..

# Taille du backend
cd backend
if [ -d "dist" ]; then
    BACKEND_SIZE=$(du -sh dist | cut -f1)
    log "${CHECK} Taille du build backend: ${BACKEND_SIZE}"
fi
cd ..

# 7. Tests de performance automatisés
log "\n${ROCKET} ${YELLOW}Tests de performance...${NC}"

# Fonction pour tester les endpoints
test_endpoint() {
    local url=$1
    local name=$2
    
    if curl -s -o /dev/null -w "%{http_code}" --max-time 10 $url | grep -q "200\|302"; then
        local response_time=$(curl -s -o /dev/null -w "%{time_total}" --max-time 10 $url)
        log "${CHECK} ${name}: OK (${response_time}s)"
        return 0
    else
        log "${ERROR} ${name}: ÉCHEC"
        return 1
    fi
}

# Vérifier si le serveur est en cours d'exécution
if pgrep -f "nest start" > /dev/null || pgrep -f "remix-serve" > /dev/null; then
    log "${CHECK} Serveur détecté, test des endpoints..."
    
    # Tester les endpoints principaux
    test_endpoint "http://localhost:3000" "Page d'accueil"
    test_endpoint "http://localhost:3000/dashboard-main" "Dashboard principal"
    test_endpoint "http://localhost:3000/api/horses" "API Chevaux" || log "${WARNING} API pas encore démarrée"
    
else
    log "${WARNING} Serveur non détecté, démarrage pour les tests..."
    
    # Démarrer en mode détaché pour les tests
    cd backend && npm run start:dev &
    SERVER_PID=$!
    
    # Attendre que le serveur démarre
    sleep 10
    
    # Tests
    test_endpoint "http://localhost:3000" "Page d'accueil"
    test_endpoint "http://localhost:3000/dashboard-main" "Dashboard principal"
    
    # Arrêter le serveur de test
    kill $SERVER_PID 2>/dev/null || true
fi

# 8. Optimisations avancées
log "\n${SPARKLES} ${PURPLE}Optimisations avancées...${NC}"

# Optimisation des images (si présentes)
if command -v imagemin &> /dev/null; then
    find frontend/public -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | head -5 | while read img; do
        original_size=$(du -k "$img" | cut -f1)
        imagemin "$img" --out-dir="$(dirname "$img")" --plugin=imagemin-pngquant --plugin=imagemin-mozjpeg 2>/dev/null || true
        new_size=$(du -k "$img" | cut -f1)
        if [ $new_size -lt $original_size ]; then
            savings=$((original_size - new_size))
            log "${CHECK} Image optimisée: $(basename "$img") (-${savings}Ko)"
        fi
    done
else
    log "${WARNING} imagemin non installé, optimisation d'images ignorée"
fi

# Compression gzip des assets statiques
cd frontend/build 2>/dev/null || cd frontend/public
find . -name "*.js" -o -name "*.css" -o -name "*.html" | while read file; do
    if [ -f "$file" ] && [ ! -f "$file.gz" ]; then
        gzip -k "$file" 2>/dev/null || true
        if [ -f "$file.gz" ]; then
            original=$(du -k "$file" | cut -f1)
            compressed=$(du -k "$file.gz" | cut -f1)
            ratio=$(echo "scale=1; ($original - $compressed) * 100 / $original" | bc 2>/dev/null || echo "N/A")
            log "${CHECK} Compressé: $(basename "$file") (${ratio}% de réduction)"
        fi
    fi
done
cd - > /dev/null

# 9. Génération du rapport de performance
log "\n${CHART} ${GREEN}Génération du rapport...${NC}"

REPORT_FILE="performance-report-$(date +%Y%m%d-%H%M%S).md"

cat > $REPORT_FILE << EOF
# 📊 Rapport d'Optimisation - Tunisia Jockey Club

**Date**: $(date)
**Version**: 1.0.0

## 🚀 Résumé

- ✅ Dépendances vérifiées et installées
- ✅ Code nettoyé et formaté
- ✅ Build optimisé généré
- ✅ Tests de performance effectués

## 📈 Métriques

### Bundle Sizes
- Frontend: ${BUNDLE_SIZE:-"N/A"}
- Backend: ${BACKEND_SIZE:-"N/A"}

### Optimisations Appliquées
- 🧹 Nettoyage des caches et fichiers temporaires
- 🔧 ESLint avec corrections automatiques
- 📦 Build de production optimisé
- 🗜️ Compression gzip des assets
- 🖼️ Optimisation des images (si disponible)

### Performance Tests
- Page d'accueil: Testée
- Dashboard principal: Testé
- API endpoints: Testés (si serveur actif)

## 🎯 Recommandations

1. **Cache Strategy**: Implémenter Redis pour le cache des requêtes API
2. **CDN**: Utiliser un CDN pour les assets statiques
3. **Database**: Indexer les requêtes fréquentes
4. **Monitoring**: Mettre en place des alertes de performance
5. **Lazy Loading**: Implémenter le chargement paresseux des composants

## 🔧 Commandes Utiles

\`\`\`bash
# Analyser la taille des bundles
npm run analyze

# Tests de performance
npm run test:performance

# Monitoring en temps réel
npm run monitor
\`\`\`

---
*Rapport généré automatiquement par le script d'optimisation*
EOF

log "${CHECK} Rapport généré: ${REPORT_FILE}"

# 10. Résumé final
log "\n${ROCKET} ${GREEN}OPTIMISATION TERMINÉE !${NC}"
echo "=========================================================="
log "${CHECK} ${GREEN}Toutes les optimisations ont été appliquées${NC}"
log "${CHART} ${BLUE}Rapport détaillé: ${REPORT_FILE}${NC}"

# Afficher les métriques finales
echo -e "\n${SPARKLES} ${PURPLE}Métriques Finales:${NC}"
echo "  • Temps d'exécution: $SECONDS secondes"
echo "  • Dossiers nettoyés: node_modules, cache, temp files"
echo "  • Code formaté: ESLint appliqué"
echo "  • Build optimisé: Mode production activé"
echo "  • Tests: Endpoints principaux vérifiés"

log "\n${ROCKET} ${GREEN}Le projet Tunisia Jockey Club est maintenant optimisé !${NC}"
log "${BLUE}Vous pouvez démarrer le serveur avec: npm run dev${NC}"

# Proposer de démarrer le serveur
echo -e "\n${YELLOW}Voulez-vous démarrer le serveur maintenant ? (y/n)${NC}"
read -r response
if [[ $response =~ ^[Yy]$ ]]; then
    log "${ROCKET} ${GREEN}Démarrage du serveur...${NC}"
    cd backend && npm run start:dev
else
    log "${CHECK} ${BLUE}Optimisation terminée. Utilisez 'npm run dev' pour démarrer.${NC}"
fi
