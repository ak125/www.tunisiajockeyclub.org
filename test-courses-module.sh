#!/bin/bash

# 🏇 TEST MODULE COURSES - Tunisia Jockey Club
# Test du nouveau module de gestion des courses

BASE_URL="http://localhost:3000/api"

echo "🏁 === TEST MODULE COURSES - TUNISIA JOCKEY CLUB ==="
echo "📅 $(date)"
echo ""

# ================================================================
# TEST 1: STATISTIQUES DES COURSES
# ================================================================
echo "📊 === STATISTIQUES COURSES ==="
echo "🧪 Test endpoint stats..."
stats_response=$(curl -s "$BASE_URL/courses/stats")
if echo "$stats_response" | jq -e '.totalCourses' >/dev/null 2>&1; then
    total=$(echo "$stats_response" | jq -r '.totalCourses')
    upcoming=$(echo "$stats_response" | jq -r '.upcomingCourses')
    echo "✅ Stats courses: $total total, $upcoming à venir"
else
    echo "❌ Stats courses indisponibles"
fi

# ================================================================
# TEST 2: LISTE DES COURSES
# ================================================================
echo ""
echo "📋 === LISTE COURSES ==="
echo "🧪 Test endpoint liste..."
courses_response=$(curl -s "$BASE_URL/courses?page=1&limit=5")
if echo "$courses_response" | jq -e '.courses' >/dev/null 2>&1; then
    count=$(echo "$courses_response" | jq -r '.pagination.count')
    total=$(echo "$courses_response" | jq -r '.pagination.totalRecords')
    echo "✅ Liste courses: $count affichées sur $total total"
    
    # Afficher le nom de la première course si elle existe
    if [[ "$count" -gt "0" ]]; then
        first_course=$(echo "$courses_response" | jq -r '.courses[0].name // "Sans nom"')
        echo "   📌 Première course: $first_course"
    fi
else
    echo "❌ Liste courses indisponible"
fi

# ================================================================
# TEST 3: CRÉATION D'UNE COURSE (AUTH REQUIS)
# ================================================================
echo ""
echo "🏗️  === CRÉATION COURSE ==="
echo "🧪 Test création course..."

# D'abord, s'authentifier
echo "🔐 Authentification..."
auth_response=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email": "admin@tjc.tn", "password": "admin123"}')

if echo "$auth_response" | jq -e '.success' >/dev/null 2>&1; then
    echo "✅ Authentification réussie"
    
    # Créer une course test
    echo "🧪 Création course test..."
    future_date=$(date -d "+7 days" -Iseconds)
    registration_deadline=$(date -d "+3 days" -Iseconds)
    
    create_course_data='{
      "name": "Course Test Tunisia Jockey Club",
      "date": "'$future_date'",
      "location": "Hippodrome de Kassar Said",
      "distance": 1600,
      "prize": 50000,
      "category": "GROUP_3",
      "surface": "TURF",
      "maxParticipants": 12,
      "registrationDeadline": "'$registration_deadline'"
    }'
    
    create_response=$(curl -s -X POST "$BASE_URL/courses" \
        -H "Content-Type: application/json" \
        -d "$create_course_data")
    
    if echo "$create_response" | jq -e '.success' >/dev/null 2>&1; then
        course_id=$(echo "$create_response" | jq -r '.course.id')
        echo "✅ Course créée: ID $course_id"
        
        # Test de récupération de la course créée
        echo "🧪 Récupération course créée..."
        get_course_response=$(curl -s "$BASE_URL/courses/$course_id")
        if echo "$get_course_response" | jq -e '.id' >/dev/null 2>&1; then
            course_name=$(echo "$get_course_response" | jq -r '.name')
            echo "✅ Course récupérée: $course_name"
        else
            echo "❌ Impossible de récupérer la course créée"
        fi
    else
        echo "❌ Création course échouée"
        echo "$create_response" | jq -r '.message // "Erreur inconnue"'
    fi
else
    echo "❌ Authentification échouée - Tests création ignorés"
fi

# ================================================================
# TEST 4: VALIDATION DES DONNÉES
# ================================================================
echo ""
echo "🛡️  === VALIDATION ZOD ==="
echo "🧪 Test validation données invalides..."

if echo "$auth_response" | jq -e '.success' >/dev/null 2>&1; then
    invalid_course_data='{
      "name": "X",
      "date": "invalid-date",
      "distance": -100,
      "prize": 0,
      "category": "INVALID_CATEGORY"
    }'
    
    validation_response=$(curl -s -X POST "$BASE_URL/courses" \
        -H "Content-Type: application/json" \
        -d "$invalid_course_data" \
        -w "%{http_code}")
    
    validation_code="${validation_response: -3}"
    if [[ "$validation_code" == "400" ]]; then
        echo "✅ Validation Zod: Données invalides rejetées"
    else
        echo "⚠️  Validation: Code $validation_code"
    fi
else
    echo "⏩ Test validation ignoré (pas d'auth)"
fi

# ================================================================
# TEST 5: PERFORMANCE
# ================================================================
echo ""
echo "⚡ === PERFORMANCE ==="
echo "🧪 Test temps de réponse stats..."
start_time=$(date +%s%3N)
curl -s "$BASE_URL/courses/stats" >/dev/null
end_time=$(date +%s%3N)
response_time=$((end_time - start_time))

if [[ "$response_time" -lt "500" ]]; then
    echo "✅ Performance stats: ${response_time}ms (excellent)"
elif [[ "$response_time" -lt "1000" ]]; then
    echo "✅ Performance stats: ${response_time}ms (bon)"
else
    echo "⚠️  Performance stats: ${response_time}ms (à optimiser)"
fi

# ================================================================
# BILAN FINAL
# ================================================================
echo ""
echo "🏆 === BILAN MODULE COURSES ==="
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Calcul du score
score=0

# Stats (25 points)
if echo "$stats_response" | jq -e '.totalCourses' >/dev/null 2>&1; then
    score=$((score + 25))
    echo "🟢 Statistiques: 25/25"
else
    echo "🔴 Statistiques: 0/25"
fi

# Liste (25 points)
if echo "$courses_response" | jq -e '.courses' >/dev/null 2>&1; then
    score=$((score + 25))
    echo "🟢 Liste courses: 25/25"
else
    echo "🔴 Liste courses: 0/25"
fi

# Création (25 points)
if echo "$create_response" | jq -e '.success' >/dev/null 2>&1; then
    score=$((score + 25))
    echo "🟢 Création: 25/25"
else
    echo "🔴 Création: 0/25"
fi

# Performance (25 points)
if [[ "$response_time" -lt "500" ]]; then
    score=$((score + 25))
    echo "🟢 Performance: 25/25"
elif [[ "$response_time" -lt "1000" ]]; then
    score=$((score + 15))
    echo "🟡 Performance: 15/25"
else
    score=$((score + 5))
    echo "🔴 Performance: 5/25"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 SCORE MODULE COURSES: $score/100"

if [[ "$score" -ge "90" ]]; then
    echo "🎉 EXCELLENT! Module prêt pour production"
    echo "🚀 Status: MODULE READY ✅"
elif [[ "$score" -ge "70" ]]; then
    echo "👍 TRÈS BON! Quelques ajustements mineurs"
    echo "🔧 Status: READY WITH IMPROVEMENTS"
else
    echo "⚠️  Module nécessite des corrections"
    echo "🛠️  Status: NEEDS WORK"
fi

echo ""
echo "🏁 Test Module Courses terminé à $(date)"
