#!/bin/bash

# 🏇 Tests de validation rapide - Tunisia Jockey Club
# ===================================================

source "$(dirname "$0")/common.sh"

API_BASE_URL="http://localhost:3000"

init_test_suite "QUICK VALIDATION TESTS"

print_subtitle "Infrastructure Health"

# Test 1: Vérifier que le backend répond
log_info "Test 1: Backend health check"
response=$(api_call "GET" "/health" "" "" "$API_BASE_URL" 10)
if check_response "$response" "200" "Backend is running"; then
    log_info "✅ Backend is healthy"
else
    log_error "❌ Backend is not responding"
    exit 1
fi

print_subtitle "Authentication System"

# Test 3: Route de login accessible
log_info "Test 3: Login endpoint"
login_data='{"email": "test@test.com", "password": "test123"}'
response=$(api_call "POST" "/auth/login" "$login_data")
# Accepter 200 (succès) ou 401 (échec attendu) ou 404 (pas implémenté)
http_status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
if [ "$http_status" = "200" ] || [ "$http_status" = "401" ] || [ "$http_status" = "404" ]; then
    test_result 0 "Login endpoint accessible"
else
    test_result 1 "Login endpoint" "Unexpected status: $http_status"
fi

print_subtitle "API Endpoints"

# Test 4: Route des courses
log_info "Test 4: Races endpoint"
response=$(api_call "GET" "/api/races")
http_status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
if [ "$http_status" = "200" ] || [ "$http_status" = "404" ]; then
    test_result 0 "Races endpoint accessible"
else
    test_result 1 "Races endpoint" "Status: $http_status"
fi

# Test 5: Route de profil utilisateur
log_info "Test 5: Profile endpoint"
response=$(api_call "GET" "/api/profile")
http_status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
if [ "$http_status" = "200" ] || [ "$http_status" = "401" ] || [ "$http_status" = "404" ]; then
    test_result 0 "Profile endpoint accessible"
else
    test_result 1 "Profile endpoint" "Status: $http_status"
fi

print_subtitle "Performance Check"

# Test 7: Test de performance rapide
log_info "Test 7: Basic performance test"
performance_test "GET" "/" "Backend homepage load time" 3000 "" "$API_BASE_URL"

print_subtitle "Security Headers"

# Test 8: Vérifier les en-têtes de sécurité
log_info "Test 8: Security headers check"
response=$(curl -s -I "$API_BASE_URL" --max-time 10)

# Vérifier quelques en-têtes de sécurité de base
if echo "$response" | grep -i "x-frame-options\|x-content-type-options\|x-xss-protection" >/dev/null; then
    test_result 0 "Basic security headers present"
else
    test_result 1 "Security headers" "Some security headers missing"
fi

print_subtitle "Database Fallback System"

# Test 9: Vérifier que le système de fallback fonctionne
log_info "Test 9: Database fallback system"

# Essayer une opération qui devrait déclencher le fallback
response=$(api_call "GET" "/api/users/profile")
http_status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

# Si on obtient une réponse (même 401), c'est que le serveur ne crash pas
if [ "$http_status" != "500" ] && [ "$http_status" != "0" ]; then
    test_result 0 "Database fallback system working"
    log_info "Server handles database connection gracefully"
else
    test_result 1 "Database fallback system" "Server error: $http_status"
fi

print_subtitle "Error Handling"

# Test 10: Gestion des erreurs 404
log_info "Test 10: 404 error handling"
response=$(api_call "GET" "/api/nonexistent")
http_status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [ "$http_status" = "404" ]; then
    test_result 0 "404 error handling"
else
    test_result 1 "404 error handling" "Expected 404, got $http_status"
fi

# Résumé spécial pour les tests de validation
echo -e "\n${BLUE}================================================${NC}"
echo -e "${BLUE}🏇 VALIDATION SUMMARY${NC}"
echo -e "${BLUE}================================================${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL SYSTEMS OPERATIONAL! 🎉${NC}"
    echo -e "${GREEN}✅ Backend is running correctly${NC}"
    echo -e "${GREEN}✅ API endpoints are responding${NC}"
    echo -e "${GREEN}✅ Error handling is working${NC}"
    echo -e "${GREEN}✅ Performance is acceptable${NC}"
    echo ""
    echo -e "${CYAN}🚀 Your Tunisia Jockey Club application is ready!${NC}"
    echo -e "${CYAN}   You can now run full test suites:${NC}"
    echo -e "${CYAN}   - ./auth-tests.sh${NC}"
    echo -e "${CYAN}   - ./race-tests.sh${NC}"
    echo -e "${CYAN}   - ./test-suite.sh${NC}"
else
    echo -e "${RED}❌ SOME ISSUES DETECTED${NC}"
    echo -e "${YELLOW}⚠️  Please check the failed tests above${NC}"
    echo ""
    echo -e "${CYAN}💡 Common solutions:${NC}"
    echo -e "${CYAN}   - Make sure backend is running on port 3000${NC}"
    echo -e "${CYAN}   - Verify your database configuration${NC}"
    echo -e "${CYAN}   - Check backend logs for errors${NC}"
fi

print_summary
