#!/bin/bash

# 🏇 Tests d'authentification - Tunisia Jockey Club
# =================================================

source "$(dirname "$0")/common.sh"

API_BASE_URL="http://localhost:3000"

print_title "AUTHENTICATION TESTS"

# Variables de test
TEST_EMAIL="auth-test@tunisia-jockey-club.tn"
TEST_PASSWORD="TestAuth123!"
INVALID_EMAIL="invalid@test.com"
INVALID_PASSWORD="wrongpass"

# Test 1: Inscription d'un nouvel utilisateur
echo -e "\n${YELLOW}🧪 Test 1: User Registration${NC}"

register_payload='{
  "email": "'$TEST_EMAIL'",
  "password": "'$TEST_PASSWORD'",
  "firstName": "Test",
  "lastName": "User",
  "confirmPassword": "'$TEST_PASSWORD'"
}'

echo "POST /auth/register"
response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -d "$register_payload" \
  "$API_BASE_URL/auth/register")

check_response "$response" "201" "User registration successful"

# Test 2: Connexion avec des identifiants valides
echo -e "\n${YELLOW}🧪 Test 2: Valid Login${NC}"

login_payload='{
  "email": "'$TEST_EMAIL'",
  "password": "'$TEST_PASSWORD'"
}'

echo "POST /auth/login"
response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -d "$login_payload" \
  "$API_BASE_URL/auth/login")

check_response "$response" "200" "Valid login successful"

# Extraire le token de session ou cookie pour les tests suivants
session_data=$(echo $response | sed -e 's/HTTPSTATUS:.*//g')

# Test 3: Connexion avec email invalide
echo -e "\n${YELLOW}🧪 Test 3: Invalid Email Login${NC}"

invalid_login_payload='{
  "email": "'$INVALID_EMAIL'",
  "password": "'$TEST_PASSWORD'"
}'

echo "POST /auth/login"
response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -d "$invalid_login_payload" \
  "$API_BASE_URL/auth/login")

check_response "$response" "401" "Invalid email login rejected"

# Test 4: Connexion avec mot de passe invalide
echo -e "\n${YELLOW}🧪 Test 4: Invalid Password Login${NC}"

invalid_password_payload='{
  "email": "'$TEST_EMAIL'",
  "password": "'$INVALID_PASSWORD'"
}'

echo "POST /auth/login"
response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -d "$invalid_password_payload" \
  "$API_BASE_URL/auth/login")

check_response "$response" "401" "Invalid password login rejected"

# Test 5: Validation des données d'inscription
echo -e "\n${YELLOW}🧪 Test 5: Registration Validation${NC}"

# Email manquant
invalid_register1='{
  "password": "'$TEST_PASSWORD'",
  "firstName": "Test",
  "lastName": "User"
}'

echo "POST /auth/register (missing email)"
response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -d "$invalid_register1" \
  "$API_BASE_URL/auth/register")

check_response "$response" "400" "Missing email validation"

# Mot de passe trop faible
weak_password_register='{
  "email": "weak@test.com",
  "password": "123",
  "firstName": "Test",
  "lastName": "User"
}'

echo "POST /auth/register (weak password)"
response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -d "$weak_password_register" \
  "$API_BASE_URL/auth/register")

check_response "$response" "400" "Weak password validation"

# Test 6: Double inscription avec même email
echo -e "\n${YELLOW}🧪 Test 6: Duplicate Email Registration${NC}"

echo "POST /auth/register (duplicate email)"
response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -d "$register_payload" \
  "$API_BASE_URL/auth/register")

check_response "$response" "409" "Duplicate email registration rejected"

# Test 7: Déconnexion
echo -e "\n${YELLOW}🧪 Test 7: User Logout${NC}"

echo "POST /auth/logout"
response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  "$API_BASE_URL/auth/logout")

check_response "$response" "200" "User logout successful"

# Test 8: Test de sécurité - Brute force protection
echo -e "\n${YELLOW}🧪 Test 8: Brute Force Protection${NC}"

echo "Testing multiple failed login attempts..."
brute_force_blocked=false

for i in {1..10}; do
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
      -X POST \
      -H "Content-Type: application/json" \
      -d "$invalid_password_payload" \
      "$API_BASE_URL/auth/login")
    
    http_status=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    
    if [ "$http_status" = "429" ]; then
        brute_force_blocked=true
        break
    fi
    
    sleep 0.1
done

if [ "$brute_force_blocked" = true ]; then
    test_result 0 "Brute force protection active"
else
    test_result 1 "Brute force protection" "Not blocked after 10 attempts"
fi

# Test 9: Test de récupération de mot de passe
echo -e "\n${YELLOW}🧪 Test 9: Password Recovery${NC}"

password_recovery_payload='{
  "email": "'$TEST_EMAIL'"
}'

echo "POST /auth/forgot-password"
response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -d "$password_recovery_payload" \
  "$API_BASE_URL/auth/forgot-password")

# Accepter 200 (réussi) ou 404 (pas implémenté)
http_status=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
if [ "$http_status" = "200" ] || [ "$http_status" = "404" ]; then
    test_result 0 "Password recovery endpoint"
else
    test_result 1 "Password recovery endpoint" "Unexpected status: $http_status"
fi

# Test 10: Validation des tokens JWT (si applicable)
echo -e "\n${YELLOW}🧪 Test 10: Token Validation${NC}"

# Tenter d'accéder à une route protégée sans token
echo "GET /api/profile (no token)"
response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
  -X GET \
  "$API_BASE_URL/api/profile")

check_response "$response" "401" "Protected route without token"

# Tenter avec un token invalide
echo "GET /api/profile (invalid token)"
response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
  -X GET \
  -H "Authorization: Bearer invalid_token_here" \
  "$API_BASE_URL/api/profile")

check_response "$response" "401" "Protected route with invalid token"

print_summary
