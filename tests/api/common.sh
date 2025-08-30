#!/bin/bash

# 🏇 Fonctions communes pour les tests cURL - Tunisia Jockey Club
# ===============================================================

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Compteurs globaux
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Configuration par défaut
DEFAULT_TIMEOUT=30
MAX_RETRIES=3

# Fonction pour afficher les titres
print_title() {
    echo -e "\n${BLUE}================================================${NC}"
    echo -e "${BLUE}🏇 $1${NC}"
    echo -e "${BLUE}================================================${NC}"
}

# Fonction pour afficher les sous-titres
print_subtitle() {
    echo -e "\n${PURPLE}--- $1 ---${NC}"
}

# Fonction pour logger les informations
log_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# Fonction pour logger les avertissements
log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Fonction pour logger les erreurs
log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Fonction pour afficher les résultats de test
test_result() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if [ $1 -eq 0 ]; then
        PASSED_TESTS=$((PASSED_TESTS + 1))
        echo -e "${GREEN}✅ PASS: $2${NC}"
        [ -n "$3" ] && echo -e "   ${GREEN}$3${NC}"
    else
        FAILED_TESTS=$((FAILED_TESTS + 1))
        echo -e "${RED}❌ FAIL: $2${NC}"
        [ -n "$3" ] && echo -e "   ${RED}$3${NC}"
    fi
}

