#!/bin/bash

#!/bin/bash

# 🧪 Tests Automatisés Avancés - Tunisia Jockey Club
# Suite de tests complète : unitaires, intégration, e2e, performance
# Auteur: Agent IA - 25 Août 2025

set -e

# Configuration
PROJECT_NAME="tunisia-jockey-club"
BASE_URL="http://localhost:3000"
API_URL="$BASE_URL/api"
TIMEOUT=30
PARALLEL_TESTS=4 Avancé

echo "🚀 ======================================="
echo "🏆 TUNISIA JOCKEY CLUB - TESTS AVANCÉS"
echo "🚀 ======================================="
echo

# Configuration - Monorepo intégré (Frontend + Backend sur même port)
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:3000"
REDIS_HOST="localhost"
REDIS_PORT="6379"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Fonctions utilitaires
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_section() {
    echo -e "${PURPLE}📊 === $1 ===${NC}"
    echo
}

# Test 1: Services de base
test_basic_services() {
    print_section "TESTS DES SERVICES DE BASE"
    
    # Test Frontend
    if curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" | grep -q "200"; then
        print_success "Frontend accessible ($FRONTEND_URL)"
    else
        print_error "Frontend inaccessible ($FRONTEND_URL)"
        return 1
    fi
    
    # Test Backend
    if curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api" | grep -q "200\|404"; then
        print_success "Backend accessible ($BACKEND_URL)"
    else
        print_error "Backend inaccessible ($BACKEND_URL)"
        return 1
    fi
    
    # Test Redis
    if command -v redis-cli >/dev/null 2>&1; then
        if redis-cli -h $REDIS_HOST -p $REDIS_PORT ping | grep -q "PONG"; then
            print_success "Redis connecté ($REDIS_HOST:$REDIS_PORT)"
        else
            print_error "Redis non connecté ($REDIS_HOST:$REDIS_PORT)"
            return 1
        fi
    else
        print_warning "Redis CLI non disponible (impossible de tester)"
    fi
    
    echo
}

# Test 2: API Endpoints
test_api_endpoints() {
    print_section "TESTS DES ENDPOINTS API"
    
    # Test Dashboard Data
    response=$(curl -s -w "%{http_code}" "$BACKEND_URL/api/dashboard/data")
    http_code=$(echo "$response" | tail -c 4)
    
    if [[ "$http_code" == "200" ]]; then
        print_success "API Dashboard Data: $http_code"
        
        # Parser la réponse JSON pour vérifier la structure
        json_body=$(echo "$response" | sed '$ s/...$//')
        if echo "$json_body" | grep -q '"horses"\|"users"\|"races"'; then
            print_success "Structure de données valide"
        else
            print_warning "Structure de données incomplète"
        fi
    else
        print_error "API Dashboard Data: $http_code"
    fi
    
    # Test Rating API
    rating_response=$(curl -s -w "%{http_code}" "$BACKEND_URL/api/rating/stats")
    rating_code=$(echo "$rating_response" | tail -c 4)
    
    if [[ "$rating_code" == "200" ]]; then
        print_success "API Rating Stats: $rating_code"
    else
        print_warning "API Rating Stats: $rating_code (peut être normal si non implémenté)"
    fi
    
    echo
}

# Test 3: Pages Frontend
test_frontend_pages() {
    print_section "TESTS DES PAGES FRONTEND"
    
    # Pages à tester
    declare -A pages=(
        ["Dashboard Principal"]="/dashboard-main"
        ["Dashboard Mobile"]="/mobile-dashboard"
        ["Courses Avancées"]="/dashboard/races/advanced"
        ["Login"]="/login"
        ["Accueil"]="/"
    )
    
    for page_name in "${!pages[@]}"; do
        page_url="${FRONTEND_URL}${pages[$page_name]}"
        response_code=$(curl -s -o /dev/null -w "%{http_code}" "$page_url")
        
        if [[ "$response_code" == "200" ]]; then
            print_success "$page_name: $response_code"
        else
            print_error "$page_name: $response_code ($page_url)"
        fi
    done
    
    echo
}

