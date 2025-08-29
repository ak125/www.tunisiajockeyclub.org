#!/bin/bash

echo "=== Test Sidebar Navigation Tunisia Jockey Club ==="
echo "Date: $(date)"
echo ""

# Test des routes du sidebar
echo "1. Test Vue d'ensemble (Dashboard principal)..."
curl -s -o /dev/null -w "Status: %{http_code} - %{url_effective}\n" http://localhost:3000/dashboard

echo ""
echo "2. Test Courses..."
curl -s -o /dev/null -w "Status: %{http_code} - %{url_effective}\n" http://localhost:3000/dashboard/races

echo ""
echo "3. Test Chevaux..."
curl -s -o /dev/null -w "Status: %{http_code} - %{url_effective}\n" http://localhost:3000/dashboard/horses

echo ""
echo "4. Test Jockeys..."
curl -s -o /dev/null -w "Status: %{http_code} - %{url_effective}\n" http://localhost:3000/dashboard/jockeys

echo ""
echo "5. Test Calendrier..."
curl -s -o /dev/null -w "Status: %{http_code} - %{url_effective}\n" http://localhost:3000/dashboard/calendar

echo ""
echo "6. Test Analytics..."
curl -s -o /dev/null -w "Status: %{http_code} - %{url_effective}\n" http://localhost:3000/dashboard/analytics

echo ""
echo "7. Test Paramètres..."
curl -s -o /dev/null -w "Status: %{http_code} - %{url_effective}\n" http://localhost:3000/dashboard/settings

echo ""
echo "8. Test API Backend - Courses..."
curl -s http://localhost:3000/api/courses | jq -r '.pagination.count' | xargs -I {} echo "Courses API: {} courses disponibles"

echo ""
echo "9. Test API Backend - Cache..."
curl -s http://localhost:3000/api/cache/stats | jq -r '.cache.totalKeys' | xargs -I {} echo "Cache: {} clés actives"

echo ""
echo "🏇 Test Navigation Sidebar Complété ! 🏇"