# Fonction pour vérifier une réponse cURL
check_response() {
    local response="$1"
    local expected_status="$2"
    local test_description="$3"
    local extra_validations="$4"
    
    # Extraire le statut HTTP et le corps de la réponse
    local http_status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    local response_body=$(echo "$response" | sed -e 's/HTTPSTATUS:.*//g')
    
    # Vérifier le statut HTTP
    if [ "$http_status" = "$expected_status" ]; then
        # Validations supplémentaires si spécifiées
        if [ -n "$extra_validations" ]; then
            eval "$extra_validations"
            local validation_result=$?
            test_result $validation_result "$test_description" "Status: $http_status"
        else
            test_result 0 "$test_description" "Status: $http_status"
        fi
        
        # Afficher le corps de la réponse si pas trop long
        if [ ${#response_body} -lt 300 ] && [ -n "$response_body" ] && [ "$response_body" != "null" ]; then
            echo -e "   Response: $(echo "$response_body" | head -c 200)"
        fi
    else
        test_result 1 "$test_description" "Expected status $expected_status, got $http_status"
        # Afficher la réponse d'erreur
        if [ -n "$response_body" ] && [ ${#response_body} -lt 500 ]; then
            echo -e "   Error Response: $response_body"
        fi
    fi
    
    return $([ "$http_status" = "$expected_status" ] && echo 0 || echo 1)
}

# Fonction pour faire un appel API avec retry
api_call() {
    local method="$1"
    local endpoint="$2"
    local data="$3"
    local headers="$4"
    local base_url="${5:-$API_BASE_URL}"
    local timeout="${6:-$DEFAULT_TIMEOUT}"
    
    local curl_cmd="curl -s -w 'HTTPSTATUS:%{http_code}' --max-time $timeout -X $method"
    
    # Ajouter les headers
    if [ -n "$headers" ]; then
        curl_cmd="$curl_cmd $headers"
    else
        curl_cmd="$curl_cmd -H 'Content-Type: application/json'"
    fi
    
    # Ajouter les données
    if [ -n "$data" ]; then
        curl_cmd="$curl_cmd -d '$data'"
    fi
    
    # Ajouter l'URL
    curl_cmd="$curl_cmd '$base_url$endpoint'"
    
    # Exécuter avec retry
    local attempt=1
    local response=""
    
    while [ $attempt -le $MAX_RETRIES ]; do
        response=$(eval $curl_cmd 2>/dev/null)
        local exit_code=$?
        
        if [ $exit_code -eq 0 ]; then
            echo "$response"
            return 0
        fi
        
        log_warning "Attempt $attempt failed, retrying..."
        attempt=$((attempt + 1))
        sleep 1
    done
    
    log_error "All $MAX_RETRIES attempts failed"
    echo "HTTPSTATUS:0"
    return 1
}

# Fonction pour valider JSON
validate_json() {
    local json_string="$1"
    echo "$json_string" | python3 -m json.tool >/dev/null 2>&1
    return $?
}

# Fonction pour extraire une valeur JSON
extract_json_value() {
    local json_string="$1"
    local key="$2"
    
    # Utiliser jq si disponible, sinon fallback simple
    if command -v jq >/dev/null 2>&1; then
        echo "$json_string" | jq -r ".$key" 2>/dev/null
    else
        # Fallback simple pour les cas basiques
        echo "$json_string" | sed -n "s/.*\"$key\":\"\\([^\"]*\\)\".*/\\1/p" | head -1
    fi
}

# Fonction pour générer des données de test
generate_test_email() {
    local prefix="${1:-test}"
    local timestamp=$(date +%s)
    echo "${prefix}-${timestamp}@tunisia-jockey-club.tn"
}

generate_random_string() {
    local length="${1:-8}"
    cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w $length | head -n 1
}

generate_test_user() {
    local email=$(generate_test_email)
    local password="Test$(generate_random_string 4)123!"
    
    echo '{
        "email": "'$email'",
        "password": "'$password'",
        "firstName": "Test",
        "lastName": "User'$(generate_random_string 3)'"
    }'
}

# Fonction pour mesurer le temps de réponse
measure_response_time() {
    local method="$1"
    local endpoint="$2"
    local data="$3"
    local base_url="${4:-$API_BASE_URL}"
    
    local start_time=$(date +%s%N)
    local response=$(api_call "$method" "$endpoint" "$data" "" "$base_url")
    local end_time=$(date +%s%N)
    
    local response_time_ms=$(( (end_time - start_time) / 1000000 ))
    
    echo "$response_time_ms|$response"
}

# Fonction pour tester la performance
performance_test() {
    local method="$1"
    local endpoint="$2"
    local description="$3"
    local max_time_ms="${4:-1000}"
    local data="$5"
    
    log_info "Performance test: $description"
    local result=$(measure_response_time "$method" "$endpoint" "$data")
    local response_time=$(echo "$result" | cut -d'|' -f1)
    local response=$(echo "$result" | cut -d'|' -f2-)
    
    echo "   Response time: ${response_time}ms"
    
    # Vérifier que response_time et max_time_ms sont numériques et non vides
    if [[ -n "$response_time" ]] && [[ -n "$max_time_ms" ]] && \
       [[ "$response_time" =~ ^[0-9]+$ ]] && [[ "$max_time_ms" =~ ^[0-9]+$ ]] && \
       [ "$response_time" -le "$max_time_ms" ]; then
        test_result 0 "$description (${response_time}ms)"
    else
        test_result 1 "$description" "Too slow: ${response_time}ms (max: ${max_time_ms}ms)"
    fi
    
    # Vérifier aussi le statut de la réponse
    local http_status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    if [ "$http_status" != "200" ]; then
        log_warning "Performance test returned status: $http_status"
    fi
}

# Fonction pour tester la sécurité
security_test() {
    local method="$1"
    local endpoint="$2"
    local malicious_data="$3"
    local description="$4"
    local expected_status="${5:-400}"
    
    log_info "Security test: $description"
    local response=$(api_call "$method" "$endpoint" "$malicious_data")
    check_response "$response" "$expected_status" "$description"
}

# Fonction pour nettoyer les données de test
cleanup_test_data() {
    log_info "Cleaning up test data..."
    # Implémenter selon les besoins spécifiques
}

# Fonction pour afficher le résumé final
print_summary() {
    echo -e "\n${BLUE}================================================${NC}"
    echo -e "${BLUE}📊 TEST SUMMARY${NC}"
    echo -e "${BLUE}================================================${NC}"
    
    echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
    echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
    echo -e "Failed: ${RED}$FAILED_TESTS${NC}"
    
    if [ $TOTAL_TESTS -gt 0 ]; then
        local success_rate=$((PASSED_TESTS * 100 / TOTAL_TESTS))
        echo -e "Success Rate: ${BLUE}${success_rate}%${NC}"
        
        if [ $FAILED_TESTS -eq 0 ]; then
            echo -e "\n${GREEN}🎉 ALL TESTS PASSED! 🎉${NC}"
            return 0
        else
            echo -e "\n${RED}❌ SOME TESTS FAILED${NC}"
            return 1
        fi
    else
        echo -e "\n${YELLOW}⚠️  NO TESTS RUN${NC}"
        return 1
    fi
}

# Fonction pour vérifier les prérequis
check_prerequisites() {
    local requirements_met=true
    
    # Vérifier curl
    if ! command -v curl >/dev/null 2>&1; then
        log_error "curl is required but not installed"
        requirements_met=false
    fi
    
    # Vérifier la disponibilité du serveur
    if [ -n "$API_BASE_URL" ]; then
        log_info "Checking API availability at $API_BASE_URL"
        local health_response=$(api_call "GET" "/health" "" "" "$API_BASE_URL" 5)
        local http_status=$(echo "$health_response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
        
        if [ "$http_status" != "200" ]; then
            log_warning "API might not be available (status: $http_status)"
            log_info "Make sure the server is running at $API_BASE_URL"
        else
            log_info "API is available ✅"
        fi
    fi
    
    return $([ "$requirements_met" = true ] && echo 0 || echo 1)
}

# Initialisation
init_test_suite() {
    local suite_name="$1"
    
    clear
    print_title "$suite_name"
    echo -e "Started at: ${CYAN}$(date)${NC}"
    echo -e "API Base URL: ${CYAN}${API_BASE_URL:-'Not set'}${NC}"
    echo ""
    
    check_prerequisites
}

# Export des fonctions pour les autres scripts
export -f print_title print_subtitle log_info log_warning log_error
export -f test_result check_response api_call validate_json extract_json_value
export -f generate_test_email generate_random_string generate_test_user
export -f measure_response_time performance_test security_test
export -f cleanup_test_data print_summary check_prerequisites init_test_suite