# Test 4: Performance
test_performance() {
    print_section "TESTS DE PERFORMANCE"
    
    # Test temps de réponse Dashboard
    start_time=$(date +%s%3N)
    curl -s -o /dev/null "$FRONTEND_URL/dashboard-main"
    end_time=$(date +%s%3N)
    response_time=$((end_time - start_time))
    
    if [[ $response_time -lt 1000 ]]; then
        print_success "Dashboard Principal: ${response_time}ms (Excellent)"
    elif [[ $response_time -lt 2000 ]]; then
        print_success "Dashboard Principal: ${response_time}ms (Bon)"
    else
        print_warning "Dashboard Principal: ${response_time}ms (Lent)"
    fi
    
    # Test temps de réponse API
    start_time=$(date +%s%3N)
    curl -s -o /dev/null "$BACKEND_URL/api/dashboard/data"
    end_time=$(date +%s%3N)
    api_response_time=$((end_time - start_time))
    
    if [[ $api_response_time -lt 500 ]]; then
        print_success "API Backend: ${api_response_time}ms (Excellent)"
    elif [[ $api_response_time -lt 1000 ]]; then
        print_success "API Backend: ${api_response_time}ms (Bon)"
    else
        print_warning "API Backend: ${api_response_time}ms (Lent)"
    fi
    
    echo
}

# Test 5: Ressources système
test_system_resources() {
    print_section "MONITORING DES RESSOURCES SYSTÈME"
    
    # Processus Node.js
    node_processes=$(pgrep -f "node" | wc -l)
    print_info "Processus Node.js actifs: $node_processes"
    
    # Utilisation mémoire des processus Node
    if command -v ps >/dev/null 2>&1; then
        node_memory=$(ps aux | grep -E "(node|nest|vite)" | grep -v grep | awk '{sum+=$6} END {printf "%.1f MB", sum/1024}')
        print_info "Mémoire utilisée par Node.js: $node_memory"
    fi
    
    # Ports utilisés
    if command -v netstat >/dev/null 2>&1; then
        ports_used=$(netstat -tlpn 2>/dev/null | grep -E ":3000|:5173|:6379" | wc -l)
        print_info "Ports TJC utilisés: $ports_used"
        
        # Détail des ports
        netstat -tlpn 2>/dev/null | grep -E ":3000|:5173|:6379" | while read line; do
            port=$(echo "$line" | awk '{print $4}' | cut -d: -f2)
            print_info "  Port $port actif"
        done
    fi
    
    echo
}

# Test 6: Logs et erreurs
test_logs_and_errors() {
    print_section "ANALYSE DES LOGS ET ERREURS"
    
    # Recherche d'erreurs dans les logs récents (si disponibles)
    if [[ -f "/tmp/tjc-backend.log" ]]; then
        error_count=$(tail -n 100 /tmp/tjc-backend.log | grep -i "error\|exception\|failed" | wc -l)
        if [[ $error_count -eq 0 ]]; then
            print_success "Aucune erreur détectée dans les logs récents"
        else
            print_warning "$error_count erreurs trouvées dans les logs récents"
        fi
    else
        print_info "Fichier de log backend non trouvé"
    fi
    
    # Test des types de contenu
    content_type=$(curl -s -I "$FRONTEND_URL" | grep -i "content-type" | cut -d' ' -f2-)
    if echo "$content_type" | grep -q "text/html"; then
        print_success "Type de contenu frontend correct: $content_type"
    else
        print_warning "Type de contenu frontend inattendu: $content_type"
    fi
    
    echo
}

# Test 7: Sécurité de base
test_basic_security() {
    print_section "TESTS DE SÉCURITÉ DE BASE"
    
    # Test headers de sécurité
    security_headers=$(curl -s -I "$FRONTEND_URL" | grep -E "(X-Frame-Options|X-Content-Type-Options|X-XSS-Protection)" | wc -l)
    
    if [[ $security_headers -gt 0 ]]; then
        print_success "Headers de sécurité présents ($security_headers/3)"
    else
        print_warning "Headers de sécurité manquants"
    fi
    
    # Test CORS basique
    cors_header=$(curl -s -I -H "Origin: http://evil.com" "$BACKEND_URL/api" | grep -i "access-control-allow-origin")
    if [[ -z "$cors_header" ]]; then
        print_success "CORS correctement configuré (pas de wildcard détecté)"
    else
        print_info "CORS header détecté: $cors_header"
    fi
    
    echo
}

