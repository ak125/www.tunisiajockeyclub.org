#!/bin/bash

echo "🔍 DIAGNOSTIC DÉTAILLÉ - TUNISIA JOCKEY CLUB"
echo "=============================================="
echo ""

# Configuration
BASE_URL="http://localhost:3000"
BACKEND_URL="http://localhost:3001"

echo "🌐 Configuration:"
echo "   Frontend: $BASE_URL"
echo "   Backend: $BACKEND_URL"
echo ""

# Test 1: Vérifier les deux serveurs
echo "1️⃣ TEST - Serveurs"
echo "=================="
echo "🔍 Frontend Remix (port 3000):"
curl -s -o /dev/null -w "Status: %{http_code} | Temps: %{time_total}s\n" "$BASE_URL" || echo "❌ Frontend inaccessible"

echo "🔍 Backend NestJS (port 3001):"
curl -s -o /dev/null -w "Status: %{http_code} | Temps: %{time_total}s\n" "$BACKEND_URL" || echo "❌ Backend inaccessible"

# Test des endpoints spécifiques du backend
echo ""
echo "🔍 Backend API endpoints:"
curl -s -o /dev/null -w "Horses API: %{http_code}\n" "$BACKEND_URL/horses" || echo "❌ Horses API inaccessible"
curl -s -o /dev/null -w "Users API: %{http_code}\n" "$BACKEND_URL/users" || echo "❌ Users API inaccessible"
echo ""

# Test 2: Variables d'environnement via NestJS
echo "2️⃣ TEST - Configuration Backend"
echo "==============================="

# Test direct des données depuis le backend NestJS
echo "🐎 Récupération des chevaux via backend:"
horses_response=$(curl -s "$BACKEND_URL/horses" 2>/dev/null)
if [ $? -eq 0 ] && [ -n "$horses_response" ]; then
  echo "✅ Chevaux récupérés"
  echo "$horses_response" | head -c 200
  echo "..."
else
  echo "❌ Erreur récupération chevaux"
fi

echo ""
echo "👥 Récupération des utilisateurs via backend:"
users_response=$(curl -s "$BACKEND_URL/users" 2>/dev/null)
if [ $? -eq 0 ] && [ -n "$users_response" ]; then
  echo "✅ Utilisateurs récupérés"
  echo "$users_response" | head -c 200
  echo "..."
else
  echo "❌ Erreur récupération utilisateurs"
fi
echo ""

# Test 3: Authentification
echo "3️⃣ TEST - Authentification"
echo "=========================="

# Chercher les endpoints d'auth disponibles
echo "🔍 Endpoints d'authentification disponibles:"
auth_test=$(curl -s "$BACKEND_URL/auth" 2>/dev/null)
if [ $? -eq 0 ]; then
  echo "✅ /auth accessible"
else
  echo "❌ /auth inaccessible"
fi

# Test de l'endpoint authenticate
authenticate_test=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BACKEND_URL/authenticate" 2>/dev/null)
auth_http_code=$(echo "$authenticate_test" | tail -n1 | cut -d: -f2)
echo "Authenticate endpoint: $auth_http_code"

# Test local strategy
echo ""
echo "🔐 Test stratégie locale:"
local_auth_test=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"monia@gmail.com","password":"password123"}' \
  "$BACKEND_URL/auth/local" 2>/dev/null)

local_auth_http_code=$(echo "$local_auth_test" | tail -n1 | cut -d: -f2)
local_auth_body=$(echo "$local_auth_test" | head -n -1)
echo "Local auth: $local_auth_http_code"
echo "Response: $local_auth_body"
echo ""

# Test 4: Dashboard via Remix loader
echo "4️⃣ TEST - Dashboard Remix"
echo "========================="

