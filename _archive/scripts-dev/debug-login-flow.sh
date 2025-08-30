#!/bin/bash

echo "🔍 DEBUG - FLUX DE CONNEXION DÉTAILLÉ"
echo "====================================="
echo ""

BASE_URL="http://localhost:3000"

echo "🌐 Configuration: $BASE_URL"
echo "🕒 Date: $(date)"
echo ""

# Nettoyer les cookies précédents
rm -f debug_cookies.txt debug_cookies_*.txt

echo "1️⃣ ÉTAPE - Accès initial page login"
echo "=================================="

# Récupérer la page de login et sauvegarder les cookies
echo "📋 Récupération page login avec cookies..."
login_page=$(curl -s -c debug_cookies_initial.txt -b debug_cookies_initial.txt "$BASE_URL/login")

echo "✅ Page login récupérée"
echo ""

# Analyser le contenu de la page
if echo "$login_page" | grep -q "csrf\|_token\|authenticity"; then
  echo "🔒 Token CSRF détecté dans la page"
  csrf_token=$(echo "$login_page" | grep -o 'name="_token"[^>]*value="[^"]*"' | grep -o 'value="[^"]*"' | cut -d'"' -f2)
  if [ -n "$csrf_token" ]; then
    echo "   Token: $csrf_token"
  fi
else
  echo "⚠️  Pas de token CSRF évident"
fi

echo ""

echo "2️⃣ ÉTAPE - Soumission formulaire login"
echo "===================================="

echo "🔐 Connexion avec monia@gmail.com..."

# Préparer les données du formulaire
form_data="email=monia@gmail.com&password=password123"
if [ -n "$csrf_token" ]; then
  form_data="${form_data}&_token=${csrf_token}"
fi

echo "📤 Données envoyées: $form_data"

