#!/bin/bash

# Test Simple - Tunisia Jockey Club
# Tests de base pour valider le fonctionnement

echo "🧪 Tests Tunisia Jockey Club"
echo "============================="

BASE_URL="http://localhost:3000"
PASSED=0
TOTAL=0

# Fonction de test
test_endpoint() {
    local url=$1
    local name=$2
    TOTAL=$((TOTAL + 1))
    
    echo -n "Testing $name... "
    
    if curl -f -s --max-time 10 "$url" > /dev/null; then
        echo "✅ OK"
        PASSED=$((PASSED + 1))
    else
        echo "❌ FAILED"
    fi
}

# Tests de base
echo "🔗 Tests de connectivité:"
test_endpoint "$BASE_URL" "Page d'accueil"
test_endpoint "$BASE_URL/dashboard-main" "Dashboard principal"
test_endpoint "$BASE_URL/mobile-dashboard" "Dashboard mobile"

echo ""
echo "📱 Tests des nouvelles pages:"
test_endpoint "$BASE_URL/dashboard/tournaments" "Tournois"
test_endpoint "$BASE_URL/dashboard/analytics" "Analytics"
test_endpoint "$BASE_URL/dashboard/performance" "Performance"
test_endpoint "$BASE_URL/dashboard/customization" "Personnalisation"

echo ""
echo "🔌 Tests d'API:"
test_endpoint "$BASE_URL/api/horses" "API Chevaux"
test_endpoint "$BASE_URL/api/races" "API Courses"

# Résumé
echo ""
echo "📊 Résultats: $PASSED/$TOTAL tests réussis"
if [ $PASSED -eq $TOTAL ]; then
    echo "🚀 Tous les tests passent ! Système opérationnel."
    exit 0
else
    echo "⚠️  Certains tests ont échoué. Vérifiez que le serveur est démarré."
    exit 1
fi
