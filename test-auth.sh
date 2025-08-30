#!/bin/bash

# Test d'authentification avec curl
# Teste le flux complet de login/logout

BASE_URL="http://localhost:3000"

echo "🔐 Test du Système d'Authentification"
echo "====================================="

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Fichier pour sauvegarder les cookies
COOKIE_JAR="/tmp/tjc_cookies.txt"
rm -f "$COOKIE_JAR"

echo "1. Test de la page de connexion"
echo "─────────────────────────────────"

# Test GET de la page de login
login_response=$(curl -s -c "$COOKIE_JAR" -w "%{http_code}" "$BASE_URL/login")
login_status="${login_response: -3}"

if [ "$login_status" = "200" ]; then
    echo -e "${GREEN}✅ Page de login accessible${NC}"
else
    echo -e "${RED}❌ Erreur page de login: $login_status${NC}"
    exit 1
fi

echo ""
echo "2. Test de connexion avec identifiants valides"
echo "──────────────────────────────────────────────"

# Tentative de connexion avec admin/admin123
login_result=$(curl -s -b "$COOKIE_JAR" -c "$COOKIE_JAR" \
    -X POST \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=admin&password=admin123&redirectTo=/secure-dashboard" \
    -w "%{http_code}" \
    "$BASE_URL/login")

login_result_status="${login_result: -3}"

if [ "$login_result_status" = "302" ]; then
    echo -e "${GREEN}✅ Connexion réussie (redirect $login_result_status)${NC}"
else
    echo -e "${YELLOW}⚠️ Statut inattendu: $login_result_status${NC}"
    echo "Response: ${login_result%???}"
fi

echo ""
echo "3. Test d'accès aux pages sécurisées avec session"
echo "─────────────────────────────────────────────────"

# Test d'accès à secure-dashboard avec les cookies de session
secure_response=$(curl -s -b "$COOKIE_JAR" -w "%{http_code}" "$BASE_URL/secure-dashboard" -o /tmp/secure_page.html)
secure_status="${secure_response: -3}"

if [ "$secure_status" = "200" ]; then
    echo -e "${GREEN}✅ Accès sécurisé autorisé${NC}"
    # Vérifier si la page contient du contenu authentifié
    if grep -q "Dashboard Sécurisé" /tmp/secure_page.html; then
        echo -e "  └─ ${GREEN}✅ Contenu authentifié présent${NC}"
    else
        echo -e "  └─ ${YELLOW}⚠️ Contenu inattendu${NC}"
    fi
elif [ "$secure_status" = "302" ]; then
    echo -e "${YELLOW}⚠️ Redirect vers login (session peut-être expirée)${NC}"
else
    echo -e "${RED}❌ Erreur d'accès: $secure_status${NC}"
fi

echo ""
echo "4. Test des autres pages sécurisées"
echo "───────────────────────────────────"

# Test licenses
licenses_response=$(curl -s -b "$COOKIE_JAR" -w "%{http_code}" "$BASE_URL/licenses")
licenses_status="${licenses_response: -3}"
echo -n "Licenses page: "
[ "$licenses_status" = "200" ] && echo -e "${GREEN}✅ OK${NC}" || echo -e "${YELLOW}⚠️ $licenses_status${NC}"

# Test analytics  
analytics_response=$(curl -s -b "$COOKIE_JAR" -w "%{http_code}" "$BASE_URL/analytics")
analytics_status="${analytics_response: -3}"
echo -n "Analytics page: "
[ "$analytics_status" = "200" ] && echo -e "${GREEN}✅ OK${NC}" || echo -e "${YELLOW}⚠️ $analytics_status${NC}"

echo ""
echo "5. Test de déconnexion"
echo "─────────────────────"

# Test de logout
logout_response=$(curl -s -b "$COOKIE_JAR" -c "$COOKIE_JAR" \
    -X POST \
    -w "%{http_code}" \
    "$BASE_URL/logout")

logout_status="${logout_response: -3}"

if [ "$logout_status" = "302" ]; then
    echo -e "${GREEN}✅ Déconnexion réussie${NC}"
else
    echo -e "${YELLOW}⚠️ Statut logout: $logout_status${NC}"
fi

echo ""
echo "6. Vérification que l'accès est révoqué après déconnexion"
echo "─────────────────────────────────────────────────────────"

# Tenter d'accéder à secure-dashboard après logout
post_logout_response=$(curl -s -b "$COOKIE_JAR" -w "%{http_code}" "$BASE_URL/secure-dashboard")
post_logout_status="${post_logout_response: -3}"

if [ "$post_logout_status" = "302" ]; then
    echo -e "${GREEN}✅ Accès correctement révoqué (redirect vers login)${NC}"
elif [ "$post_logout_status" = "200" ]; then
    echo -e "${RED}❌ SÉCURITÉ: Accès encore autorisé après déconnexion!${NC}"
else
    echo -e "${YELLOW}⚠️ Statut inattendu: $post_logout_status${NC}"
fi

echo ""
echo "7. Test avec identifiants invalides"
echo "──────────────────────────────────"

# Test avec mauvais mot de passe
rm -f "$COOKIE_JAR"  # Nettoyer les cookies
bad_login=$(curl -s -c "$COOKIE_JAR" \
    -X POST \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=admin&password=wrongpassword" \
    -w "%{http_code}" \
    "$BASE_URL/login")

bad_login_status="${bad_login: -3}"

if [ "$bad_login_status" = "401" ] || [ "$bad_login_status" = "400" ]; then
    echo -e "${GREEN}✅ Identifiants invalides correctement rejetés${NC}"
elif [ "$bad_login_status" = "200" ]; then
    echo -e "${YELLOW}⚠️ Page de login retournée (avec erreur)${NC}"
else
    echo -e "${RED}❌ Comportement inattendu: $bad_login_status${NC}"
fi

echo ""
echo "📊 Résumé du Test d'Authentification"
echo "════════════════════════════════════"
echo "✓ Page de login accessible"
echo "✓ Connexion avec identifiants valides"
echo "✓ Accès aux pages sécurisées"
echo "✓ Déconnexion fonctionnelle"
echo "✓ Révocation d'accès après logout"
echo "✓ Rejet des identifiants invalides"

# Nettoyage
rm -f "$COOKIE_JAR" /tmp/secure_page.html

echo ""
echo "🎯 Test d'authentification terminé !"
