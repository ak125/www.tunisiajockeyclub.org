#!/bin/bash

echo "🧹 NETTOYAGE FINAL DES ROUTES FRONTEND"
echo "======================================"

# Créer un dossier d'archive pour les routes redondantes
mkdir -p _archive/old-routes

# Archiver les versions multiples de dashboard (garder uniquement dashboard-main.tsx)
echo "📦 Archivage des versions multiples de dashboard..."

mv frontend/app/routes/dashboard._index.tsx _archive/old-routes/ 2>/dev/null || true
mv frontend/app/routes/dashboard._index.tsx.backup _archive/old-routes/ 2>/dev/null || true
mv frontend/app/routes/dashboard-test.tsx _archive/old-routes/ 2>/dev/null || true
mv frontend/app/routes/dashboard-enhanced.tsx _archive/old-routes/ 2>/dev/null || true
mv frontend/app/routes/dashboard.tsx _archive/old-routes/ 2>/dev/null || true
mv frontend/app/routes/mobile-dashboard.tsx _archive/old-routes/ 2>/dev/null || true
mv frontend/app/routes/secure-dashboard.tsx _archive/old-routes/ 2>/dev/null || true
mv frontend/app/routes/executive-dashboard.tsx _archive/old-routes/ 2>/dev/null || true

# Archiver les pages de demo/test
echo "📋 Archivage des pages de démonstration..."
mv frontend/app/routes/design-system*.tsx _archive/old-routes/ 2>/dev/null || true
mv frontend/app/routes/professional-demo*.tsx _archive/old-routes/ 2>/dev/null || true
mv frontend/app/routes/executive-demo.tsx _archive/old-routes/ 2>/dev/null || true
mv frontend/app/routes/executive.tsx _archive/old-routes/ 2>/dev/null || true
mv frontend/app/routes/ux-demo.tsx _archive/old-routes/ 2>/dev/null || true
mv frontend/app/routes/ui-test.tsx _archive/old-routes/ 2>/dev/null || true
mv frontend/app/routes/showcase.tsx _archive/old-routes/ 2>/dev/null || true

# Archiver les sous-routes dashboard redondantes
echo "🗂️ Archivage des sous-routes dashboard..."
mv frontend/app/routes/dashboard.analytics._index.tsx _archive/old-routes/ 2>/dev/null || true
mv frontend/app/routes/dashboard.calendar._index.tsx _archive/old-routes/ 2>/dev/null || true
mv frontend/app/routes/dashboard.horses.*.tsx _archive/old-routes/ 2>/dev/null || true
mv frontend/app/routes/dashboard.jockeys.*.tsx _archive/old-routes/ 2>/dev/null || true
mv frontend/app/routes/dashboard.races.*.tsx _archive/old-routes/ 2>/dev/null || true
mv frontend/app/routes/dashboard.settings._index.tsx _archive/old-routes/ 2>/dev/null || true

# Nettoyer les fichiers bizarres
echo "🗑️ Suppression des fichiers malformés..."
rm -f "frontend/app/routes/import { useState } from \"react\";" 2>/dev/null || true

echo ""
echo "✅ ROUTES PRINCIPALES CONSERVÉES:"
echo "================================="
echo "📱 Pages essentielles:"
ls -1 frontend/app/routes/*.tsx | grep -E "(index|login|profile|race-management|dashboard-main)" | sed 's|frontend/app/routes/||' | sed 's/^/   ✓ /'

echo ""
echo "📊 Modules spécialisés conservés:"
if [ -d "frontend/app/routes/admin" ]; then
    echo "   ✓ admin/ (gestion administrative)"
fi
if [ -d "frontend/app/routes/rating" ]; then
    echo "   ✓ rating/ (système de rating)" 
fi
if [ -d "frontend/app/routes/reglementation" ]; then
    echo "   ✓ reglementation/ (réglementation)"
fi

echo ""
echo "🗂️ Fichiers archivés dans _archive/old-routes/:"
echo "   $(ls _archive/old-routes/ 2>/dev/null | wc -l) fichiers de routes redondants"

echo ""
echo "🎯 STRUCTURE FINALE CLAIRE:"
echo "=========================="
echo "✅ Dashboard officiel: dashboard-main.tsx"
echo "✅ Page d'accueil: _index.tsx"
echo "✅ Connexion: login.tsx"
echo "✅ Profil: profile.tsx" 
echo "✅ Gestion courses: race-management.tsx"
echo "✅ Modules admin, rating, reglementation conservés"

echo ""
echo "📋 PLUS DE CONFUSION!"
echo "===================="
echo "Une seule version de chaque page maintenant."