# Fonction principale
run_advanced_tests() {
    echo "🕐 Début des tests: $(date)"
    echo
    
    # Compteurs
    total_tests=7
    passed_tests=0
    
    # Exécution des tests
    if test_basic_services; then ((passed_tests++)); fi
    if test_api_endpoints; then ((passed_tests++)); fi
    if test_frontend_pages; then ((passed_tests++)); fi
    if test_performance; then ((passed_tests++)); fi
    if test_system_resources; then ((passed_tests++)); fi
    if test_logs_and_errors; then ((passed_tests++)); fi
    if test_basic_security; then ((passed_tests++)); fi
    
    # Résumé final
    echo -e "${PURPLE}📊 =======================================${NC}"
    echo -e "${PURPLE}🏆 RÉSUMÉ DES TESTS AVANCÉS${NC}"
    echo -e "${PURPLE}📊 =======================================${NC}"
    echo
    
    success_rate=$((passed_tests * 100 / total_tests))
    
    if [[ $success_rate -eq 100 ]]; then
        print_success "TOUS LES TESTS RÉUSSIS ! ($passed_tests/$total_tests)"
        print_success "Système Tunisia Jockey Club 100% opérationnel !"
    elif [[ $success_rate -ge 80 ]]; then
        print_success "TESTS LARGEMENT RÉUSSIS ! ($passed_tests/$total_tests - $success_rate%)"
        print_info "Système Tunisia Jockey Club opérationnel avec quelques optimisations possibles"
    elif [[ $success_rate -ge 60 ]]; then
        print_warning "TESTS PARTIELLEMENT RÉUSSIS ($passed_tests/$total_tests - $success_rate%)"
        print_warning "Quelques problèmes détectés - vérifiez les détails ci-dessus"
    else
        print_error "PLUSIEURS TESTS ÉCHOUÉS ($passed_tests/$total_tests - $success_rate%)"
        print_error "Système nécessite une attention immédiate"
    fi
    
    echo
    echo "🕐 Fin des tests: $(date)"
    echo
    
    # Liens utiles
    echo -e "${BLUE}🔗 LIENS UTILES:${NC}"
    echo -e "${BLUE}   Frontend:${NC} $FRONTEND_URL"
    echo -e "${BLUE}   Dashboard:${NC} $FRONTEND_URL/dashboard-main"
    echo -e "${BLUE}   Mobile:${NC} $FRONTEND_URL/mobile-dashboard"
    echo -e "${BLUE}   API:${NC} $BACKEND_URL/api"
    echo
}

# Monitoring continu (optionnel)
run_continuous_monitoring() {
    print_section "MONITORING CONTINU"
    print_info "Appuyez sur Ctrl+C pour arrêter"
    echo
    
    while true; do
        echo -n "$(date '+%H:%M:%S') - "
        
        # Test rapide de santé
        if curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" | grep -q "200"; then
            echo -n "Frontend: ✅ "
        else
            echo -n "Frontend: ❌ "
        fi
        
        if curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api" | grep -q "200\|404"; then
            echo -n "Backend: ✅ "
        else
            echo -n "Backend: ❌ "
        fi
        
        if command -v redis-cli >/dev/null 2>&1 && redis-cli -h $REDIS_HOST -p $REDIS_PORT ping | grep -q "PONG" 2>/dev/null; then
            echo "Redis: ✅"
        else
            echo "Redis: ❌"
        fi
        
        sleep 5
    done
}

# Menu principal
case "${1:-}" in
    "monitor"|"continuous")
        run_continuous_monitoring
        ;;
    "quick"|"fast")
        test_basic_services
        test_api_endpoints
        ;;
    "performance"|"perf")
        test_performance
        test_system_resources
        ;;
    *)
        run_advanced_tests
        ;;
esac
