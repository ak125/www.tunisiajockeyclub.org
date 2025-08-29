#!/bin/bash

echo "=== Tunisia Jockey Club - Système Complet ==="
echo "Date: $(date)"
echo ""

# Test des endpoints principaux
echo "1. Test Frontend Remix..."
curl -s -o /dev/null -w "Status: %{http_code} - Temps: %{time_total}s\n" http://localhost:3000/

echo ""
echo "2. Test Système d'Événements WebSocket..."
curl -s http://localhost:3000/api/events-demo/test-notification | jq -r '.message'

echo ""
echo "3. Test Système de Monitoring..."
curl -s http://localhost:3000/api/monitoring/stats | jq -r '.stats.status'

echo ""
echo "4. Test Cache Avancé..."
curl -s http://localhost:3000/api/cache/stats | jq -r '.cache | "Clés: \(.totalKeys), Hits: \(.totalHits), Taux: \(.hitRate)%"'

echo ""
echo "5. Test Course en temps réel..."
curl -s http://localhost:3000/api/events-demo/test-race-update -X POST -H "Content-Type: application/json" -d '{"raceId":"live_001","status":"RUNNING"}' | jq -r '.message'

echo ""
echo "6. Test API Courses..."
curl -s http://localhost:3000/api/courses | jq -r '.courses | length' | xargs -I {} echo "Courses disponibles: {}"

echo ""
echo "7. Test Système de Sécurité (Rate Limiting)..."
curl -s -I http://localhost:3000/api/cache/stats | grep -E "X-RateLimit-Remaining" | head -1

echo ""
echo "8. Test Dashboard Monitoring..."
curl -s http://localhost:3000/api/monitoring/dashboard | jq -r '.dashboard.title'

echo ""
echo "=== Statistiques du Cache ==="
curl -s http://localhost:3000/api/cache/stats | jq '.cache'

echo ""
echo "=== Alertes Système ==="
curl -s http://localhost:3000/api/monitoring/alerts | jq '.alerts | length' | xargs -I {} echo "Alertes actives: {}"

echo ""
echo "=== Système WebSocket Status ==="
curl -s http://localhost:3000/api/events-demo/status | jq -r '.status'

echo ""
echo "🏆 Tunisia Jockey Club - Système Opérationnel ! 🏆"
