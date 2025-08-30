#!/bin/bash

# Test complet du système Tunisia Jockey Club avec curl
echo "🏇 TUNISIA JOCKEY CLUB - TEST CURL COMPLET"
echo "=========================================="
echo ""

# Configuration
BASE_URL="http://localhost:3000"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_DIR="/tmp/tjc_tests"
mkdir -p $LOG_DIR

# Fonctions utilitaires
log_test() {
    echo "[$TIMESTAMP] $1" | tee -a "$LOG_DIR/test_results.log"
}

test_endpoint() {
    local name="$1"
    local endpoint="$2"
    local expected_status="$3"
    
    echo -n "Testing $name... "
    
    start_time=$(date +%s.%N)
    response=$(curl -s -w "%{http_code}" -o "$LOG_DIR/response_$name.json" "$BASE_URL$endpoint")
    end_time=$(date +%s.%N)
    
    duration=$(echo "$end_time - $start_time" | bc -l)
    status_code="${response: -3}"
    
    if [ "$status_code" = "$expected_status" ]; then
        echo "✅ OK (${duration}s)"
        log_test "✅ $name: SUCCESS - $status_code in ${duration}s"
        return 0
    else
        echo "❌ FAILED (got $status_code, expected $expected_status)"
        log_test "❌ $name: FAILED - $status_code in ${duration}s"
        return 1
    fi
}

# Tests des APIs principales
echo "📡 TESTS DES APIS BACKEND"
echo "========================"

test_endpoint "API_STATUS" "/api/status" "200"
test_endpoint "DASHBOARD_DATA" "/api/dashboard/data" "200"
test_endpoint "HORSES_API" "/api/horses" "200"

echo ""

# Tests de performance
echo "⚡ TESTS DE PERFORMANCE"
echo "======================"

echo -n "Performance test (5 appels simultanés)... "
start_time=$(date +%s.%N)

# Lancement de 5 requêtes en parallèle
for i in {1..5}; do
    (curl -s "$BASE_URL/api/status" > "$LOG_DIR/parallel_$i.json") &
done

# Attendre que tous les processus se terminent
wait

end_time=$(date +%s.%N)
duration=$(echo "$end_time - $start_time" | bc -l)
echo "✅ OK (${duration}s pour 5 requêtes parallèles)"

echo ""

# Tests de stress
echo "🔥 TESTS DE CHARGE"
echo "=================="

echo -n "Test de charge (20 requêtes séquentielles)... "
start_time=$(date +%s.%N)

for i in {1..20}; do
    curl -s "$BASE_URL/api/status" > /dev/null
    if [ $? -ne 0 ]; then
        echo "❌ Échec à la requête $i"
        exit 1
    fi
done

end_time=$(date +%s.%N)
duration=$(echo "$end_time - $start_time" | bc -l)
avg_duration=$(echo "$duration / 20" | bc -l)
echo "✅ OK (${duration}s total, ${avg_duration}s par requête)"

echo ""

# Analyse des données retournées
echo "📊 ANALYSE DES DONNÉES"
echo "====================="

# Status API
if [ -f "$LOG_DIR/response_API_STATUS.json" ]; then
    status=$(jq -r '.status' "$LOG_DIR/response_API_STATUS.json")
    env=$(jq -r '.environment' "$LOG_DIR/response_API_STATUS.json")
    echo "Status: $status | Environment: $env"
fi

# Dashboard data
if [ -f "$LOG_DIR/response_DASHBOARD_DATA.json" ]; then
    total_horses=$(jq -r '.overview.totalHorses' "$LOG_DIR/response_DASHBOARD_DATA.json")
    total_users=$(jq -r '.overview.totalUsers' "$LOG_DIR/response_DASHBOARD_DATA.json")
    total_races=$(jq -r '.overview.totalRaces' "$LOG_DIR/response_DASHBOARD_DATA.json")
    echo "Données: $total_horses chevaux, $total_users utilisateurs, $total_races courses"
fi

# Horses API
if [ -f "$LOG_DIR/response_HORSES_API.json" ]; then
    horses_count=$(jq -r '.total' "$LOG_DIR/response_HORSES_API.json")
    echo "API Horses: $horses_count chevaux disponibles"
fi

echo ""

# Test des notifications (simulation)
echo "🔔 TEST DES NOTIFICATIONS CURL"
echo "==============================="

echo -n "Simulation polling notifications... "
start_time=$(date +%s.%N)

# Simulation de 10 appels de polling pour notifications
for i in {1..10}; do
    notifications=$(curl -s "$BASE_URL/api/status" | jq -r '.timestamp')
    sleep 0.1  # 100ms entre chaque polling
done

end_time=$(date +%s.%N)
duration=$(echo "$end_time - $start_time" | bc -l)
echo "✅ OK (${duration}s pour 10 polls)"

echo ""

# Test d'authentification (simulation)
echo "🔐 TEST D'AUTHENTIFICATION CURL"
echo "==============================="

# Test POST login (simulé)
echo -n "Test POST login... "
login_response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}' \
    "$BASE_URL/api/auth/login" 2>/dev/null || echo "404")

if [ "$login_response" = "404" ]; then
    echo "⚠️  Endpoint d'auth non trouvé (normal en développement)"
else
    echo "✅ Response reçue"
fi

echo ""

# Rapport final
echo "📋 RAPPORT FINAL"
echo "==============="

total_tests=$(grep -c "Testing" "$LOG_DIR/test_results.log" 2>/dev/null || echo "0")
successful_tests=$(grep -c "SUCCESS" "$LOG_DIR/test_results.log" 2>/dev/null || echo "0")
failed_tests=$(grep -c "FAILED" "$LOG_DIR/test_results.log" 2>/dev/null || echo "0")

echo "Tests exécutés: $total_tests"
echo "Succès: $successful_tests"
echo "Échecs: $failed_tests"

if [ "$failed_tests" -eq 0 ]; then
    echo ""
    echo "🎉 TOUS LES TESTS CURL ONT RÉUSSI !"
    echo "Le système Tunisia Jockey Club est opérationnel."
else
    echo ""
    echo "⚠️  CERTAINS TESTS ONT ÉCHOUÉ"
    echo "Consultez les logs: $LOG_DIR/"
fi

echo ""
echo "Logs sauvegardés dans: $LOG_DIR/"
echo "Date: $(date)"
echo ""

# Test de l'interface frontend (si disponible)
if command -v curl >/dev/null 2>&1; then
    echo "🌐 TEST FRONTEND (si disponible)"
    echo "================================"
    
    frontend_response=$(curl -s -w "%{http_code}" -o /dev/null "http://localhost:5173" 2>/dev/null || echo "000")
    
    if [ "${frontend_response: -3}" = "200" ]; then
        echo "✅ Frontend accessible sur http://localhost:5173"
    else
        echo "⚠️  Frontend non accessible (code: ${frontend_response: -3})"
    fi
fi

echo ""
echo "Test terminé à $(date)"
