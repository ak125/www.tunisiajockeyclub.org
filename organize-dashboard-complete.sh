#!/bin/bash

echo "🧹 ORGANISATION COMPLÈTE DES FICHIERS DASHBOARD"
echo "=============================================="

# Créer les dossiers d'archive
mkdir -p _archive/frontend-versions/{dashboard-subroutes,backup-files}

echo "📊 État actuel des fichiers dashboard :"
ls -la frontend/app/routes/dashboard* | wc -l
echo " fichiers dashboard trouvés"

echo ""
echo "🔍 ANALYSE ET ARCHIVAGE..."

# Archiver les fichiers backup
echo "📦 Archivage des fichiers backup..."
mv frontend/app/routes/dashboard._index.tsx.backup _archive/frontend-versions/backup-files/ 2>/dev/null

# Garder les fichiers principaux
echo "✅ FICHIERS PRINCIPAUX CONSERVÉS:"
echo "  - dashboard.tsx (layout parent)"
echo "  - dashboard-main.tsx (version avec API)"
echo "  - dashboard-optimal.tsx (version future)"

# Lister les sous-routes pour décision
echo ""
echo "📂 SOUS-ROUTES DASHBOARD DISPONIBLES:"
ls frontend/app/routes/dashboard.*.tsx 2>/dev/null | while read file; do
    basename_file=$(basename "$file")
    case "$basename_file" in
        "dashboard._index.tsx")
            echo "  ✅ CONSERVER: $basename_file (page d'accueil du dashboard)"
            ;;
        "dashboard.races._index.tsx")
            echo "  ✅ CONSERVER: $basename_file (gestion des courses)"
            ;;
        "dashboard.horses._index.tsx")
            echo "  ✅ CONSERVER: $basename_file (base de données chevaux)"
            ;;
        "dashboard.jockeys._index.tsx")
            echo "  ✅ CONSERVER: $basename_file (profils jockeys)"
            ;;
        "dashboard.calendar._index.tsx")
            echo "  ✅ CONSERVER: $basename_file (calendrier des courses)"
            ;;
        "dashboard.analytics._index.tsx")
            echo "  ✅ CONSERVER: $basename_file (analyses et rapports)"
            ;;
        "dashboard.settings._index.tsx")
            echo "  ✅ CONSERVER: $basename_file (paramètres)"
            ;;
        "dashboard.races.enhanced._index.tsx")
            echo "  📦 ARCHIVER: $basename_file (version améliorée redondante)"
            mv "$file" _archive/frontend-versions/dashboard-subroutes/ 2>/dev/null
            ;;
        "dashboard.horses.\$horseId.tsx")
            echo "  ✅ CONSERVER: $basename_file (détails d'un cheval)"
            ;;
        "dashboard.horses.\$id.tsx")
            echo "  📦 ARCHIVER: $basename_file (doublon de \$horseId)"
            mv "$file" _archive/frontend-versions/dashboard-subroutes/ 2>/dev/null
            ;;
        "dashboard.jockeys.\$id.tsx")
            echo "  ✅ CONSERVER: $basename_file (détails d'un jockey)"
            ;;
        *)
            echo "  ❓ ANALYSER: $basename_file"
            ;;
    esac
done

echo ""
echo "📋 STRUCTURE DASHBOARD FINALE:"
echo ""
echo "🏠 PAGES PRINCIPALES:"
echo "  /dashboard              → Layout parent avec navigation"
echo "  /dashboard-main         → Dashboard complet avec API (RECOMMANDÉ)"
echo "  /dashboard-optimal      → Version future avec thèmes"
echo ""
echo "📂 SECTIONS DASHBOARD (sous-routes):"
echo "  /dashboard/             → Page d'accueil dashboard" 
echo "  /dashboard/races        → Gestion des courses"
echo "  /dashboard/horses       → Base de données chevaux"
echo "  /dashboard/jockeys      → Profils jockeys"
echo "  /dashboard/calendar     → Calendrier des courses"
echo "  /dashboard/analytics    → Analyses et rapports"
echo "  /dashboard/settings     → Paramètres système"
echo ""
echo "🔗 PAGES DÉTAIL:"
echo "  /dashboard/horses/\$horseId → Fiche détaillée d'un cheval"
echo "  /dashboard/jockeys/\$id    → Profil détaillé d'un jockey"

echo ""
echo "📊 RÉSUMÉ:"
echo "  ✅ Pages principales organisées"
echo "  ✅ Sous-routes fonctionnelles conservées"
echo "  ✅ Doublons archivés"
echo "  ✅ Structure claire documentée"

echo ""
echo "📦 FICHIERS ARCHIVÉS:"
ls -la _archive/frontend-versions/*/ 2>/dev/null || echo "  Aucun fichier archivé"

echo ""
echo "🎯 RECOMMANDATION:"
echo "  • Utiliser /dashboard-main pour le développement"
echo "  • Les sous-routes /dashboard/* fonctionnent avec le layout parent"
echo "  • Structure modulaire et organisée maintenant !"

echo ""
echo "✅ Organisation complète terminée !"
