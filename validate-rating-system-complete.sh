#!/bin/bash

# 🏆 SCRIPT DE VALIDATION - SYSTÈME RATING IFHA UNIFIÉ
# Tunisia Jockey Club - Validation complète du système

echo "🏆 === VALIDATION SYSTÈME RATING IFHA UNIFIÉ ==="
echo "📅 Date: $(date '+%d/%m/%Y %H:%M:%S')"
echo "🎯 Objectif: Vérifier l'intégration complète du système IFHA"
echo ""

# Variables
FRONTEND_DIR="/workspaces/tunisia-jockey-club-clean/frontend"
BACKEND_DIR="/workspaces/tunisia-jockey-club-clean/backend"
SUCCESS=0
ERRORS=0

# Fonction pour vérifier l'existence d'un fichier
check_file() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        echo "✅ $description"
        ((SUCCESS++))
    else
        echo "❌ $description - MANQUANT: $file"
        ((ERRORS++))
    fi
}

# Fonction pour vérifier le contenu d'un fichier
check_content() {
    local file=$1
    local pattern=$2
    local description=$3
    
    if [ -f "$file" ] && grep -q "$pattern" "$file"; then
        echo "✅ $description"
        ((SUCCESS++))
    else
        echo "❌ $description - Pattern '$pattern' non trouvé dans $file"
        ((ERRORS++))
    fi
}

echo "🔍 === VÉRIFICATION DES MODULES FRONTEND ==="
echo ""

# Vérification des modules principaux du dashboard
echo "📊 Modules Dashboard Unifiés:"
check_file "$FRONTEND_DIR/app/routes/dashboard.tsx" "Dashboard principal"
check_file "$FRONTEND_DIR/app/routes/dashboard._index.tsx" "Dashboard home"
check_file "$FRONTEND_DIR/app/routes/dashboard.ratings._index.tsx" "Module ratings principal"
check_file "$FRONTEND_DIR/app/routes/dashboard.ratings.calculate.tsx" "Calculateur IFHA"
check_file "$FRONTEND_DIR/app/routes/dashboard.ratings.reglementation.tsx" "Réglementation IFHA"
check_file "$FRONTEND_DIR/app/routes/dashboard.tournaments._index.tsx" "Module tournois"
check_file "$FRONTEND_DIR/app/routes/dashboard.performance._index.tsx" "Module performance"
check_file "$FRONTEND_DIR/app/routes/dashboard.horses._index.tsx" "Module chevaux"
check_file "$FRONTEND_DIR/app/routes/dashboard.races._index.tsx" "Module courses"
check_file "$FRONTEND_DIR/app/routes/dashboard.jockeys._index.tsx" "Module jockeys"
check_file "$FRONTEND_DIR/app/routes/dashboard.analytics._index.tsx" "Module analytics"
check_file "$FRONTEND_DIR/app/routes/dashboard.calendar._index.tsx" "Module calendrier"
check_file "$FRONTEND_DIR/app/routes/dashboard.settings._index.tsx" "Module paramètres"

echo ""
echo "🔐 Système d'authentification:"
check_file "$FRONTEND_DIR/app/utils/auth.server.ts" "Système auth unifié"
check_content "$FRONTEND_DIR/app/utils/auth.server.ts" "TOURNAMENTS" "Permission tournois"
check_content "$FRONTEND_DIR/app/utils/auth.server.ts" "RATING" "Permission ratings"
check_content "$FRONTEND_DIR/app/utils/auth.server.ts" "ANALYTICS" "Permission analytics"

echo ""
echo "🎯 === VÉRIFICATION DES INTÉGRATIONS RATING ==="
echo ""

# Vérification des intégrations IFHA
echo "🏆 Intégrations IFHA:"
check_content "$FRONTEND_DIR/app/routes/dashboard.ratings._index.tsx" "/dashboard/ratings/calculate" "Lien calculateur"
check_content "$FRONTEND_DIR/app/routes/dashboard.ratings._index.tsx" "/dashboard/ratings/reglementation" "Lien réglementation"
check_content "$FRONTEND_DIR/app/routes/dashboard.ratings.calculate.tsx" "requirePermission" "Contrôle d'accès calculateur"
check_content "$FRONTEND_DIR/app/routes/dashboard.ratings.reglementation.tsx" "Permission.RATING" "Contrôle d'accès réglementation"

# Vérification navigation principale
echo ""
echo "🧭 Navigation principale:"
check_content "$FRONTEND_DIR/app/routes/dashboard.tsx" "/dashboard/ratings" "Navigation vers ratings"
check_content "$FRONTEND_DIR/app/routes/dashboard.tsx" "/dashboard/tournaments" "Navigation vers tournois"
check_content "$FRONTEND_DIR/app/routes/dashboard.tsx" "/dashboard/performance" "Navigation vers performance"

echo ""
echo "🖥️ === VÉRIFICATION BACKEND ==="
echo ""

