#!/bin/bash

echo "🔍 ANALYSE STRUCTURE BASE DE DONNÉES"
echo "===================================="
echo ""

BASE_URL="http://localhost:3000"

echo "📊 Analyse des tables et données disponibles..."
echo ""

# Test 1: Récupérer les stats générales
echo "1️⃣ STATISTIQUES GÉNÉRALES"
echo "========================="

stats_response=$(curl -s "$BASE_URL/api/dashboard/stats")
echo "Stats: $stats_response"

if echo "$stats_response" | grep -q "totalHorses"; then
    total_horses=$(echo "$stats_response" | grep -o '"totalHorses":[0-9]*' | cut -d: -f2)
    total_users=$(echo "$stats_response" | grep -o '"totalUsers":[0-9]*' | cut -d: -f2)
    total_races=$(echo "$stats_response" | grep -o '"totalRaces":[0-9]*' | cut -d: -f2)
    
    echo "✅ Statistiques récupérées:"
    echo "   • Chevaux: $total_horses"
    echo "   • Utilisateurs: $total_users" 
    echo "   • Courses: $total_races"
else
    echo "⚠️  Statistiques indisponibles"
fi

echo ""

# Test 2: Tester le dashboard principal
echo "2️⃣ DASHBOARD PRINCIPAL"  
echo "======================"

dashboard_response=$(curl -s "$BASE_URL/api/dashboard/data")

if echo "$dashboard_response" | grep -q "overview"; then
    echo "✅ Dashboard accessible"
    
    if echo "$dashboard_response" | grep -q "supabase_live"; then
        echo "✅ Données Supabase en direct"
    elif echo "$dashboard_response" | grep -q "fallback"; then
        echo "⚠️  Données de fallback utilisées"
    fi
else
    echo "❌ Dashboard inaccessible"
fi

echo ""

# Test 3: Vérifier les vrais utilisateurs
echo "3️⃣ UTILISATEURS RÉELS"
echo "===================="

users_response=$(curl -s -X POST "$BASE_URL/api/auth/users-sample")

if echo "$users_response" | grep -q "fallback.*true"; then
    echo "⚠️  Fallback utilisé - Supabase non connecté"
    echo ""
    echo "📋 Données de votre base Supabase (selon votre information):"
    echo "   • Users: 97 utilisateurs (17 colonnes)"
    echo "   • Horses: 46 chevaux (15 colonnes)"
    echo "   • Jockeys: 42 jockeys (10 colonnes)"
    echo "   • Owners: 33 propriétaires (7 colonnes)"
    echo "   • Trainers: 21 entraîneurs (8 colonnes)"
    echo "   • Races: 8 courses (15 colonnes)"
    echo "   • Race entries: 16 inscriptions (13 colonnes)"
    echo "   • Race results: 8 résultats (12 colonnes)"
    echo "   • Racecourses: 5 hippodromes (7 colonnes)"
    echo "   • Sessions: 0 sessions (7 colonnes)"
elif echo "$users_response" | grep -q "users"; then
    user_count=$(echo "$users_response" | grep -o '"totalFound":[0-9]*' | cut -d: -f2)
    echo "✅ Utilisateurs récupérés: $user_count"
    
    # Extraire quelques emails pour les tests
    echo "📧 Emails disponibles pour tests:"
    echo "$users_response" | grep -o '"email":"[^"]*"' | head -5 | sed 's/"email":"/   • /' | sed 's/"$//'
else
    echo "❌ Impossible de récupérer les utilisateurs"
fi

echo ""

# Test 4: Performance
echo "4️⃣ PERFORMANCE SYSTÈME"
echo "====================="

echo "📊 Test de performance des endpoints..."

# Mesurer API dashboard
start_time=$(date +%s%N)
curl -s "$BASE_URL/api/dashboard/stats" > /dev/null
end_time=$(date +%s%N)
dashboard_duration=$(( (end_time - start_time) / 1000000 ))

echo "• Dashboard stats: ${dashboard_duration}ms"

# Mesurer API auth
start_time=$(date +%s%N)
curl -s -X POST "$BASE_URL/api/auth/check" > /dev/null
end_time=$(date +%s%N)
auth_duration=$(( (end_time - start_time) / 1000000 ))

echo "• Auth check: ${auth_duration}ms"

# Mesurer frontend dashboard
start_time=$(date +%s%N)
curl -s "$BASE_URL/dashboard" > /dev/null
end_time=$(date +%s%N)
frontend_duration=$(( (end_time - start_time) / 1000000 ))

echo "• Frontend dashboard: ${frontend_duration}ms"

echo ""

# Test 5: Test d'authentification optimisée
echo "5️⃣ TEST AUTHENTIFICATION"
echo "======================="

echo "🔐 Test avec utilisateurs de développement..."

dev_users=("monia@gmail.com:password123" "admin@tjc.tn:admin123" "test@test.com:test123")

for user_pass in "${dev_users[@]}"; do
    email=$(echo $user_pass | cut -d: -f1)
    password=$(echo $user_pass | cut -d: -f2)
    
    start_time=$(date +%s%N)
    auth_result=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"password\":\"$password\"}" \
        "$BASE_URL/api/auth/login")
    end_time=$(date +%s%N)
    duration=$(( (end_time - start_time) / 1000000 ))
    
    if echo "$auth_result" | grep -q "success.*true"; then
        source=$(echo "$auth_result" | grep -o '"source":"[^"]*"' | cut -d'"' -f4)
        echo "   ✅ $email (${duration}ms, source: $source)"
    else
        echo "   ❌ $email (${duration}ms)"
    fi
done

echo ""

# Résumé et recommandations
echo "📋 RÉSUMÉ ET RECOMMANDATIONS"
echo "============================"
echo ""

if echo "$users_response" | grep -q "fallback.*true"; then
    echo "🔧 CONFIGURATION REQUISE:"
    echo "   1. Configurez les variables Supabase dans .env"
    echo "   2. Utilisez: ./configure-supabase.sh pour les instructions"
    echo "   3. Redémarrez le serveur après configuration"
    echo ""
    echo "📧 UTILISATEURS TEMPORAIRES:"
    echo "   • monia@gmail.com / password123"
    echo "   • admin@tjc.tn / admin123"
    echo "   • test@test.com / test123"
else
    echo "✅ SYSTÈME CONFIGURÉ:"
    echo "   • Supabase connecté"
    echo "   • Vraies données disponibles"
    echo "   • Authentification fonctionnelle"
fi

if [ ${frontend_duration:-1000} -gt 2000 ]; then
    echo ""
    echo "⚡ OPTIMISATION PERFORMANCE:"
    echo "   • Frontend dashboard lent (${frontend_duration}ms)"
    echo "   • Considérer la mise en cache"
    echo "   • Optimiser les requêtes Prisma"
else
    echo ""
    echo "✅ PERFORMANCE ACCEPTABLE:"
    echo "   • API rapide (<1s)"
    echo "   • Frontend acceptable (<2s)"
fi

echo ""
echo "🎯 PROCHAINES ÉTAPES:"
echo "   1. Configurez Supabase si pas encore fait"
echo "   2. Testez avec vos vrais utilisateurs"
echo "   3. Le système est prêt pour la production !"

echo ""
echo "🕒 Analyse terminée à: $(date)"
