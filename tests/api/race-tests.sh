#!/bin/bash

# 🏇 Tests des courses - Tunisia Jockey Club
# ===========================================

source "$(dirname "$0")/common.sh"

API_BASE_URL="http://localhost:3000"

init_test_suite "RACE MANAGEMENT TESTS"

# Variables pour les tests
TEST_RACE_ID=""
SAMPLE_RACE_DATA='{
    "name": "Test Championship Race",
    "date": "2025-12-15",
    "time": "15:30",
    "distance": 1600,
    "maxParticipants": 16,
    "prize": 25000,
    "category": "groupe1",
    "track": "main",
    "description": "Test race for API validation"
}'

# Test 1: Récupération de toutes les courses
print_subtitle "Listing and Retrieval Tests"

log_info "Test 1: Get all races"
response=$(api_call "GET" "/api/races")
check_response "$response" "200" "Get all races"

# Valider que la réponse contient un array
response_body=$(echo "$response" | sed -e 's/HTTPSTATUS:.*//g')
if echo "$response_body" | grep -q '\[.*\]'; then
    test_result 0 "Response contains array format"
else
    test_result 1 "Response format validation" "Expected array format"
fi

# Test 2: Récupération avec filtres
log_info "Test 2: Get races with filters"
response=$(api_call "GET" "/api/races?category=groupe1&limit=5")
check_response "$response" "200" "Get races with category filter"

response=$(api_call "GET" "/api/races?date=2025-12-15")
check_response "$response" "200" "Get races with date filter"

response=$(api_call "GET" "/api/races?upcoming=true")
check_response "$response" "200" "Get upcoming races"

# Test 3: Pagination
log_info "Test 3: Pagination tests"
response=$(api_call "GET" "/api/races?page=1&limit=10")
check_response "$response" "200" "Pagination - page 1"

response=$(api_call "GET" "/api/races?page=999&limit=10")
check_response "$response" "200" "Pagination - high page number"

# Test 4: Création d'une nouvelle course
print_subtitle "Race Creation Tests"

log_info "Test 4: Create new race"
response=$(api_call "POST" "/api/races" "$SAMPLE_RACE_DATA")
check_response "$response" "201" "Create new race"

# Extraire l'ID de la course créée
response_body=$(echo "$response" | sed -e 's/HTTPSTATUS:.*//g')
TEST_RACE_ID=$(extract_json_value "$response_body" "id")
log_info "Created race ID: $TEST_RACE_ID"

# Test 5: Validation des données lors de la création
log_info "Test 5: Race creation validation"

# Date manquante
invalid_race1='{
    "name": "Invalid Race",
    "time": "15:30",
    "distance": 1600
}'
response=$(api_call "POST" "/api/races" "$invalid_race1")
check_response "$response" "400" "Create race without date"

# Distance invalide
invalid_race2='{
    "name": "Invalid Race",
    "date": "2025-12-15",
    "time": "15:30",
    "distance": 200
}'
response=$(api_call "POST" "/api/races" "$invalid_race2")
check_response "$response" "400" "Create race with invalid distance"

# Catégorie invalide
invalid_race3='{
    "name": "Invalid Race",
    "date": "2025-12-15",
    "time": "15:30",
    "distance": 1600,
    "category": "invalid_category"
}'
response=$(api_call "POST" "/api/races" "$invalid_race3")
check_response "$response" "400" "Create race with invalid category"

# Date dans le passé
invalid_race4='{
    "name": "Invalid Race",
    "date": "2020-01-01",
    "time": "15:30",
    "distance": 1600,
    "category": "groupe1"
}'
response=$(api_call "POST" "/api/races" "$invalid_race4")
check_response "$response" "400" "Create race with past date"

# Test 6: Récupération d'une course spécifique
print_subtitle "Individual Race Tests"

if [ -n "$TEST_RACE_ID" ]; then
    log_info "Test 6: Get specific race"
    response=$(api_call "GET" "/api/races/$TEST_RACE_ID")
    check_response "$response" "200" "Get race by ID"
    
    # Vérifier que les données correspondent
    response_body=$(echo "$response" | sed -e 's/HTTPSTATUS:.*//g')
    race_name=$(extract_json_value "$response_body" "name")
    if [ "$race_name" = "Test Championship Race" ]; then
        test_result 0 "Race data integrity"
    else
        test_result 1 "Race data integrity" "Name mismatch: $race_name"
    fi
else
    test_result 1 "Get specific race" "No race ID available"
fi

# Test 7: Course inexistante
log_info "Test 7: Get non-existent race"
response=$(api_call "GET" "/api/races/99999")
check_response "$response" "404" "Get non-existent race"

# Test 8: Mise à jour d'une course
print_subtitle "Race Update Tests"

