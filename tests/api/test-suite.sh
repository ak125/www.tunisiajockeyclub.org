#!/bin/bash

# 🏇 Tunisia Jockey Club - Tests API cURL
# =====================================

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_BASE_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:5173"
TEST_USER_EMAIL="test@tunisia-jockey-club.tn"
TEST_USER_PASSWORD="TestPassword123!"

# Compteurs
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Fonction pour afficher les titres
print_title() {
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}🏇 $1${NC}"
    echo -e "${BLUE}================================================${NC}"
}

# Fonction pour afficher les résultats de test
test_result() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if [ $1 -eq 0 ]; then
        PASSED_TESTS=$((PASSED_TESTS + 1))
        echo -e "${GREEN}✅ PASS: $2${NC}"
    else
        FAILED_TESTS=$((FAILED_TESTS + 1))
        echo -e "${RED}❌ FAIL: $2${NC}"
        echo -e "${RED}   Response: $3${NC}"
    fi
}

# Fonction pour tester une route
test_route() {
    local method=$1
    local endpoint=$2
    local expected_status=$3
    local description=$4
    local data=$5
    
    echo -e "\n${YELLOW}🧪 Testing: $description${NC}"
    echo "   $method $endpoint"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$API_BASE_URL$endpoint")
    else
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X $method "$API_BASE_URL$endpoint")
    fi
    
    http_status=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    response_body=$(echo $response | sed -e 's/HTTPSTATUS:.*//g')
    
    if [ "$http_status" = "$expected_status" ]; then
        test_result 0 "$description"
        echo -e "   Status: ${GREEN}$http_status${NC}"
    else
        test_result 1 "$description" "Expected $expected_status, got $http_status"
        echo -e "   Status: ${RED}$http_status${NC} (expected $expected_status)"
    fi
    
    # Afficher le body de la réponse si ce n'est pas trop long
    if [ ${#response_body} -lt 200 ] && [ -n "$response_body" ]; then
        echo -e "   Response: $response_body"
    fi
}

# Fonction pour tester les routes frontend
test_frontend_route() {
    local endpoint=$1
    local expected_status=$2
    local description=$3
    
    echo -e "\n${YELLOW}🧪 Testing Frontend: $description${NC}"
    echo "   GET $endpoint"
    
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X GET "$FRONTEND_URL$endpoint")
    http_status=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    
    if [ "$http_status" = "$expected_status" ]; then
        test_result 0 "$description"
        echo -e "   Status: ${GREEN}$http_status${NC}"
    else
        test_result 1 "$description" "Expected $expected_status, got $http_status"
        echo -e "   Status: ${RED}$http_status${NC} (expected $expected_status)"
    fi
}

# Démarrage des tests
clear
print_title "TUNISIA JOCKEY CLUB - API TESTS"

echo -e "${YELLOW}🚀 Starting API tests...${NC}"
echo "API Base URL: $API_BASE_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""

# Test 1: Santé de l'API Backend
print_title "1. BACKEND HEALTH CHECKS"

test_route "GET" "/health" "200" "Backend Health Check"
test_route "GET" "/api/health" "200" "API Health Check"

# Test 2: Routes d'authentification
print_title "2. AUTHENTICATION ROUTES"

# Test login endpoint
login_data='{
    "email": "'$TEST_USER_EMAIL'",
    "password": "'$TEST_USER_PASSWORD'"
}'

test_route "POST" "/auth/login" "200" "User Login" "$login_data"

# Test register endpoint
register_data='{
    "email": "newuser@tunisia-jockey-club.tn",
    "password": "NewPassword123!",
    "firstName": "Test",
    "lastName": "User"
}'

test_route "POST" "/auth/register" "201" "User Registration" "$register_data"

# Test logout
test_route "POST" "/auth/logout" "200" "User Logout"

# Test 3: Routes des courses
print_title "3. RACE MANAGEMENT ROUTES"

test_route "GET" "/api/races" "200" "Get All Races"
test_route "GET" "/api/races/1" "200" "Get Race by ID"

