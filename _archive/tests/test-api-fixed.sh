#!/bin/bash

echo "🧪 TUNISIA JOCKEY CLUB - TESTS API CORRECTION"
echo "=============================================="
echo ""

# Configuration
BASE_URL="http://localhost:3000"

echo "🌐 Configuration:"
echo "   Backend NestJS + Remix: $BASE_URL"
echo "   Date: $(date)"
echo ""

# Test 1: Health Check
echo "1️⃣ TEST - Health Check API"
echo "=========================="
health_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BASE_URL/test/health")
health_http_code=$(echo "$health_response" | tail -n1 | cut -d: -f2)
health_body=$(echo "$health_response" | head -n -1)

if [ "$health_http_code" = "200" ]; then
  echo "✅ API Health Check OK"
  echo "Response: $health_body"
else
  echo "❌ Health Check Failed (Code: $health_http_code)"
fi
echo ""

# Test 2: Supabase Connection Test
echo "2️⃣ TEST - Supabase Connection"
echo "============================="
supabase_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BASE_URL/test/supabase")
supabase_http_code=$(echo "$supabase_response" | tail -n1 | cut -d: -f2)
supabase_body=$(echo "$supabase_response" | head -n -1)

if [ "$supabase_http_code" = "200" ]; then
  echo "✅ Supabase Test OK"
  echo "Response: $supabase_body"
else
  echo "❌ Supabase Test Failed (Code: $supabase_http_code)"
fi
echo ""

# Test 3: Dashboard API Data
echo "3️⃣ TEST - Dashboard API"
echo "======================="
dashboard_api_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BASE_URL/api/dashboard/data")
dashboard_api_http_code=$(echo "$dashboard_api_response" | tail -n1 | cut -d: -f2)
dashboard_api_body=$(echo "$dashboard_api_response" | head -n -1)

if [ "$dashboard_api_http_code" = "200" ]; then
  echo "✅ Dashboard API OK"
  echo "📊 Dashboard Data Summary:"
  echo "$dashboard_api_body" | jq '.overview // "No overview found"' 2>/dev/null || echo "Raw response: $(echo "$dashboard_api_body" | head -c 200)..."
else
  echo "❌ Dashboard API Failed (Code: $dashboard_api_http_code)"
  echo "Error: $dashboard_api_body"
fi
echo ""

# Test 4: Dashboard Stats
echo "4️⃣ TEST - Dashboard Stats"
echo "========================="
stats_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BASE_URL/api/dashboard/stats")
stats_http_code=$(echo "$stats_response" | tail -n1 | cut -d: -f2)
stats_body=$(echo "$stats_response" | head -n -1)

if [ "$stats_http_code" = "200" ]; then
  echo "✅ Dashboard Stats OK"
  echo "📈 Stats Summary:"
  echo "$stats_body" | jq '.' 2>/dev/null || echo "$stats_body"
else
  echo "❌ Dashboard Stats Failed (Code: $stats_http_code)"
  echo "Error: $stats_body"
fi
echo ""

# Test 5: Frontend Dashboard Page
echo "5️⃣ TEST - Frontend Dashboard Page"
echo "=================================="
dashboard_page_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BASE_URL/dashboard")
dashboard_page_http_code=$(echo "$dashboard_page_response" | tail -n1 | cut -d: -f2)

if [ "$dashboard_page_http_code" = "200" ]; then
  echo "✅ Dashboard Page Loads"
  
  # Analyser le contenu pour des données
  dashboard_page_body=$(echo "$dashboard_page_response" | head -n -1)
  
  echo "🔍 Content Analysis:"
  if echo "$dashboard_page_body" | grep -q "totalHorses\|NOUR EL HOUDA\|Thunder\|Chevaux"; then
    echo "   📊 Real data detected in page"
  else
    echo "   ⚠️  Limited data detected"
  fi
  
  if echo "$dashboard_page_body" | grep -q "AdvancedDashboard\|Recharts\|motion"; then
    echo "   🎨 Advanced UI components loaded"
  else
    echo "   ⚠️  Basic components only"
  fi
  
  if echo "$dashboard_page_body" | grep -q "error\|Error\|404\|500"; then
    echo "   ❌ Errors detected in page"
  else
    echo "   ✅ No obvious errors"
  fi
else
  echo "❌ Dashboard Page Failed (Code: $dashboard_page_http_code)"
fi
echo ""

# Test 6: Authentication Endpoints
echo "6️⃣ TEST - Authentication"
echo "========================"

# Test login page
echo "🔐 Login page test:"
login_page_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BASE_URL/login")
login_page_http_code=$(echo "$login_page_response" | tail -n1 | cut -d: -f2)
echo "   Login page: $login_page_http_code"

