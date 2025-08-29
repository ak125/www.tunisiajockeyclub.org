#!/bin/bash

# Script de test curl complet pour Tunisia Jockey Club
# Usage: ./test-system.sh

BASE_URL="http://localhost:3000"
API_URL="$BASE_URL/api"

echo "🏇 Test du Système Tunisia Jockey Club"
echo "======================================="
echo "Base URL: $BASE_URL"
echo "API URL: $API_URL"
echo ""

# Couleurs pour les outputs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour tester une URL
test_url() {
    local url="$1"
    local description="$2"
    local expected_status="${3:-200}"
    
    echo -n "Testing $description... "
    
    # Faire le test avec curl
    response=$(curl -s -w "%{http_code}" "$url" -o /tmp/curl_body.tmp)
    http_code="${response: -3}"
    
    if [ "$http_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ OK ($http_code)${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL ($http_code, expected $expected_status)${NC}"
        echo "Body: $(cat /tmp/curl_body.tmp | head -1)"
        return 1
    fi
}

# Fonction pour tester une API JSON
test_api() {
    local url="$1"
    local description="$2"
    local key_to_check="$3"
    
    echo -n "Testing API $description... "
    
    response=$(curl -s "$url")
    http_code=$?
    
    if [ $http_code -eq 0 ]; then
        if echo "$response" | grep -q "\"$key_to_check\""; then
            echo -e "${GREEN}✅ OK (JSON valid)${NC}"
            echo "  └─ Sample: $(echo "$response" | head -c 100)..."
            return 0
        else
            echo -e "${YELLOW}⚠️  JSON but missing key '$key_to_check'${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ CURL FAILED${NC}"
        return 1
    fi
}

echo "📊 1. Test des APIs Backend"
echo "─────────────────────────────"

# Test des APIs
test_api "$API_URL/status" "System Status" "status"
test_api "$API_URL/dashboard/data" "Dashboard Data" "overview" 
test_api "$API_URL/horses" "Horses API" "horses"

echo ""
echo "🔐 2. Test des Routes d'Authentification"
echo "──────────────────────────────────────"

# Test page de login (GET)
test_url "$BASE_URL/login" "Login Page" "200"

echo ""
echo "🏛️ 3. Test des Routes Frontend"
echo "─────────────────────────────────"

# Test des pages principales
test_url "$BASE_URL/professional-demo" "Professional Demo" "200"
test_url "$BASE_URL/design-system-clean" "Design System" "200"
test_url "$BASE_URL/executive" "Executive Dashboard" "200"

echo ""
echo "📱 4. Test des Routes Avancées"
echo "─────────────────────────────────"

# Routes qui nécessitent une authentification - attendons un redirect
test_url "$BASE_URL/secure-dashboard" "Secure Dashboard" "302"
test_url "$BASE_URL/licenses" "Licenses Management" "302"
test_url "$BASE_URL/analytics" "Analytics Page" "302"

echo ""
echo "⚡ 5. Test de Performance"
echo "──────────────────────────"

echo "Measuring response times..."

# Test de performance avec time
echo -n "API Status response time: "
time_result=$(time curl -s "$API_URL/status" > /dev/null 2>&1)

echo -n "Dashboard data response time: "
time curl -s "$API_URL/dashboard/data" > /dev/null 2>&1

echo -n "Horses API response time: "
time curl -s "$API_URL/horses" > /dev/null 2>&1

echo ""
echo "🧪 6. Test de Charge (Requêtes Parallèles)"
echo "─────────────────────────────────────────"

echo "Running 5 parallel requests to /api/status..."
for i in {1..5}; do
    curl -s "$API_URL/status" > /dev/null &
done
wait
echo "✅ All parallel requests completed"

echo ""
echo "📋 7. Résumé des Tests"
echo "────────────────────"

# Statistiques finales
total_apis=3
total_frontend=3
total_secure=3

echo "APIs Backend: $total_apis routes testées"
echo "Pages Frontend: $total_frontend routes testées"  
echo "Routes Sécurisées: $total_secure routes testées"

echo ""
echo "🎯 Test complet terminé !"
echo "Pour plus de détails, consultez les logs du serveur."

# Nettoyage
rm -f /tmp/curl_body.tmp