# Effectuer la connexion avec suivi détaillé
login_response=$(curl -s -v -L \
  -c debug_cookies_after_login.txt \
  -b debug_cookies_initial.txt \
  -X POST \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" \
  -H "User-Agent: Mozilla/5.0 (Linux; X11)" \
  -d "$form_data" \
  "$BASE_URL/login" 2>&1)

# Extraire le code de réponse
login_code=$(echo "$login_response" | grep "< HTTP" | tail -1 | awk '{print $3}')
echo "📊 Code réponse login: $login_code"

# Vérifier les redirections
if echo "$login_response" | grep -q "Location:"; then
  redirect_url=$(echo "$login_response" | grep "< Location:" | awk '{print $3}' | tr -d '\r')
  echo "🔄 Redirection vers: $redirect_url"
else
  echo "❌ Pas de redirection détectée"
fi

echo ""

echo "3️⃣ ÉTAPE - Analyse des cookies après login"
echo "=========================================="

echo "🍪 Cookies après connexion:"
if [ -f debug_cookies_after_login.txt ]; then
  while IFS= read -r line; do
    if [[ $line != \#* ]] && [[ -n $line ]]; then
      echo "   $line"
    fi
  done < debug_cookies_after_login.txt
else
  echo "   ❌ Aucun cookie trouvé"
fi

echo ""

echo "4️⃣ ÉTAPE - Test accès dashboard après login"
echo "==========================================="

echo "📊 Accès dashboard avec session..."
dashboard_response=$(curl -s -w "\nHTTP_CODE:%{http_code}\nREDIRECT_URL:%{redirect_url}" \
  -b debug_cookies_after_login.txt \
  -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" \
  -H "User-Agent: Mozilla/5.0 (Linux; X11)" \
  "$BASE_URL/dashboard")

dashboard_code=$(echo "$dashboard_response" | grep "HTTP_CODE:" | cut -d: -f2)
redirect_url=$(echo "$dashboard_response" | grep "REDIRECT_URL:" | cut -d: -f2-)

echo "📊 Dashboard code: $dashboard_code"
if [ -n "$redirect_url" ] && [ "$redirect_url" != "" ]; then
  echo "🔄 Dashboard redirect: $redirect_url"
fi

# Analyser le contenu du dashboard
dashboard_content=$(echo "$dashboard_response" | head -n -2)

if [ "$dashboard_code" = "200" ]; then
  if echo "$dashboard_content" | grep -q "dashboard\|Dashboard\|Tableau"; then
    echo "✅ Dashboard chargé avec succès"
    
    # Vérifier si on a les vraies données
    if echo "$dashboard_content" | grep -q "totalHorses\|chevaux\|horses"; then
      echo "✅ Données dashboard présentes"
    else
      echo "⚠️  Dashboard chargé mais pas de données visibles"
    fi
  else
    echo "⚠️  Page chargée mais contenu suspect"
  fi
elif [ "$dashboard_code" = "302" ]; then
  echo "⚠️  Dashboard redirige (probablement vers login)"
elif [ "$dashboard_code" = "401" ]; then
  echo "❌ Dashboard refuse l'accès (session expirée?)"
else
  echo "❌ Dashboard inaccessible: $dashboard_code"
fi

echo ""

echo "5️⃣ ÉTAPE - Test page d'accueil après login"
echo "=========================================="

echo "🏠 Test page d'accueil avec session..."
home_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -b debug_cookies_after_login.txt \
  "$BASE_URL/")

home_code=$(echo "$home_response" | tail -1 | cut -d: -f2)
echo "🏠 Page d'accueil: $home_code"

home_content=$(echo "$home_response" | head -n -1)
if echo "$home_content" | grep -q "Se connecter\|Login\|Connexion"; then
  echo "⚠️  Page d'accueil montre encore le bouton login (session non reconnue?)"
elif echo "$home_content" | grep -q "Déconnexion\|Logout\|Profile\|Dashboard"; then
  echo "✅ Page d'accueil reconnaît l'utilisateur connecté"
else
  echo "❓ État de connexion sur page d'accueil indéterminé"
fi

echo ""

echo "6️⃣ ÉTAPE - Test direct API avec session"
echo "======================================"

echo "🔌 Test API /api/dashboard avec session..."
api_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -b debug_cookies_after_login.txt \
  -H "Accept: application/json" \
  "$BASE_URL/api/dashboard")

api_code=$(echo "$api_response" | tail -1 | cut -d: -f2)
echo "🔌 API dashboard: $api_code"

if [ "$api_code" = "200" ]; then
  api_content=$(echo "$api_response" | head -n -1)
  if echo "$api_content" | grep -q "totalHorses\|horses\|chevaux"; then
    echo "✅ API retourne des données"
  else
    echo "⚠️  API répond mais pas de données"
  fi
elif [ "$api_code" = "401" ]; then
  echo "❌ API refuse l'accès"
else
  echo "⚠️  API status inattendu: $api_code"
fi

echo ""

echo "📋 DIAGNOSTIC FINAL"
echo "=================="
echo ""

# Analyser les résultats
if [ "$login_code" = "302" ] && [ "$dashboard_code" = "200" ]; then
  echo "✅ FLUX DE CONNEXION FONCTIONNEL"
  echo "   • Login effectué avec succès"
  echo "   • Dashboard accessible"
  echo "   • Session maintenue"
elif [ "$login_code" = "302" ] && [ "$dashboard_code" = "302" ]; then
  echo "⚠️  PROBLÈME DE SESSION"
  echo "   • Login semble réussir"
  echo "   • Mais dashboard redirige (session perdue?)"
elif [ "$login_code" = "200" ]; then
  echo "❌ ÉCHEC DE CONNEXION"
  echo "   • Formulaire login renvoie erreur"
  echo "   • Vérifier identifiants ou validation"
else
  echo "❓ ÉTAT INDÉTERMINÉ"
  echo "   • Login code: $login_code"
  echo "   • Dashboard code: $dashboard_code"
fi

echo ""
echo "🎯 RECOMMANDATIONS:"

if [ "$dashboard_code" = "302" ] || [ "$dashboard_code" = "401" ]; then
  echo "   1. Vérifier la configuration des sessions"
  echo "   2. Contrôler la durée de vie des cookies"
  echo "   3. Examiner les logs du serveur"
fi

if [ "$api_code" = "401" ]; then
  echo "   4. API et frontend ont des systèmes d'auth différents"
  echo "   5. Synchroniser l'authentification API/Frontend"
fi

echo ""
echo "🔧 FICHIERS DE DEBUG CRÉÉS:"
echo "   • debug_cookies_initial.txt"
echo "   • debug_cookies_after_login.txt"

# Nettoyage optionnel (commenté pour debug)
# rm -f debug_cookies_*.txt

echo ""
echo "🕒 Debug terminé à: $(date)"