# Test authenticate endpoint
echo "🔑 Authenticate endpoint:"
auth_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BASE_URL/authenticate")
auth_http_code=$(echo "$auth_response" | tail -n1 | cut -d: -f2)
echo "   Authenticate: $auth_http_code"

# Test avec token (si disponible)
echo "🎫 Token auth test:"
token_auth_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -H "Authorization: Bearer test-token" \
  "$BASE_URL/api/dashboard/data")
token_auth_http_code=$(echo "$token_auth_response" | tail -n1 | cut -d: -f2)
echo "   Token auth: $token_auth_http_code"
echo ""

# Test 7: API Endpoints Discovery
echo "7️⃣ TEST - API Discovery"
echo "======================="

# Test différents endpoints API
echo "🔍 API Endpoints Status:"

endpoints=(
  "/api"
  "/api/horses"
  "/api/users" 
  "/api/races"
  "/horses"
  "/users"
  "/races"
)

for endpoint in "${endpoints[@]}"; do
  response_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint")
  if [ "$response_code" = "200" ]; then
    echo "   ✅ $endpoint: $response_code"
  elif [ "$response_code" = "401" ] || [ "$response_code" = "403" ]; then
    echo "   🔐 $endpoint: $response_code (Auth required)"
  elif [ "$response_code" = "404" ]; then
    echo "   ❌ $endpoint: $response_code (Not found)"
  else
    echo "   ⚠️  $endpoint: $response_code"
  fi
done
echo ""

# Test 8: Data Quality Check
echo "8️⃣ TEST - Data Quality"
echo "======================"

if [ "$dashboard_api_http_code" = "200" ]; then
  echo "📊 Analyzing dashboard data quality..."
  
  # Check if we got real data vs fallback
  if echo "$dashboard_api_body" | grep -q "fallback.*true"; then
    echo "   ⚠️  Using fallback data (Prisma/DB issue)"
  elif echo "$dashboard_api_body" | grep -q "NOUR EL HOUDA\|Thunder\|Farouk"; then
    echo "   ✅ Real Tunisian horse data detected"
  else
    echo "   ❓ Data source unclear"
  fi
  
  # Extract key numbers
  total_horses=$(echo "$dashboard_api_body" | jq -r '.overview.totalHorses // "unknown"' 2>/dev/null)
  total_users=$(echo "$dashboard_api_body" | jq -r '.overview.totalUsers // "unknown"' 2>/dev/null)
  total_races=$(echo "$dashboard_api_body" | jq -r '.overview.totalRaces // "unknown"' 2>/dev/null)
  
  echo "   🐎 Horses: $total_horses"
  echo "   👥 Users: $total_users" 
  echo "   🏆 Races: $total_races"
  
  if [[ "$total_horses" =~ ^[0-9]+$ ]] && [ "$total_horses" -gt 0 ]; then
    echo "   ✅ Valid horse data"
  else
    echo "   ❌ Invalid horse data"
  fi
else
  echo "❌ Cannot analyze data quality - API failed"
fi
echo ""

# Résumé final
echo "📋 RÉSUMÉ FINAL"
echo "==============="
echo ""

# Status des composants critiques
echo "🎯 Component Status:"
if [ "$health_http_code" = "200" ]; then
  echo "   ✅ Backend API Health: OK"
else
  echo "   ❌ Backend API Health: FAILED"
fi

if [ "$dashboard_api_http_code" = "200" ]; then
  echo "   ✅ Dashboard API: OK"
else
  echo "   ❌ Dashboard API: FAILED"
fi

if [ "$dashboard_page_http_code" = "200" ]; then
  echo "   ✅ Dashboard Frontend: OK"
else
  echo "   ❌ Dashboard Frontend: FAILED"
fi

if [ "$supabase_http_code" = "200" ]; then
  echo "   ✅ Database Connection: OK"
else
  echo "   ❌ Database Connection: FAILED"
fi

echo ""
echo "🔧 Next Steps:"
if [ "$dashboard_api_http_code" != "200" ]; then
  echo "   1. Fix Dashboard API endpoint"
fi
if [ "$supabase_http_code" != "200" ]; then
  echo "   2. Check database connection and credentials"  
fi
if [ "$auth_http_code" = "404" ]; then
  echo "   3. Implement proper authentication endpoints"
fi
echo "   4. Test the actual dashboard in browser"
echo "   5. Verify real data is loading correctly"

echo ""
echo "📊 Test URL: http://localhost:3000/dashboard"
echo "🕒 Test completed at: $(date)"