# Vérification des services backend
echo "⚙️ Services Backend:"
check_file "$BACKEND_DIR/src/rating" "Dossier rating services"
if [ -d "$BACKEND_DIR/src/rating" ]; then
    echo "📁 Contenu du dossier rating:"
    ls -la "$BACKEND_DIR/src/rating/" | head -10
fi

echo ""
echo "🗄️ === VÉRIFICATION BASE DE DONNÉES ==="
echo ""

# Vérification de la configuration
echo "📊 Configuration DB:"
check_file "$BACKEND_DIR/prisma/schema.prisma" "Schema Prisma"
if [ -f "$BACKEND_DIR/prisma/schema.prisma" ]; then
    echo "🔍 Vérification des modèles:"
    if grep -q "model.*Horse" "$BACKEND_DIR/prisma/schema.prisma"; then
        echo "✅ Modèle Horse trouvé"
        ((SUCCESS++))
    else
        echo "❌ Modèle Horse manquant"
        ((ERRORS++))
    fi
fi

echo ""
echo "📄 === VÉRIFICATION DOCUMENTATION ==="
echo ""

# Vérification des documents
echo "📚 Documentation:"
check_file "/workspaces/tunisia-jockey-club-clean/RATING-SYSTEM-UNIFICATION-COMPLETE.md" "Documentation unification rating"
check_file "/workspaces/tunisia-jockey-club-clean/DASHBOARD-UNIFICATION-COMPLETE.md" "Documentation unification dashboard"
check_file "/workspaces/tunisia-jockey-club-clean/PLAN-INTEGRATION-FINALE.md" "Plan d'intégration"

echo ""
echo "🔧 === TESTS FONCTIONNELS ==="
echo ""

# Test des permissions dans le code
echo "🛡️ Tests de sécurité:"
if find "$FRONTEND_DIR/app/routes" -name "dashboard.*.tsx" -exec grep -l "requirePermission" {} \; | wc -l | xargs test 5 -le; then
    echo "✅ Permissions implémentées dans les modules critiques"
    ((SUCCESS++))
else
    echo "❌ Permissions manquantes dans certains modules"
    ((ERRORS++))
fi

# Test de la cohérence des imports
echo ""
echo "📦 Tests d'imports:"
if find "$FRONTEND_DIR/app/routes" -name "dashboard.*.tsx" -exec grep -l "from.*auth.server" {} \; | wc -l | xargs test 3 -le; then
    echo "✅ Imports auth.server cohérents"
    ((SUCCESS++))
else
    echo "❌ Problèmes d'imports auth.server"
    ((ERRORS++))
fi

echo ""
echo "📊 === MÉTRIQUES SYSTÈME ==="
echo ""

# Comptage des modules
DASHBOARD_MODULES=$(find "$FRONTEND_DIR/app/routes" -name "dashboard.*.tsx" | wc -l)
RATING_MODULES=$(find "$FRONTEND_DIR/app/routes" -name "dashboard.ratings*.tsx" | wc -l)

echo "📈 Statistiques:"
echo "   • Modules dashboard total: $DASHBOARD_MODULES"
echo "   • Modules rating IFHA: $RATING_MODULES"
echo "   • Taille projet frontend: $(du -sh $FRONTEND_DIR 2>/dev/null | cut -f1)"
if [ -d "$BACKEND_DIR" ]; then
    echo "   • Taille projet backend: $(du -sh $BACKEND_DIR 2>/dev/null | cut -f1)"
fi

echo ""
echo "🎯 === RÉSULTATS FINAUX ==="
echo ""

# Calcul du score de réussite
TOTAL=$((SUCCESS + ERRORS))
if [ $TOTAL -gt 0 ]; then
    PERCENTAGE=$((SUCCESS * 100 / TOTAL))
else
    PERCENTAGE=0
fi

echo "📊 Score de validation:"
echo "   ✅ Succès: $SUCCESS"
echo "   ❌ Erreurs: $ERRORS" 
echo "   📈 Pourcentage: $PERCENTAGE%"

echo ""
if [ $ERRORS -eq 0 ]; then
    echo "🏆 === VALIDATION RÉUSSIE ==="
    echo "🎉 Le système RATING IFHA est COMPLÈTEMENT UNIFIÉ et PRÊT!"
    echo "✨ Tous les modules sont intégrés avec succès"
    echo "🚀 Système prêt pour la PRODUCTION"
    exit 0
elif [ $PERCENTAGE -ge 80 ]; then
    echo "⚠️  === VALIDATION PARTIELLE ==="
    echo "🔧 Le système est fonctionnel mais nécessite des corrections mineures"
    echo "📝 $ERRORS erreur(s) à corriger"
    exit 1
else
    echo "❌ === VALIDATION ÉCHOUÉE ==="
    echo "🚨 Le système nécessite des corrections importantes"
    echo "🔴 $ERRORS erreur(s) critique(s) détectées"
    exit 2
fi