# Créer une nouvelle course
race_data='{
    "name": "Test Race",
    "date": "2025-12-01",
    "time": "14:30",
    "distance": 1200,
    "maxParticipants": 12,
    "prize": 5000,
    "category": "groupe2",
    "track": "main"
}'

test_route "POST" "/api/races" "201" "Create New Race" "$race_data"

# Test 4: Routes des utilisateurs
print_title "4. USER MANAGEMENT ROUTES"

test_route "GET" "/api/users/profile" "200" "Get User Profile"
test_route "GET" "/api/users/stats" "200" "Get User Statistics"

# Mise à jour du profil
profile_data='{
    "firstName": "Updated",
    "lastName": "Name",
    "phone": "+216 98 765 432"
}'

test_route "PUT" "/api/users/profile" "200" "Update User Profile" "$profile_data"

# Test 5: Routes des paris
print_title "5. BETTING ROUTES"

test_route "GET" "/api/bets" "200" "Get All Bets"

# Placer un pari
bet_data='{
    "raceId": "1",
    "horseId": "1",
    "amount": 50,
    "type": "win"
}'

test_route "POST" "/api/bets" "201" "Place New Bet" "$bet_data"

# Test 6: Routes d'administration
print_title "6. ADMIN ROUTES"

test_route "GET" "/api/admin/users" "200" "Get All Users (Admin)"
test_route "GET" "/api/admin/races" "200" "Get All Races (Admin)"
test_route "GET" "/api/admin/stats" "200" "Get System Statistics (Admin)"

# Test 7: Routes Frontend
print_title "7. FRONTEND ROUTES"

test_frontend_route "/" "200" "Homepage"
test_frontend_route "/login" "200" "Login Page"
test_frontend_route "/register" "200" "Register Page"
test_frontend_route "/dashboard" "200" "Dashboard Page"
test_frontend_route "/profile" "200" "Profile Page"
test_frontend_route "/race-management" "200" "Race Management Page"
test_frontend_route "/statistics" "200" "Statistics Page"
test_frontend_route "/admin" "200" "Admin Page"

# Test 8: Tests de performance
print_title "8. PERFORMANCE TESTS"

echo -e "\n${YELLOW}🧪 Testing: API Response Time${NC}"
start_time=$(date +%s%N)
curl -s "$API_BASE_URL/api/races" > /dev/null
end_time=$(date +%s%N)
response_time=$(( (end_time - start_time) / 1000000 ))

if [ $response_time -lt 1000 ]; then
    test_result 0 "API Response Time ($response_time ms)"
else
    test_result 1 "API Response Time ($response_time ms)" "Too slow"
fi

# Test 9: Tests de sécurité
print_title "9. SECURITY TESTS"

# Test injection SQL
test_route "GET" "/api/races?id=1' OR '1'='1" "400" "SQL Injection Protection"

# Test XSS
xss_data='{"name": "<script>alert(\"XSS\")</script>"}'
test_route "POST" "/api/races" "400" "XSS Protection" "$xss_data"

# Test rate limiting (faire plusieurs requêtes rapidement)
echo -e "\n${YELLOW}🧪 Testing: Rate Limiting${NC}"
rate_limit_passed=true
for i in {1..20}; do
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$API_BASE_URL/api/races")
    http_status=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    if [ "$http_status" = "429" ]; then
        rate_limit_passed=true
        break
    fi
done

if [ "$rate_limit_passed" = true ]; then
    test_result 0 "Rate Limiting Protection"
else
    test_result 1 "Rate Limiting Protection" "Rate limiting not working"
fi

# Résumé final
print_title "TEST RESULTS SUMMARY"

echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}🎉 ALL TESTS PASSED! 🎉${NC}"
    exit 0
else
    echo -e "\n${RED}❌ SOME TESTS FAILED${NC}"
    echo -e "Success Rate: $((PASSED_TESTS * 100 / TOTAL_TESTS))%"
    exit 1
fi
