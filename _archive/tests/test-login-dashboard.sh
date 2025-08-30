#!/bin/bash

echo "🔐 TUNISIA JOCKEY CLUB - TEST LOGIN & DASHBOARD"
echo "==============================================="
echo ""

BASE_URL="http://localhost:3000"

echo "🌐 Configuration:"
echo "   URL: $BASE_URL"
echo "   Date: $(date)"
echo ""

# Test 1: Test de l'API d'authentification
echo "1️⃣ TEST - API Authentification"
echo "=============================="

# Test du check auth
echo "🔍 Check auth endpoint:"
auth_check_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  "$BASE_URL/api/auth/check")

auth_check_http_code=$(echo "$auth_check_response" | tail -n1 | cut -d: -f2)
auth_check_body=$(echo "$auth_check_response" | head -n -1)

if [ "$auth_check_http_code" = "200" ] || [ "$auth_check_http_code" = "201" ]; then
  echo "✅ Auth check OK"
  echo "Response: $auth_check_body"
else
  echo "❌ Auth check Failed (Code: $auth_check_http_code)"
fi
echo ""

# Test de connexion avec utilisateur valide
echo "🔐 Test login avec monia@gmail.com:"
login_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"monia@gmail.com","password":"password123"}' \
  "$BASE_URL/api/auth/login")

login_http_code=$(echo "$login_response" | tail -n1 | cut -d: -f2)
login_body=$(echo "$login_response" | head -n -1)

if [ "$login_http_code" = "200" ] || [ "$login_http_code" = "201" ]; then
  echo "✅ Login réussi"
  echo "Response: $login_body"
  
  # Extraire le token si possible
  session_token=$(echo "$login_body" | jq -r '.user.sessionToken // null' 2>/dev/null)
  if [ "$session_token" != "null" ] && [ -n "$session_token" ]; then
    echo "🎫 Token de session: ${session_token:0:20}..."
  fi
else
  echo "❌ Login échoué (Code: $login_http_code)"
  echo "Response: $login_body"
fi
echo ""

# Test 2: Dashboard avec vraies données
echo "2️⃣ TEST - Dashboard avec API"
echo "============================"

dashboard_api_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BASE_URL/api/dashboard/data")
dashboard_api_http_code=$(echo "$dashboard_api_response" | tail -n1 | cut -d: -f2)
dashboard_api_body=$(echo "$dashboard_api_response" | head -n -1)

if [ "$dashboard_api_http_code" = "200" ]; then
  echo "✅ Dashboard API fonctionne"
  
  # Analyser les données
  total_horses=$(echo "$dashboard_api_body" | jq -r '.overview.totalHorses // "unknown"' 2>/dev/null)
  recent_horses_count=$(echo "$dashboard_api_body" | jq -r '.recentHorses | length // 0' 2>/dev/null)
  first_horse_name=$(echo "$dashboard_api_body" | jq -r '.recentHorses[0].name // "unknown"' 2>/dev/null)
  
  echo "📊 Statistiques API:"
  echo "   🐎 Total chevaux: $total_horses"
  echo "   📝 Chevaux récents: $recent_horses_count"
  echo "   🏆 Premier cheval: $first_horse_name"
  
  if echo "$dashboard_api_body" | grep -q "fallback.*true"; then
    echo "   ⚠️  Mode fallback actif (DB non connectée)"
  else
    echo "   ✅ Données live possibles"
  fi
else
  echo "❌ Dashboard API échoué (Code: $dashboard_api_http_code)"
fi
echo ""

# Test 3: Frontend Dashboard Page
echo "3️⃣ TEST - Page Dashboard Frontend"
echo "================================="

dashboard_page_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BASE_URL/dashboard")
dashboard_page_http_code=$(echo "$dashboard_page_response" | tail -n1 | cut -d: -f2)

