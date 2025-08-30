#!/bin/bash

echo "🔍 TEST - VRAIES DONNÉES SUPABASE"
echo "=================================="
echo ""

BASE_URL="http://localhost:3000"

# Test 1: Vérifier la connexion Supabase
echo "1️⃣ Test connexion Supabase"
echo "=========================="

supabase_test=$(curl -s "$BASE_URL/api/test/supabase")
echo "Réponse Supabase: $supabase_test"

if echo "$supabase_test" | grep -q "success.*true"; then
    echo "✅ Supabase connecté"
else
    echo "⚠️  Supabase non connecté, utilisation des données fallback"
fi

echo ""

# Test 2: Récupérer les données dashboard pour voir les vrais utilisateurs
echo "2️⃣ Récupération vraies données"
echo "=============================="

dashboard_data=$(curl -s "$BASE_URL/api/dashboard/data")
echo "Dashboard data disponible:"

if echo "$dashboard_data" | grep -q "totalUsers"; then
    total_users=$(echo "$dashboard_data" | grep -o '"totalUsers":[0-9]*' | cut -d: -f2)
    echo "✅ Nombre d'utilisateurs réels: $total_users"
else
    echo "❌ Pas de données utilisateurs trouvées"
fi

if echo "$dashboard_data" | grep -q "totalHorses"; then
    total_horses=$(echo "$dashboard_data" | grep -o '"totalHorses":[0-9]*' | cut -d: -f2)
    echo "✅ Nombre de chevaux réels: $total_horses"
else
    echo "❌ Pas de données chevaux trouvées"
fi

echo ""

# Test 3: Essayer l'authentification avec les vrais services
echo "3️⃣ Test authentification vraies données"
echo "======================================="

echo "🔐 Test avec le nouveau système d'auth..."

# Tester avec monia@gmail.com (doit exister dans vos données)
auth_response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"monia@gmail.com","password":"password123"}' \
    "$BASE_URL/api/auth/login")

echo "Réponse auth: $auth_response"

if echo "$auth_response" | grep -q "success.*true"; then
    echo "✅ Authentification réussie avec vraies données"
    if echo "$auth_response" | grep -q "fallback"; then
        echo "⚠️  Mode fallback utilisé"
    else
        echo "✅ Authentification directe Supabase/Prisma"
    fi
else
    echo "❌ Échec authentification"
    if echo "$auth_response" | grep -q "message"; then
        message=$(echo "$auth_response" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
        echo "Message: $message"
    fi
fi

echo ""

# Test 4: Lister les utilisateurs disponibles via Supabase direct
echo "4️⃣ Test API Supabase directe"
echo "============================"

if [ ! -z "$SUPABASE_URL" ] && [ ! -z "$SUPABASE_ANON_KEY" ]; then
    echo "🔗 Test connexion directe Supabase..."
    
    supabase_users=$(curl -s \
        -H "apikey: $SUPABASE_ANON_KEY" \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        "$SUPABASE_URL/rest/v1/users?select=email,first_name,last_name&limit=5")
    
    echo "Utilisateurs Supabase: $supabase_users"
    
    if echo "$supabase_users" | grep -q "\["; then
        echo "✅ Connexion Supabase directe réussie"
        user_count=$(echo "$supabase_users" | grep -o '"email"' | wc -l)
        echo "📊 Nombre d'utilisateurs trouvés: $user_count"
    else
        echo "❌ Échec connexion Supabase directe"
    fi
else
    echo "⚠️  Variables Supabase non configurées"
    echo "SUPABASE_URL: ${SUPABASE_URL:-'non défini'}"
    echo "SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY:-'non défini'}"
fi

echo ""

# Test 5: Optimisation de performance
echo "5️⃣ Test performance"
echo "=================="

echo "📊 Temps de réponse page login:"
start_time=$(date +%s%N)
curl -s "$BASE_URL/login" > /dev/null
end_time=$(date +%s%N)
duration=$(( (end_time - start_time) / 1000000 ))
echo "Temps login: ${duration}ms"

echo "📊 Temps de réponse API auth:"
start_time=$(date +%s%N)
curl -s -X POST -H "Content-Type: application/json" -d '{"email":"test","password":"test"}' "$BASE_URL/api/auth/login" > /dev/null
end_time=$(date +%s%N)
duration=$(( (end_time - start_time) / 1000000 ))
echo "Temps API auth: ${duration}ms"

echo "📊 Temps de réponse dashboard:"
start_time=$(date +%s%N)
curl -s "$BASE_URL/dashboard" > /dev/null
end_time=$(date +%s%N)
duration=$(( (end_time - start_time) / 1000000 ))
echo "Temps dashboard: ${duration}ms"

echo ""
echo "🎯 RECOMMANDATIONS:"
echo "=================="

if [ ${duration:-1000} -gt 2000 ]; then
    echo "⚠️  Performance lente détectée (>${duration}ms)"
    echo "   • Vérifier la connexion Supabase"
    echo "   • Optimiser les requêtes dashboard"
    echo "   • Considérer la mise en cache"
else
    echo "✅ Performance acceptable (<2s)"
fi

echo ""
echo "📋 RÉSUMÉ"
echo "========="
echo "• Supabase: $(echo $supabase_test | grep -q success && echo 'OK' || echo 'KO')"
echo "• Dashboard: $(echo $dashboard_data | grep -q totalUsers && echo 'OK' || echo 'KO')"  
echo "• Auth vraies données: $(echo $auth_response | grep -q success && echo 'OK' || echo 'KO')"
echo "• Performance: $([ ${duration:-1000} -lt 2000 ] && echo 'OK' || echo 'Lente')"

echo ""
echo "🕒 Test terminé à: $(date)"
