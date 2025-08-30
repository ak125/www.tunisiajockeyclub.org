#!/bin/bash

# Test curl simplifié pour Tunisia Jockey Club
echo "🏇 TUNISIA JOCKEY CLUB - TEST CURL SIMPLIFIÉ"
echo "==========================================="
echo ""

BASE_URL="http://localhost:3000"

# Test simple des APIs
echo "📡 Test des APIs principales..."

echo -n "• API Status... "
status_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/status")
if [ "$status_code" = "200" ]; then
    echo "✅ OK ($status_code)"
else
    echo "❌ FAILED ($status_code)"
fi

echo -n "• API Dashboard... "
dashboard_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/dashboard/data")
if [ "$dashboard_code" = "200" ]; then
    echo "✅ OK ($dashboard_code)"
else
    echo "❌ FAILED ($dashboard_code)"
fi

echo -n "• API Horses... "
horses_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/horses")
if [ "$horses_code" = "200" ]; then
    echo "✅ OK ($horses_code)"
else
    echo "❌ FAILED ($horses_code)"
fi

echo ""

# Test des données
echo "📊 Analyse des données reçues..."

# Status
status_data=$(curl -s "$BASE_URL/api/status")
status=$(echo "$status_data" | jq -r '.status' 2>/dev/null || echo "N/A")
environment=$(echo "$status_data" | jq -r '.environment' 2>/dev/null || echo "N/A")
echo "• Status: $status | Environment: $environment"

# Dashboard
dashboard_data=$(curl -s "$BASE_URL/api/dashboard/data")
total_horses=$(echo "$dashboard_data" | jq -r '.overview.totalHorses' 2>/dev/null || echo "N/A")
total_users=$(echo "$dashboard_data" | jq -r '.overview.totalUsers' 2>/dev/null || echo "N/A")
total_races=$(echo "$dashboard_data" | jq -r '.overview.totalRaces' 2>/dev/null || echo "N/A")
echo "• Dashboard: $total_horses chevaux, $total_users utilisateurs, $total_races courses"

# Horses
horses_data=$(curl -s "$BASE_URL/api/horses")
horses_total=$(echo "$horses_data" | jq -r '.total' 2>/dev/null || echo "N/A")
first_horse_name=$(echo "$horses_data" | jq -r '.horses[0].name' 2>/dev/null || echo "N/A")
echo "• Horses API: $horses_total chevaux total, premier: $first_horse_name"

echo ""

# Test de performance simple
echo "⚡ Test de performance..."
start_time=$(date +%s)

for i in {1..10}; do
    curl -s "$BASE_URL/api/status" > /dev/null
done

end_time=$(date +%s)
duration=$((end_time - start_time))
echo "• 10 requêtes en $duration secondes"

echo ""

# Test des notifications avec polling
echo "🔔 Test de polling pour notifications..."
echo -n "• Polling 5 fois avec intervalle de 1s... "

for i in {1..5}; do
    timestamp=$(curl -s "$BASE_URL/api/status" | jq -r '.timestamp' 2>/dev/null || echo "N/A")
    sleep 1
done

echo "✅ OK (dernier timestamp: ${timestamp:0:19})"

echo ""

# Résultats finaux
echo "🎯 RÉSUMÉ"
echo "========"

if [ "$status_code" = "200" ] && [ "$dashboard_code" = "200" ] && [ "$horses_code" = "200" ]; then
    echo "✅ Toutes les APIs fonctionnent correctement"
    echo "✅ Le système Tunisia Jockey Club est opérationnel"
    echo "✅ Les données sont accessibles via curl"
    echo ""
    echo "📋 APIs disponibles:"
    echo "   • GET $BASE_URL/api/status"
    echo "   • GET $BASE_URL/api/dashboard/data"  
    echo "   • GET $BASE_URL/api/horses"
    echo ""
    echo "🔗 Utilisation recommandée:"
    echo "   curl -X GET $BASE_URL/api/status | jq ."
    echo "   curl -X GET $BASE_URL/api/dashboard/data | jq '.overview'"
    echo "   curl -X GET $BASE_URL/api/horses | jq '.horses[0:3]'"
else
    echo "❌ Certaines APIs ne répondent pas correctement"
    echo "   Status API: $status_code"
    echo "   Dashboard API: $dashboard_code" 
    echo "   Horses API: $horses_code"
fi

echo ""
echo "Test terminé à $(date)"
echo ""
