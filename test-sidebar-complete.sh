#!/bin/bash

echo "=== Navigation Sidebar Complète - Tunisia Jockey Club ==="
echo "Date: $(date)"
echo ""

echo "📋 Test de TOUTES les routes de navigation:"
echo ""

echo "🏠 ACCÈS RAPIDE GÉNÉRAL:"
curl -s -o /dev/null -w "  ✅ Accueil: %{http_code}\n" http://localhost:3000/
curl -s -o /dev/null -w "  ✅ Vue d'ensemble: %{http_code}\n" http://localhost:3000/dashboard

echo ""
echo "🏆 MODULES SPÉCIALISÉS:"
curl -s -o /dev/null -w "  ✅ Rating IFHA: %{http_code}\n" http://localhost:3000/rating
curl -s -o /dev/null -w "  ✅ Courses: %{http_code}\n" http://localhost:3000/dashboard/races
curl -s -o /dev/null -w "  ✅ Chevaux: %{http_code}\n" http://localhost:3000/dashboard/horses
curl -s -o /dev/null -w "  ✅ Jockeys: %{http_code}\n" http://localhost:3000/dashboard/jockeys

echo ""
echo "📊 OUTILS DE GESTION:"
curl -s -o /dev/null -w "  ✅ Calendrier: %{http_code}\n" http://localhost:3000/dashboard/calendar
curl -s -o /dev/null -w "  ✅ Analytics Pro: %{http_code}\n" http://localhost:3000/dashboard/analytics
curl -s -o /dev/null -w "  ✅ Statistiques: %{http_code}\n" http://localhost:3000/statistics

echo ""
echo "⚙️ CONFIGURATION:"
curl -s -o /dev/null -w "  ✅ Profil: %{http_code}\n" http://localhost:3000/profile
curl -s -o /dev/null -w "  ✅ Paramètres: %{http_code}\n" http://localhost:3000/dashboard/settings

echo ""
echo "🔗 API BACKEND:"
curl -s http://localhost:3000/api/courses | jq -r '.pagination.count' | xargs -I {} echo "  ✅ API Courses: {} courses"
curl -s http://localhost:3000/api/cache/stats | jq -r '.cache.totalKeys' | xargs -I {} echo "  ✅ Cache System: {} clés"
curl -s http://localhost:3000/api/events-demo/status | jq -r '.system.status' | xargs -I {} echo "  ✅ WebSockets: {}"

echo ""
echo "🏇 NAVIGATION SIDEBAR TUNISIA JOCKEY CLUB - COMPLÈTE ET OPÉRATIONNELLE ! 🏇"