echo "📊 Test du loader dashboard:"
dashboard_data=$(curl -s "$BASE_URL/dashboard" | grep -o 'NOUR EL HOUDA\|Thunder\|Fallback\|totalHorses\|overview' | head -5)
if [ -n "$dashboard_data" ]; then
  echo "✅ Données trouvées dans dashboard:"
  echo "$dashboard_data"
else
  echo "❌ Aucune donnée évidente dans dashboard"
fi
echo ""

# Test 5: Connexion réseau Supabase
echo "5️⃣ TEST - Connectivité Supabase"
echo "==============================="

SUPABASE_URL="https://ohwwblmvlhfzqqvbcsjc.supabase.co"
echo "🌐 Test ping Supabase:"
ping_test=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$SUPABASE_URL" 2>/dev/null)
echo "Supabase ping: $ping_test"

# Test sans clés API
echo "🔓 Test sans authentification:"
no_auth_test=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$SUPABASE_URL/rest/v1/" 2>/dev/null)
no_auth_http_code=$(echo "$no_auth_test" | tail -n1 | cut -d: -f2)
echo "Sans auth: $no_auth_http_code"

# Test avec clé publique basique
echo "🗝️  Test avec clé publique:"
basic_auth_test=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9od3dibG12bGhmenFxdmJjc2pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNTY1NjQsImV4cCI6MjA1MDczMjU2NH0.xKNBUt3lEpfzPEXVb9c28djJQALXhIkkz0qzCTJc8Jc" \
  "$SUPABASE_URL/rest/v1/" 2>/dev/null)

basic_auth_http_code=$(echo "$basic_auth_test" | tail -n1 | cut -d: -f2)
echo "Avec clé basique: $basic_auth_http_code"
echo ""

# Test 6: Processus complet
echo "6️⃣ TEST - Processus Complet"
echo "==========================="

echo "🔄 Simulation parcours utilisateur:"
echo ""

# 1. Accès page d'accueil
echo "1. Page d'accueil:"
home_status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")
echo "   Status: $home_status"

# 2. Accès login
echo "2. Page login:"
login_status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/login")
echo "   Status: $login_status"

# 3. Accès dashboard
echo "3. Dashboard:"
dashboard_status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/dashboard")
echo "   Status: $dashboard_status"

# 4. Test recherche
echo "4. Fonctionnalité recherche:"
# Le dashboard contient-il les composants de recherche ?
search_check=$(curl -s "$BASE_URL" | grep -o 'search\|Search\|recherche' | head -3)
if [ -n "$search_check" ]; then
  echo "   ✅ Composants recherche détectés"
else
  echo "   ❌ Pas de recherche évidente"
fi
echo ""

# Diagnostic final
echo "🏥 DIAGNOSTIC"
echo "============="
echo ""

if [ "$home_status" = "200" ]; then
  echo "✅ Frontend Remix fonctionne"
else
  echo "❌ Problème Frontend"
fi

if curl -s "$BACKEND_URL" > /dev/null 2>&1; then
  echo "✅ Backend NestJS accessible"
else
  echo "❌ Backend NestJS inaccessible"
fi

if [ "$basic_auth_http_code" = "200" ]; then
  echo "✅ Supabase accessible"
else
  echo "❌ Problème Supabase (auth ou réseau)"
fi

if [ "$dashboard_status" = "200" ]; then
  echo "✅ Dashboard se charge"
else
  echo "❌ Dashboard inaccessible"
fi

echo ""
echo "🎯 RECOMMANDATIONS:"
echo ""
echo "1. Vérifiez que le backend NestJS tourne sur le port 3001"
echo "2. Contrôlez les variables d'environnement Supabase"
echo "3. Testez la connexion réseau à Supabase"
echo "4. Vérifiez les logs des serveurs"
echo "5. Testez l'authentification manuellement"
echo ""
echo "📝 Pour plus de détails, consultez les logs:"
echo "   • Frontend: Terminal de dev Remix"
echo "   • Backend: Terminal de dev NestJS"
echo ""
echo "🕒 Diagnostic terminé à: $(date)"
