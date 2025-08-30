#!/bin/bash

echo "🧹 ORGANISATION DU PROJET TUNISIA JOCKEY CLUB"
echo "=============================================="

# 1. Créer des dossiers d'archive
echo "📁 Création des dossiers d'archive..."
mkdir -p _archive/{scripts,tests,docs,old-configs,old-html}

# 2. Archiver les fichiers de test redondants
echo "📦 Archivage des scripts de test redondants..."
mv test-curl-complete.sh _archive/tests/ 2>/dev/null || true
mv test-curl-simple.sh _archive/tests/ 2>/dev/null || true
mv test-curl.sh _archive/tests/ 2>/dev/null || true
mv test-api-fixed.sh _archive/tests/ 2>/dev/null || true
mv test-auth-original.sh _archive/tests/ 2>/dev/null || true
mv diagnostic-connexion.sh _archive/tests/ 2>/dev/null || true
mv diagnostic-curl.sh _archive/tests/ 2>/dev/null || true
mv test-new-auth.sh _archive/tests/ 2>/dev/null || true
mv test-final.sh _archive/tests/ 2>/dev/null || true
mv test-integration.sh _archive/tests/ 2>/dev/null || true
mv test-login-dashboard.sh _archive/tests/ 2>/dev/null || true
mv test-vraies-donnees.sh _archive/tests/ 2>/dev/null || true
mv test-ux-improvements.sh _archive/tests/ 2>/dev/null || true

echo "✅ Scripts de test essentiels conservés:"
echo "   - test-auth.sh (authentification principale)"
echo "   - test-system.sh (système complet)" 
echo "   - debug-login-flow.sh (debug détaillé)"

# 3. Archiver les fichiers HTML de test
echo "📋 Archivage des fichiers HTML de test..."
mv dashboard-test.html _archive/old-html/ 2>/dev/null || true
mv frontend/ux-demo-standalone.html _archive/old-html/ 2>/dev/null || true

# 4. Nettoyer les fichiers de configuration dupliqués
echo "🔧 Nettoyage des configurations dupliquées..."
mv frontend/tailwind.config.cjs.backup _archive/old-configs/ 2>/dev/null || true
mv frontend/vite.config.ts.timestamp-*.mjs _archive/old-configs/ 2>/dev/null || true
mv frontend/package.test.json _archive/old-configs/ 2>/dev/null || true

# 5. Archiver les vieux scripts d'intégration
echo "📚 Archivage des scripts d'intégration redondants..."
mv backend/integrate-benguerdane-data-simple.js _archive/scripts/ 2>/dev/null || true
mv backend/integrate-benguerdane-data.js _archive/scripts/ 2>/dev/null || true
mv backend/integrate-full-benguerdane.js _archive/scripts/ 2>/dev/null || true
mv backend/analyze-benguerdane-data.js _archive/scripts/ 2>/dev/null || true
mv backend/check-benguerdane-data.js _archive/scripts/ 2>/dev/null || true
mv backend/add-race-entries.js _archive/scripts/ 2>/dev/null || true
mv backend/add-race-results.js _archive/scripts/ 2>/dev/null || true
mv backend/create-race-entries.js _archive/scripts/ 2>/dev/null || true

# 6. Archiver les vieux documents d'audit
echo "📝 Archivage des documents d'audit/enhancement..."
mv UI_UX_ENHANCEMENT_AUDIT.md _archive/docs/ 2>/dev/null || true
mv UI_UX_ENHANCEMENT_COMPLETE.md _archive/docs/ 2>/dev/null || true
mv UI_UX_ENHANCEMENT_PLAN.md _archive/docs/ 2>/dev/null || true
mv UI_UX_IMPROVEMENTS_SUMMARY.md _archive/docs/ 2>/dev/null || true
mv UX-ENHANCEMENT-GUIDE.md _archive/docs/ 2>/dev/null || true
mv PERFORMANCE_AUDIT.md _archive/docs/ 2>/dev/null || true
mv PHASE2-TEST-GUIDE.md _archive/docs/ 2>/dev/null || true
mv TAILWIND_OPTIMIZATION_PLAN.md _archive/docs/ 2>/dev/null || true
mv DESIGN-SYSTEM-EXECUTIVE.md _archive/docs/ 2>/dev/null || true
mv DESIGN_SYSTEM_GUIDE.md _archive/docs/ 2>/dev/null || true
mv SUPPRESSION-PARIS-RECAP.md _archive/docs/ 2>/dev/null || true

# 7. Archiver les scripts utilitaires redondants
echo "🔧 Archivage des scripts utilitaires redondants..."
mv phase2-completed.js _archive/scripts/ 2>/dev/null || true
mv phase2-test-complete.js _archive/scripts/ 2>/dev/null || true
mv phase2-ux-enhancements.js _archive/scripts/ 2>/dev/null || true
mv consolidate-system.js _archive/scripts/ 2>/dev/null || true
mv finalize-system.js _archive/scripts/ 2>/dev/null || true
mv strategic-plan.js _archive/scripts/ 2>/dev/null || true
mv system-status.js _archive/scripts/ 2>/dev/null || true
mv demo-ux.sh _archive/scripts/ 2>/dev/null || true
mv ui-performance-audit.sh _archive/scripts/ 2>/dev/null || true

# 8. Nettoyer les fichiers temporaires
echo "🗑️ Suppression des fichiers temporaires..."
rm -f cookies.txt debug_cookies*.txt 2>/dev/null || true
rm -f cache/dump.rdb 2>/dev/null || true

echo ""
echo "📊 STRUCTURE NETTOYÉE:"
echo "====================="
tree -L 2 -I 'node_modules|.git|_archive'

echo ""
echo "📁 Fichiers archivés dans _archive/:"
echo "   - tests/ : $(ls _archive/tests/ 2>/dev/null | wc -l) fichiers de test"
echo "   - docs/ : $(ls _archive/docs/ 2>/dev/null | wc -l) documents d'audit"
echo "   - scripts/ : $(ls _archive/scripts/ 2>/dev/null | wc -l) scripts redondants"
echo "   - old-configs/ : $(ls _archive/old-configs/ 2>/dev/null | wc -l) anciennes configs"
echo "   - old-html/ : $(ls _archive/old-html/ 2>/dev/null | wc -l) fichiers HTML de test"

echo ""
echo "✅ ORGANISATION TERMINÉE!"
echo "========================"
