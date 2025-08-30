#!/bin/bash

echo "🔐 TEST - NOUVEAU SYSTÈME D'AUTHENTIFICATION"
echo "============================================="
echo ""

BASE_URL="http://localhost:3000"

echo "🌐 Configuration: $BASE_URL"
echo "🕒 Date: $(date)"
echo ""

# Test 1: Vérifier l'endpoint d'authentification backend
echo "1️⃣ TEST - Backend API Auth"
echo "=========================="

echo "🔌 Test endpoint /api/auth/login:"
login_api_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"monia@gmail.com","password":"password123"}' \
  "$BASE_URL/api/auth/login")

login_api_code=$(echo "$login_api_response" | tail -1 | cut -d: -f2)
login_api_body=$(echo "$login_api_response" | head -n -1)

echo "   Status: $login_api_code"

if [ "$login_api_code" = "200" ] || [ "$login_api_code" = "201" ]; then
  echo "✅ API Auth fonctionne"
  if echo "$login_api_body" | grep -q "success.*true"; then
    echo "✅ Authentification réussie"
    if echo "$login_api_body" | grep -q "sessionToken"; then
      echo "✅ Token de session généré"
    else
      echo "⚠️  Pas de token visible"
    fi
  else
    echo "⚠️  Réponse API suspecte"
  fi
else
  echo "❌ API Auth ne répond pas correctement"
fi

echo ""
echo "📋 Réponse API complète:"
echo "$login_api_body" | head -10

echo ""

# Test 2: Test du formulaire Remix login
echo "2️⃣ TEST - Formulaire Remix Login"
echo "================================"

echo "🎭 Test POST formulaire Remix login:"

# Récupérer d'abord la page pour les cookies éventuels
curl -s -c remix_cookies.txt "$BASE_URL/login" > /dev/null

# Soumettre le formulaire
login_form_response=$(curl -s -w "\nHTTP_CODE:%{http_code}\nREDIRECT_URL:%{redirect_url}" \
  -b remix_cookies.txt -c remix_cookies_after.txt \
  -X POST \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=monia@gmail.com&password=password123" \
  "$BASE_URL/login")

form_code=$(echo "$login_form_response" | grep "HTTP_CODE:" | cut -d: -f2)
redirect_url=$(echo "$login_form_response" | grep "REDIRECT_URL:" | cut -d: -f2-)
form_body=$(echo "$login_form_response" | head -n -2)

echo "   Status: $form_code"

if [ "$form_code" = "302" ]; then
  echo "✅ Formulaire redirige (comportement attendu)"
  if [ -n "$redirect_url" ] && [ "$redirect_url" != "" ]; then
    echo "🔄 Redirection vers: $redirect_url"
  fi
elif [ "$form_code" = "200" ]; then
  echo "⚠️  Formulaire retourne 200 (peut contenir erreur)"
  if echo "$form_body" | grep -q "error\|Error\|erreur"; then
    echo "❌ Erreur dans le formulaire détectée"
  else
    echo "✅ Pas d'erreur visible"
  fi
else
  echo "❌ Formulaire status inattendu: $form_code"
fi

echo ""

# Test 3: Vérifier l'accès au dashboard après login
echo "3️⃣ TEST - Accès Dashboard Après Login"
echo "====================================="

echo "📊 Test dashboard avec cookies Remix:"
dashboard_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -b remix_cookies_after.txt \
  -H "Accept: text/html" \
  "$BASE_URL/dashboard")

dashboard_code=$(echo "$dashboard_response" | tail -1 | cut -d: -f2)
dashboard_content=$(echo "$dashboard_response" | head -n -1)

echo "   Dashboard: $dashboard_code"

if [ "$dashboard_code" = "200" ]; then
  if echo "$dashboard_content" | grep -q "totalHorses\|chevaux\|Dashboard"; then
    echo "✅ Dashboard accessible avec données"
  else
    echo "⚠️  Dashboard accessible mais contenu suspect"
  fi
elif [ "$dashboard_code" = "302" ]; then
  echo "⚠️  Dashboard redirige (peut-être vers login)"
else
  echo "❌ Dashboard inaccessible: $dashboard_code"
fi

echo ""

# Test 4: Test des identifiants de test
echo "4️⃣ TEST - Tous Les Utilisateurs Test"
echo "===================================="

test_users=("monia@gmail.com:password123" "admin@tjc.tn:admin123" "test@test.com:test123")

for user_pass in "${test_users[@]}"; do
  email=$(echo $user_pass | cut -d: -f1)
  password=$(echo $user_pass | cut -d: -f2)
  
  echo "👤 Test utilisateur: $email"
  
  user_response=$(curl -s \
    -X POST \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$email\",\"password\":\"$password\"}" \
    "$BASE_URL/api/auth/login")
    
  if echo "$user_response" | grep -q "success.*true"; then
    echo "   ✅ Auth réussie"
  else
    echo "   ❌ Auth échouée"
  fi
done

echo ""

# Test 5: Test des identifiants invalides
echo "5️⃣ TEST - Gestion Erreurs"
echo "========================="

echo "❌ Test avec identifiants invalides:"
invalid_response=$(curl -s \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid@test.com","password":"wrongpass"}' \
  "$BASE_URL/api/auth/login")

if echo "$invalid_response" | grep -q "success.*false"; then
  echo "✅ Erreur correctement gérée"
  if echo "$invalid_response" | grep -q "availableUsers"; then
    echo "✅ Liste des utilisateurs disponibles fournie"
  fi
else
  echo "❌ Gestion d'erreur problématique"
fi

echo ""

# Résumé
echo "📋 RÉSUMÉ - NOUVEAU SYSTÈME AUTH"
echo "================================"
echo ""

if [ "$login_api_code" = "200" ]; then
  echo "✅ Backend API Auth fonctionne"
else
  echo "❌ Problème Backend API Auth"
fi

if [ "$form_code" = "302" ] || [ "$form_code" = "200" ]; then
  echo "✅ Frontend Remix connecté au backend"
else
  echo "❌ Problème connexion Remix -> Backend"
fi

if [ "$dashboard_code" = "200" ]; then
  echo "✅ Dashboard accessible après auth"
else
  echo "❌ Dashboard inaccessible après auth"
fi

echo ""
echo "🎯 IDENTIFIANTS DE TEST DISPONIBLES:"
echo "   • monia@gmail.com / password123"
echo "   • admin@tjc.tn / admin123"
echo "   • test@test.com / test123"
echo ""

echo "🌐 URLs de test:"
echo "   • Login: $BASE_URL/login"
echo "   • API Auth: $BASE_URL/api/auth/login"
echo "   • Dashboard: $BASE_URL/dashboard"
echo ""

# Nettoyage
rm -f remix_cookies.txt remix_cookies_after.txt

echo "🕒 Test terminé à: $(date)"
