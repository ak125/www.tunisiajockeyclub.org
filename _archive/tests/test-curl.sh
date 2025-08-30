#!/bin/bash

echo "🧪 TUNISIA JOCKEY CLUB - TESTS CURL API"
echo "========================================"
echo ""

# Configuration
BASE_URL="http://localhost:3000"
SUPABASE_URL="https://ohwwblmvlhfzqqvbcsjc.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9od3dibG12bGhmenFxdmJjc2pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNTY1NjQsImV4cCI6MjA1MDczMjU2NH0.xKNBUt3lEpfzPEXVb9c28djJQALXhIkkz0qzCTJc8Jc"

echo "🌐 Configuration:"
echo "   Backend: $BASE_URL"
echo "   Supabase: $SUPABASE_URL"
echo "   Date: $(date)"
echo ""

# Test 1: Vérifier que le serveur répond
echo "1️⃣ TEST - Serveur Backend"
echo "========================="
curl -s -o /dev/null -w "Status: %{http_code} | Temps: %{time_total}s\n" "$BASE_URL" || echo "❌ Serveur inaccessible"
echo ""

# Test 2: Tester l'accès direct Supabase
echo "2️⃣ TEST - Connexion Supabase Directe"
echo "===================================="
echo "🔍 Test des utilisateurs..."
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  "$SUPABASE_URL/rest/v1/users?select=id,email,first_name,last_name&limit=5")

http_code=$(echo "$response" | tail -n1 | cut -d: -f2)
body=$(echo "$response" | head -n -1)

if [ "$http_code" = "200" ]; then
  echo "✅ Supabase accessible"
  echo "👥 Utilisateurs trouvés:"
  echo "$body" | jq '.' 2>/dev/null || echo "$body"
else
  echo "❌ Erreur Supabase (Code: $http_code)"
  echo "$body"
fi
echo ""

# Test 3: Tester l'accès aux chevaux
echo "3️⃣ TEST - Données Chevaux"
echo "=========================="
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  "$SUPABASE_URL/rest/v1/horses?select=id,name,sex,color,birth_date&limit=5")

http_code=$(echo "$response" | tail -n1 | cut -d: -f2)
body=$(echo "$response" | head -n -1)

if [ "$http_code" = "200" ]; then
  echo "✅ Chevaux accessibles"
  echo "🐎 Chevaux trouvés:"
  echo "$body" | jq '.' 2>/dev/null || echo "$body"
else
  echo "❌ Erreur chevaux (Code: $http_code)"
  echo "$body"
fi
echo ""

# Test 4: Test de login avec utilisateur existant
echo "4️⃣ TEST - Login Utilisateur"
echo "==========================="
echo "🔐 Tentative de connexion avec monia@gmail.com..."

# D'abord, vérifier si l'utilisateur existe
user_check=$(curl -s \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  "$SUPABASE_URL/rest/v1/users?email=eq.monia@gmail.com&select=id,email,first_name,last_name")

echo "👤 Vérification utilisateur:"
echo "$user_check" | jq '.' 2>/dev/null || echo "$user_check"

# Test du endpoint de login
echo ""
echo "🔗 Test endpoint /login..."
login_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -c cookies.txt \
  "$BASE_URL/login")

login_http_code=$(echo "$login_response" | tail -n1 | cut -d: -f2)
echo "Status login page: $login_http_code"

# Test POST login (si formulaire disponible)
echo ""
echo "🔐 Test POST login..."
post_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -b cookies.txt -c cookies.txt \
  -X POST \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=monia@gmail.com&password=password123" \
  "$BASE_URL/auth/login")

post_http_code=$(echo "$post_response" | tail -n1 | cut -d: -f2)
post_body=$(echo "$post_response" | head -n -1)
echo "Status POST login: $post_http_code"
echo "Response: $post_body"
echo ""

# Test 5: Test du dashboard avec données
echo "5️⃣ TEST - Dashboard Data"
echo "========================"
echo "📊 Test des données du dashboard..."

dashboard_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -b cookies.txt \
  "$BASE_URL/dashboard")

dashboard_http_code=$(echo "$dashboard_response" | tail -n1 | cut -d: -f2)
echo "Status dashboard: $dashboard_http_code"

if [ "$dashboard_http_code" = "200" ]; then
  echo "✅ Dashboard accessible"
  # Extraire et analyser les données
  echo "📈 Analyse du contenu..."
  dashboard_body=$(echo "$dashboard_response" | head -n -1)
  
  # Chercher des indicateurs de données réelles
  if echo "$dashboard_body" | grep -q "NOUR EL HOUDA\|Thunder\|fallback"; then
    echo "📊 Données détectées dans le dashboard"
  else
    echo "⚠️  Aucune donnée évidente détectée"
  fi
else
  echo "❌ Dashboard inaccessible"
fi
echo ""

# Test 6: Test direct des APIs du dashboard
echo "6️⃣ TEST - APIs Dashboard Directes"
echo "=================================="

# Test statistiques via Supabase
echo "📊 Statistiques générales:"
echo ""

# Compter les chevaux
horses_count=$(curl -s \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Prefer: count=exact" \
  "$SUPABASE_URL/rest/v1/horses?select=count" | head -1)

echo "🐎 Chevaux: $horses_count"

# Compter les utilisateurs
users_count=$(curl -s \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Prefer: count=exact" \
  "$SUPABASE_URL/rest/v1/users?select=count" | head -1)

echo "👥 Utilisateurs: $users_count"

# Compter les courses
races_count=$(curl -s \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Prefer: count=exact" \
  "$SUPABASE_URL/rest/v1/races?select=count" | head -1)

echo "🏆 Courses: $races_count"
echo ""

# Test 7: Diagnostic des variables d'environnement
echo "7️⃣ TEST - Variables d'Environment"
echo "=================================="
echo "🔍 Test de configuration serveur..."

config_test=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  "$BASE_URL/api/config-test" 2>/dev/null)

config_http_code=$(echo "$config_test" | tail -n1 | cut -d: -f2)
if [ "$config_http_code" = "404" ]; then
  echo "⚠️  Endpoint config-test n'existe pas (normal)"
else
  echo "Status config: $config_http_code"
fi
echo ""

# Test 8: Test des cookies et sessions
echo "8️⃣ TEST - Cookies & Sessions"
echo "============================="
echo "🍪 Vérification des cookies..."

if [ -f cookies.txt ]; then
  echo "Cookies sauvegardés:"
  cat cookies.txt
  echo ""
else
  echo "❌ Aucun cookie trouvé"
fi

# Test avec cookie
echo "🔐 Test avec session cookie..."
session_test=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -b cookies.txt \
  "$BASE_URL/api/me" 2>/dev/null)

session_http_code=$(echo "$session_test" | tail -n1 | cut -d: -f2)
echo "Status session test: $session_http_code"
echo ""

# Résumé
echo "📋 RÉSUMÉ DES TESTS"
echo "===================="
echo "✅ Tests effectués:"
echo "   • Serveur backend"
echo "   • Connexion Supabase"
echo "   • Données chevaux/utilisateurs"
echo "   • Processus de login"
echo "   • Dashboard et données"
echo "   • APIs directes"
echo "   • Cookies et sessions"
echo ""
echo "🔧 Pour débugger:"
echo "   • Vérifiez les logs serveur"
echo "   • Contrôlez les variables d'env"
echo "   • Testez l'authentification manuelle"
echo "   • Vérifiez la configuration Supabase"
echo ""
echo "📝 Cookies sauvegardés dans: cookies.txt"
echo "🕒 Test terminé à: $(date)"

# Nettoyage
# rm -f cookies.txt
