#!/bin/bash

echo "🧹 ARCHIVAGE DES VERSIONS MULTIPLES DE DASHBOARD"
echo "==============================================="

# Créer le dossier d'archive s'il n'existe pas
mkdir -p _archive/frontend-versions

# Fonction pour archiver un fichier
archive_file() {
    local file=$1
    local reason=$2
    
    if [ -f "$file" ]; then
        echo "📦 Archivage: $file ($reason)"
        mv "$file" "_archive/frontend-versions/$(basename $file)"
    fi
}

# Analyser et archiver les versions de dashboard
echo "🔍 Analyse des versions de dashboard..."

# 1. Dashboard-enhanced.tsx - Fonctionnalités avancées mais pas de données réelles
archive_file "frontend/app/routes/dashboard-enhanced.tsx" "Fonctionnalités avancées mais données statiques"

# 2. Dashboard-test.tsx - Version de test uniquement  
archive_file "frontend/app/routes/dashboard-test.tsx" "Version de test - données statiques"

# 3. Garder dashboard.tsx (layout parent)
echo "✅ Conservé: dashboard.tsx (layout parent avec Outlet)"

# 4. Garder dashboard-main.tsx (meilleure version avec API)
echo "✅ Conservé: dashboard-main.tsx (version avec vraies données API)"

# 5. La nouvelle dashboard-optimal.tsx combine le meilleur des deux
echo "✅ Créé: dashboard-optimal.tsx (combine API + thèmes + animations)"

echo ""
echo "📋 ROUTES DASHBOARD FINALES:"
echo "  ✅ /dashboard          → Layout parent (navigation)"
echo "  ✅ /dashboard-main     → Version complète avec API"
echo "  ✅ /dashboard-optimal  → Version optimale (API + thèmes)"
echo ""
echo "📦 VERSIONS ARCHIVÉES:"
ls -la _archive/frontend-versions/ 2>/dev/null || echo "  Aucune version archivée pour le moment"

echo ""
echo "🎯 RECOMMANDATION D'UTILISATION:"
echo "  • Pour le DÉVELOPPEMENT  → /dashboard-main"
echo "  • Pour la PRODUCTION     → /dashboard-optimal"
echo "  • Pour la NAVIGATION     → /dashboard (parent layout)"

echo ""
echo "✅ Archivage terminé ! Les meilleures versions sont conservées."