if [ "$dashboard_page_http_code" = "200" ]; then
  echo "✅ Dashboard page accessible"
  
  dashboard_page_body=$(echo "$dashboard_page_response" | head -n -1)
  
  # Analyser le contenu de la page
  if echo "$dashboard_page_body" | grep -q "Dashboard Avancé\|Tableau de bord"; then
    echo "   📊 Titre dashboard détecté"
  fi
  
  if echo "$dashboard_page_body" | grep -q "AdvancedDashboard\|recharts\|framer-motion"; then
    echo "   🎨 Composants avancés chargés"
  fi
  
  # Chercher des données spécifiques
  if echo "$dashboard_page_body" | grep -q "NOUR EL HOUDA\|Thunder\|Farouk"; then
    echo "   🐎 Données de chevaux détectées"
  fi
  
  if echo "$dashboard_page_body" | grep -q "PRIX DE\|Grand Prix"; then
    echo "   🏆 Données de courses détectées"
  fi
  
  # Erreurs potentielles
  if echo "$dashboard_page_body" | grep -qi "error\|erreur\|fail\|404\|500"; then
    echo "   ⚠️  Erreurs possibles détectées"
  else
    echo "   ✅ Pas d'erreur évidente"
  fi
else
  echo "❌ Dashboard page inaccessible (Code: $dashboard_page_http_code)"
fi
echo ""

# Test 4: Test complet du flow utilisateur
echo "4️⃣ TEST - Flow Utilisateur Complet"
echo "=================================="

echo "🔄 Simulation parcours utilisateur:"

# 1. Accès page d'accueil
echo "1. Page d'accueil:"
home_test=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")
echo "   Status: $home_test"

# 2. Page de login
echo "2. Page login:"
login_page_test=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/login")
echo "   Status: $login_page_test"

# 3. Tentative de login API
echo "3. Login API:"
if [ "$login_http_code" = "200" ] || [ "$login_http_code" = "201" ]; then
  echo "   ✅ Authentification OK"
else
  echo "   ❌ Authentification échouée"
fi

# 4. Accès au dashboard
echo "4. Dashboard:"
if [ "$dashboard_page_http_code" = "200" ]; then
  echo "   ✅ Dashboard accessible"
else
  echo "   ❌ Dashboard inaccessible"
fi

# 5. APIs de données
echo "5. APIs de données:"
if [ "$dashboard_api_http_code" = "200" ]; then
  echo "   ✅ API données OK"
else
  echo "   ❌ API données KO"
fi
echo ""

# Test 5: Performance et qualité
echo "5️⃣ TEST - Performance & Qualité"
echo "==============================="

echo "⏱️  Test de performance:"
dashboard_perf=$(curl -s -o /dev/null -w "Temps: %{time_total}s | Taille: %{size_download} bytes" "$BASE_URL/dashboard")
echo "   Dashboard: $dashboard_perf"

api_perf=$(curl -s -o /dev/null -w "Temps: %{time_total}s | Taille: %{size_download} bytes" "$BASE_URL/api/dashboard/data")
echo "   API: $api_perf"
echo ""

# Résumé
echo "📋 RÉSUMÉ FINAL"
echo "==============="
echo ""

# Composants critiques
components_ok=0
components_total=5

if [ "$auth_check_http_code" = "200" ] || [ "$auth_check_http_code" = "201" ]; then
  echo "✅ Système d'authentification: OK"
  ((components_ok++))
else
  echo "❌ Système d'authentification: FAILED"
fi

if [ "$login_http_code" = "200" ] || [ "$login_http_code" = "201" ]; then
  echo "✅ Login utilisateur: OK"
  ((components_ok++))
else
  echo "❌ Login utilisateur: FAILED"
fi

if [ "$dashboard_api_http_code" = "200" ]; then
  echo "✅ API Dashboard: OK"
  ((components_ok++))
else
  echo "❌ API Dashboard: FAILED"
fi

if [ "$dashboard_page_http_code" = "200" ]; then
  echo "✅ Frontend Dashboard: OK"
  ((components_ok++))
else
  echo "❌ Frontend Dashboard: FAILED"
fi

if [ "$home_test" = "200" ]; then
  echo "✅ Navigation générale: OK"
  ((components_ok++))
else
  echo "❌ Navigation générale: FAILED"
fi

echo ""
echo "🎯 Score: $components_ok/$components_total composants fonctionnels"

if [ "$components_ok" -eq "$components_total" ]; then
  echo "🎉 SYSTÈME ENTIÈREMENT FONCTIONNEL !"
elif [ "$components_ok" -ge 3 ]; then
  echo "✅ Système majoritairement fonctionnel"
else
  echo "⚠️  Système nécessite des corrections"
fi

echo ""
echo "🔗 URLs à tester:"
echo "   • Dashboard: $BASE_URL/dashboard"
echo "   • API Auth: $BASE_URL/api/auth/check"
echo "   • API Data: $BASE_URL/api/dashboard/data"
echo ""
echo "🕒 Test terminé: $(date)"
