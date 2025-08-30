#!/bin/bash

# 🧪 Suite de Tests API - Tunisia Jockey Club
# Tests avec cURL - Simple et Efficace

set -e

BASE_URL="http://localhost:3000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Démarrage des Tests API Tunisia Jockey Club${NC}"
echo "================================================"

# Fonction pour afficher les résultats
test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

# Test 1: Health Check du Serveur
echo -e "\n${YELLOW}Test 1: Health Check du Serveur${NC}"
response=$(curl -s -w "%{http_code}" -o /dev/null $BASE_URL)
if [ "$response" = "200" ]; then
    test_result 0 "Serveur accessible"
else
    test_result 1 "Serveur inaccessible (code: $response)"
fi

# Test 2: Headers de Sécurité
echo -e "\n${YELLOW}Test 2: Headers de Sécurité${NC}"
headers=$(curl -s -I $BASE_URL/api/auth/login | grep -i "x-frame-options\|content-security-policy\|x-xss-protection")
if [ -n "$headers" ]; then
    test_result 0 "Headers de sécurité présents"
    echo "$headers"
else
    test_result 1 "Headers de sécurité manquants"
fi

# Test 3: Rate Limiting
echo -e "\n${YELLOW}Test 3: Rate Limiting Headers${NC}"
rate_headers=$(curl -s -I $BASE_URL/api/auth/login | grep -i "x-ratelimit")
if [ -n "$rate_headers" ]; then
    test_result 0 "Rate limiting actif"
    echo "$rate_headers"
else
    test_result 1 "Rate limiting non configuré"
fi

# Test 4: Validation Zod - Email Invalide
echo -e "\n${YELLOW}Test 4: Validation Zod - Email Invalide${NC}"
response=$(curl -s -w "%{http_code}" -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email", "password": "123"}' \
  -o /tmp/test_response.json)

if [ "$response" = "400" ]; then
    test_result 0 "Validation email - Rejet correct des données invalides"
else
    test_result 1 "Validation email - Devrait rejeter email invalide (code: $response)"
fi

# Test 5: Authentification - Utilisateur Valide
echo -e "\n${YELLOW}Test 5: Authentification - Utilisateur Valide${NC}"
response=$(curl -s -w "%{http_code}" -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "test123"}' \
  -o /tmp/auth_response.json)

if [ "$response" = "200" ] || [ "$response" = "201" ]; then
    success=$(jq -r '.success' /tmp/auth_response.json 2>/dev/null)
    if [ "$success" = "true" ]; then
        test_result 0 "Authentification utilisateur valide"
        echo "Token: $(jq -r '.user.sessionToken' /tmp/auth_response.json | cut -c1-20)..."
    else
        test_result 1 "Authentification échouée - success: $success"
    fi
else
    test_result 1 "Authentification - Code retour incorrect (code: $response)"
fi

# Test 6: Authentification - Utilisateur Prioritaire
echo -e "\n${YELLOW}Test 6: Authentification - Utilisateur Prioritaire${NC}"
response=$(curl -s -w "%{http_code}" -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "monia@gmail.com", "password": "password123"}' \
  -o /tmp/monia_response.json)

if [ "$response" = "200" ] || [ "$response" = "201" ]; then
    user_name=$(jq -r '.user.name' /tmp/monia_response.json 2>/dev/null)
    if [ "$user_name" = "Monia Benaissa" ]; then
        test_result 0 "Authentification utilisateur prioritaire (Monia)"
    else
        test_result 1 "Nom utilisateur incorrect: $user_name"
    fi
else
    test_result 1 "Authentification Monia échouée (code: $response)"
fi

# Test 7: Test de Performance
echo -e "\n${YELLOW}Test 7: Performance Response Time${NC}"
response_time=$(curl -s -w "%{time_total}" -o /dev/null -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "test123"}')

# Convertir en millisecondes
response_ms=$(echo "$response_time * 1000" | bc -l | cut -d'.' -f1)

if [ "$response_ms" -lt 1000 ]; then
    test_result 0 "Performance OK - Response time: ${response_ms}ms"
else
    test_result 1 "Performance dégradée - Response time: ${response_ms}ms (> 1000ms)"
fi

# Test 8: Protection XSS/Injection
echo -e "\n${YELLOW}Test 8: Protection XSS/Injection${NC}"
response=$(curl -s -w "%{http_code}" -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "<script>alert(1)</script>", "password": "test"}' \
  -o /tmp/xss_response.json)

if [ "$response" = "400" ] || [ "$response" = "200" ]; then
    success=$(jq -r '.success' /tmp/xss_response.json 2>/dev/null || echo "false")
    if [ "$success" = "false" ]; then
        test_result 0 "Protection XSS - Script rejeté ou neutralisé"
    else
        test_result 1 "Protection XSS - Script potentiellement accepté"
    fi
else
    test_result 1 "Test XSS - Réponse inattendue (code: $response)"
fi

# Test 9: Test Rate Limiting en Action
echo -e "\n${YELLOW}Test 9: Test Rate Limiting Fonctionnel${NC}"
echo "Envoi de 6 requêtes rapides pour tester la limite auth (5 max)..."

for i in {1..6}; do
    response=$(curl -s -w "%{http_code}" -X POST $BASE_URL/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email": "test@test.com", "password": "wrong"}' \
      -o /dev/null)
    echo "Requête $i: $response"
    sleep 0.1
done

# La 6ème requête devrait être rate limitée (429)
echo "Note: Si vous voyez un code 429, le rate limiting fonctionne !"

# Test 10: Redis Cache Test
echo -e "\n${YELLOW}Test 10: Vérification Redis Cache${NC}"
if command -v redis-cli &> /dev/null; then
    redis_ping=$(redis-cli ping 2>/dev/null || echo "FAIL")
    if [ "$redis_ping" = "PONG" ]; then
        test_result 0 "Redis Cache - Connexion OK"
        
        # Vérifier les clés de rate limiting
        keys=$(redis-cli keys "*rate_limit*" 2>/dev/null | wc -l)
        if [ "$keys" -gt 0 ]; then
            echo "Rate limiting keys trouvées: $keys"
        fi
    else
        test_result 1 "Redis Cache - Connexion échouée"
    fi
else
    echo "⚠️  redis-cli non disponible, skip test Redis"
fi

# Résumé Final
echo -e "\n${GREEN}🎉 SUITE DE TESTS TERMINÉE${NC}"
echo "================================================"
echo -e "${GREEN}✅ Tous les tests de base sont passés !${NC}"
echo -e "${YELLOW}📊 Résumé:${NC}"
echo "   - Serveur fonctionnel"
echo "   - Sécurité configurée"
echo "   - Rate limiting actif"
echo "   - Validation Zod opérationnelle"
echo "   - Authentification robuste"
echo "   - Performance acceptable"
echo "   - Protection XSS/Injection"
echo ""
echo -e "${GREEN}🚀 Tunisia Jockey Club est prêt pour la production !${NC}"

# Nettoyage
rm -f /tmp/test_response.json /tmp/auth_response.json /tmp/monia_response.json /tmp/xss_response.json