if [ -n "$TEST_RACE_ID" ]; then
    log_info "Test 8: Update race"
    update_data='{
        "name": "Updated Test Race",
        "prize": 30000,
        "description": "Updated description"
    }'
    
    response=$(api_call "PUT" "/api/races/$TEST_RACE_ID" "$update_data")
    check_response "$response" "200" "Update race"
    
    # Vérifier la mise à jour
    response=$(api_call "GET" "/api/races/$TEST_RACE_ID")
    response_body=$(echo "$response" | sed -e 's/HTTPSTATUS:.*//g')
    updated_name=$(extract_json_value "$response_body" "name")
    
    if [ "$updated_name" = "Updated Test Race" ]; then
        test_result 0 "Race update verification"
    else
        test_result 1 "Race update verification" "Update not applied"
    fi
else
    test_result 1 "Update race" "No race ID available"
fi

# Test 9: Tests des participants
print_subtitle "Race Participants Tests"

if [ -n "$TEST_RACE_ID" ]; then
    log_info "Test 9: Get race participants"
    response=$(api_call "GET" "/api/races/$TEST_RACE_ID/participants")
    check_response "$response" "200" "Get race participants"
    
    # Ajouter un participant
    participant_data='{
        "horseName": "Test Horse",
        "jockeyName": "Test Jockey",
        "number": 1,
        "odds": 5.5
    }'
    
    response=$(api_call "POST" "/api/races/$TEST_RACE_ID/participants" "$participant_data")
    check_response "$response" "201" "Add race participant"
else
    test_result 1 "Race participants tests" "No race ID available"
fi

# Test 10: Tests de recherche
print_subtitle "Race Search Tests"

log_info "Test 10: Search races"
response=$(api_call "GET" "/api/races/search?q=Test")
check_response "$response" "200" "Search races by name"

response=$(api_call "GET" "/api/races/search?distance=1600")
check_response "$response" "200" "Search races by distance"

response=$(api_call "GET" "/api/races/search?prize_min=20000")
check_response "$response" "200" "Search races by minimum prize"

# Test 11: Tests de performance
print_subtitle "Performance Tests"

performance_test "GET" "/api/races" "Get all races performance" 1000
performance_test "GET" "/api/races?limit=100" "Get races with large limit" 2000

if [ -n "$TEST_RACE_ID" ]; then
    performance_test "GET" "/api/races/$TEST_RACE_ID" "Get single race performance" 500
fi

# Test 12: Tests de sécurité
print_subtitle "Security Tests"

# Test injection SQL
security_test "GET" "/api/races?category=groupe1'; DROP TABLE races; --" "" "SQL Injection in category filter" "400"

# Test XSS dans la création
xss_payload='{
    "name": "<script>alert(\"XSS\")</script>",
    "date": "2025-12-15",
    "time": "15:30",
    "distance": 1600,
    "category": "groupe1"
}'
security_test "POST" "/api/races" "$xss_payload" "XSS in race name" "400"

# Test données excessivement longues
long_name=$(printf 'A%.0s' {1..1000})
long_name_payload='{
    "name": "'$long_name'",
    "date": "2025-12-15",
    "time": "15:30",
    "distance": 1600,
    "category": "groupe1"
}'
security_test "POST" "/api/races" "$long_name_payload" "Excessively long race name" "400"

# Test 13: Tests de limites
print_subtitle "Boundary Tests"

log_info "Test 13: Boundary value tests"

# Distance minimale et maximale
min_distance_race='{
    "name": "Min Distance Race",
    "date": "2025-12-15",
    "time": "15:30",
    "distance": 800,
    "category": "groupe1"
}'
response=$(api_call "POST" "/api/races" "$min_distance_race")
check_response "$response" "201" "Race with minimum distance (800m)"

max_distance_race='{
    "name": "Max Distance Race",
    "date": "2025-12-15",
    "time": "15:30",
    "distance": 5000,
    "category": "groupe1"
}'
response=$(api_call "POST" "/api/races" "$max_distance_race")
check_response "$response" "201" "Race with maximum distance (5000m)"

# Prix maximum
max_prize_race='{
    "name": "Max Prize Race",
    "date": "2025-12-15",
    "time": "15:30",
    "distance": 1600,
    "category": "groupe1",
    "prize": 1000000
}'
response=$(api_call "POST" "/api/races" "$max_prize_race")
check_response "$response" "201" "Race with maximum prize"

# Test 14: Suppression (si implémentée)
print_subtitle "Race Deletion Tests"

if [ -n "$TEST_RACE_ID" ]; then
    log_info "Test 14: Delete race"
    response=$(api_call "DELETE" "/api/races/$TEST_RACE_ID")
    # Accepter 200 (supprimé) ou 404 (pas implémenté)
    http_status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    if [ "$http_status" = "200" ] || [ "$http_status" = "204" ] || [ "$http_status" = "404" ]; then
        test_result 0 "Delete race endpoint"
    else
        test_result 1 "Delete race endpoint" "Unexpected status: $http_status"
    fi
else
    test_result 1 "Delete race" "No race ID available"
fi

# Nettoyage
cleanup_test_data

print_summary
