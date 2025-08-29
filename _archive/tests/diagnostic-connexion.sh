#!/bin/bash

echo "🔍 DIAGNOSTIC - PROBLÈME DE CONNEXION"
echo "===================================="
echo ""

BASE_URL="http://localhost:3000"

# Test 1: Page de login accessible ?
echo "1️⃣ Vérification page de login"
echo "==============================" 
login_status=$(curl -s -w "%{http_code}" -o /dev/null "$BASE_URL/login")
echo "Status page login: $login_status"

if [ "$login_status" = "200" ]; then
    echo "✅ Page de login accessible"
else
    echo "❌ Page de login inaccessible"
    exit 1
fi

echo ""

# Test 2: API d'authentification fonctionne ?
echo "2️⃣ Test API d'authentification"
echo "==============================="
api_response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"monia@gmail.com","password":"password123"}' \
    "$BASE_URL/api/auth/login")

echo "Réponse API: $api_response"

if echo "$api_response" | grep -q "success.*true"; then
    echo "✅ API d'auth fonctionne"
else
    echo "❌ API d'auth ne fonctionne pas"
    exit 1
fi

echo ""

# Test 3: Soumission formulaire avec cookies
echo "3️⃣ Test soumission formulaire complet"
echo "====================================="

# Étape 1: Récupérer la page login et cookies
echo "📋 Récupération page login avec cookies..."
curl -s -c test_cookies.txt "$BASE_URL/login" > /dev/null

echo "📤 Soumission du formulaire de login..."
form_response=$(curl -s -v \
    -c test_cookies_after.txt \
    -b test_cookies.txt \
    -X POST \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "email=monia@gmail.com&password=password123" \
    "$BASE_URL/login" 2>&1)

# Analyser la réponse
http_code=$(echo "$form_response" | grep "< HTTP" | tail -1 | awk '{print $3}')
location=$(echo "$form_response" | grep "< location:" | awk '{print $3}' | tr -d '\r')

echo "Code de réponse: $http_code"
echo "Location: $location"

if [ "$http_code" = "302" ]; then
    echo "✅ Formulaire soumis avec succès (redirection)"
    if [ "$location" = "/dashboard" ]; then
        echo "✅ Redirection vers dashboard"
    else
        echo "⚠️  Redirection inattendue: $location"
    fi
else
    echo "❌ Problème soumission formulaire: $http_code"
    echo "Réponse complète:"
    echo "$form_response" | tail -20
fi

echo ""

# Test 4: Accès dashboard après login
echo "4️⃣ Test accès dashboard après login"
echo "==================================="

dashboard_response=$(curl -s -w "\nSTATUS:%{http_code}" \
    -b test_cookies_after.txt \
    "$BASE_URL/dashboard")

dashboard_status=$(echo "$dashboard_response" | tail -1 | cut -d: -f2)
dashboard_content=$(echo "$dashboard_response" | head -n -1)

echo "Status dashboard: $dashboard_status"

if [ "$dashboard_status" = "200" ]; then
    if echo "$dashboard_content" | grep -q "Dashboard\|dashboard\|Tableau"; then
        echo "✅ Dashboard accessible et chargé"
    else
        echo "⚠️  Dashboard accessible mais contenu suspect"
    fi
elif [ "$dashboard_status" = "302" ]; then
    echo "⚠️  Dashboard redirige (peut-être vers login?)"
else
    echo "❌ Dashboard inaccessible: $dashboard_status"
fi

echo ""

# Test 5: Test avec mauvais identifiants
echo "5️⃣ Test avec identifiants invalides"
echo "==================================="

bad_form_response=$(curl -s -w "\nSTATUS:%{http_code}" \
    -X POST \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "email=wrong@email.com&password=wrongpass" \
    "$BASE_URL/login")

bad_status=$(echo "$bad_form_response" | tail -1 | cut -d: -f2)
bad_content=$(echo "$bad_form_response" | head -n -1)

echo "Status avec mauvais identifiants: $bad_status"

if [ "$bad_status" = "401" ]; then
    echo "✅ Erreur correctement gérée"
elif [ "$bad_status" = "200" ]; then
    if echo "$bad_content" | grep -q "error\|Error\|erreur"; then
        echo "✅ Erreur affichée dans le formulaire"
    else
        echo "❌ Pas d'erreur visible avec mauvais identifiants"
    fi
else
    echo "⚠️  Réponse inattendue: $bad_status"
fi

echo ""

# Résumé du diagnostic
echo "📋 DIAGNOSTIC FINAL"
echo "=================="
echo ""

problems=0

if [ "$login_status" != "200" ]; then
    echo "❌ Page login inaccessible"
    problems=$((problems + 1))
fi

if ! echo "$api_response" | grep -q "success.*true"; then
    echo "❌ API auth ne fonctionne pas"
    problems=$((problems + 1))
fi

if [ "$http_code" != "302" ]; then
    echo "❌ Formulaire login ne redirige pas"
    problems=$((problems + 1))
fi

if [ "$dashboard_status" != "200" ]; then
    echo "❌ Dashboard inaccessible après login"
    problems=$((problems + 1))
fi

if [ $problems -eq 0 ]; then
    echo "✅ AUCUN PROBLÈME DÉTECTÉ"
    echo ""
    echo "Le système d'authentification fonctionne correctement."
    echo "Si vous ne pouvez pas vous connecter, vérifiez:"
    echo "• Utilisez un des comptes de test:"
    echo "  - monia@gmail.com / password123"
    echo "  - admin@tjc.tn / admin123" 
    echo "  - test@test.com / test123"
    echo "• Vérifiez que les champs sont bien remplis"
    echo "• Essayez en navigation privée"
else
    echo "❌ PROBLÈMES DÉTECTÉS: $problems"
    echo ""
    echo "Vérifiez les logs du serveur pour plus de détails."
fi

echo ""
echo "🌐 URLs de test:"
echo "  • Login: $BASE_URL/login"
echo "  • Dashboard: $BASE_URL/dashboard"
echo "  • API Auth: $BASE_URL/api/auth/login"

# Nettoyage
rm -f test_cookies.txt test_cookies_after.txt

echo ""
echo "🕒 Diagnostic terminé à: $(date)"
