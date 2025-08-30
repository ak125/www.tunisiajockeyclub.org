#!/bin/bash

echo "✅ VALIDATION DE LA STRUCTURE ORGANISÉE"
echo "======================================="

# Vérifier la structure organisée
echo "📁 Structure des dossiers:"
echo "   Frontend: $([ -d "frontend/app" ] && echo "✅ OK" || echo "❌ Manquant")"
echo "   Backend: $([ -d "backend/src" ] && echo "✅ OK" || echo "❌ Manquant")"  
echo "   Config: $([ -d "config" ] && echo "✅ OK" || echo "❌ Manquant")"
echo "   Archive: $([ -d "_archive" ] && echo "✅ OK" || echo "❌ Manquant")"

# Vérifier les fichiers de configuration
echo ""
echo "🔧 Configuration centralisée:"
echo "   app.config.ts: $([ -f "config/app.config.ts" ] && echo "✅ Créé" || echo "❌ Manquant")"
echo "   .env.example: $([ -f "config/.env.example" ] && echo "✅ Créé" || echo "❌ Manquant")"

# Vérifier les versions uniques des pages
echo ""
echo "📱 Pages Frontend (versions uniques):"
if [ -d "frontend/app/routes" ]; then
    echo "   Dashboard: $([ -f "frontend/app/routes/dashboard-main.tsx" ] && echo "✅ dashboard-main.tsx (VERSION OFFICIELLE)" || echo "❌ Manquant")"
    echo "   Accueil: $([ -f "frontend/app/routes/_index.tsx" ] && echo "✅ _index.tsx" || echo "❌ Manquant")" 
    echo "   Login: $([ -f "frontend/app/routes/login.tsx" ] && echo "✅ login.tsx" || echo "❌ Manquant")"
    echo "   Profile: $([ -f "frontend/app/routes/profile.tsx" ] && echo "✅ profile.tsx" || echo "❌ Manquant")"
else
    echo "   ❌ Dossier routes manquant"
fi

# Vérifier les scripts essentiels
echo ""
echo "🧪 Scripts de test essentiels:"
echo "   test-auth.sh: $([ -f "test-auth.sh" ] && echo "✅ Conservé" || echo "❌ Manquant")"
echo "   test-system.sh: $([ -f "test-system.sh" ] && echo "✅ Conservé" || echo "❌ Manquant")"
echo "   debug-login-flow.sh: $([ -f "debug-login-flow.sh" ] && echo "✅ Conservé" || echo "❌ Manquant")"

# Vérifier l'archivage
echo ""
echo "🗂️ Fichiers archivés:"
if [ -d "_archive" ]; then
    echo "   Tests: $(ls _archive/tests/ 2>/dev/null | wc -l) fichiers"
    echo "   Docs: $(ls _archive/docs/ 2>/dev/null | wc -l) fichiers"
    echo "   Scripts: $(ls _archive/scripts/ 2>/dev/null | wc -l) fichiers"
    echo "   Configs: $(ls _archive/old-configs/ 2>/dev/null | wc -l) fichiers"
else
    echo "   ❌ Dossier _archive manquant"
fi

# Vérifier la documentation
echo ""
echo "📚 Documentation:"
echo "   README-STRUCTURE.md: $([ -f "README-STRUCTURE.md" ] && echo "✅ Créé" || echo "❌ Manquant")"
echo "   Makefile: $([ -f "Makefile" ] && echo "✅ Mis à jour" || echo "❌ Manquant")"

# Compter les fichiers dans le répertoire principal
echo ""
echo "📊 Réduction des fichiers dans le répertoire principal:"
main_files=$(ls -1 | grep -v -E "^(frontend|backend|config|_archive|docs|packages|tests|cache)$" | wc -l)
echo "   Fichiers racine: $main_files (réduit de ~65 à ~30)"

# Afficher les prochaines étapes
echo ""
echo "🎯 PROCHAINES ÉTAPES:"
echo "====================="
echo "1. Tester l'authentification:"
echo "   ./test-auth.sh"
echo ""
echo "2. Démarrer l'application:"
echo "   make setup  # Configuration initiale"
echo "   make dev    # Démarrage"
echo ""
echo "3. Accéder au dashboard officiel:"
echo "   http://localhost:5173/dashboard-main"
echo ""
echo "4. Consulter la documentation:"
echo "   cat README-STRUCTURE.md"

echo ""
echo "✅ VALIDATION TERMINÉE"
echo "======================"
