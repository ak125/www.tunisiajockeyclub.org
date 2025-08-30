#!/bin/bash

echo "🔄 VALIDATION INTERFACE ADMIN - TUNISIA JOCKEY CLUB"
echo "==================================================="
echo ""

# Configuration
PROJECT_DIR="/workspaces/tunisia-jockey-club-clean"
ADMIN_FILE="frontend/app/routes/admin._index.tsx"
VALIDATION_DATE=$(date +"%Y-%m-%d %H:%M:%S")

echo "📅 Date de validation: $VALIDATION_DATE"
echo "📁 Fichier analysé: $ADMIN_FILE"
echo ""

# Vérification de l'existence du fichier
echo "1️⃣ VÉRIFICATION PRÉSENCE FICHIER ADMIN"
echo "======================================="
if [ -f "$PROJECT_DIR/$ADMIN_FILE" ]; then
    echo "✅ Fichier admin._index.tsx trouvé"
    file_size=$(wc -l < "$PROJECT_DIR/$ADMIN_FILE")
    echo "📊 Taille: $file_size lignes"
else
    echo "❌ Fichier admin._index.tsx manquant"
    exit 1
fi
echo ""

# Analyse de la structure du fichier
echo "2️⃣ ANALYSE STRUCTURE ADMIN"
echo "==========================="
echo "🔍 Vérification des imports..."

# Vérification des imports Remix
if grep -q "@remix-run" "$PROJECT_DIR/$ADMIN_FILE"; then
    echo "✅ Imports Remix détectés"
else
    echo "⚠️  Imports Remix manquants"
fi

# Vérification des composants dashboard
if grep -q "DashboardLayout\|StatsCards\|RaceChart" "$PROJECT_DIR/$ADMIN_FILE"; then
    echo "✅ Composants dashboard utilisés"
else
    echo "⚠️  Composants dashboard non détectés"
fi

# Vérification de la cohérence avec le système unifié
echo ""
echo "3️⃣ COHÉRENCE AVEC SYSTÈME UNIFIÉ"
echo "=================================="

# Vérification des imports Lucide React
if grep -q "lucide-react" "$PROJECT_DIR/$ADMIN_FILE"; then
    echo "🔍 Imports Lucide détectés, vérification du format..."
    if grep -q "import.*from.*lucide-react" "$PROJECT_DIR/$ADMIN_FILE"; then
        if grep -q "import \*.*Icons.*from.*lucide-react" "$PROJECT_DIR/$ADMIN_FILE"; then
            echo "✅ Format import Lucide correct (import * as Icons)"
        else
            echo "⚠️  Format import Lucide à vérifier (possibles named imports)"
        fi
    else
        echo "✅ Pas d'imports Lucide directs détectés"
    fi
else
    echo "✅ Pas d'imports Lucide React détectés"
fi

# Vérification des composants unifiés
echo ""
echo "4️⃣ UTILISATION COMPOSANTS UNIFIÉS"  
echo "=================================="

unified_components_used=0
if grep -q "UnifiedSearchBar\|UnifiedFilterBar\|UnifiedCard\|UnifiedTable\|UnifiedStatsGrid" "$PROJECT_DIR/$ADMIN_FILE"; then
    echo "✅ Composants unifiés détectés"
    unified_components_used=1
else
    echo "📋 Composants unifiés non utilisés (opportunité d'amélioration)"
fi

# Vérification de la cohérence visuelle
echo ""
echo "5️⃣ COHÉRENCE VISUELLE"
echo "======================"

# Vérification des classes Tailwind pour gradients
if grep -q "from-.*-.*to-.*-" "$PROJECT_DIR/$ADMIN_FILE"; then
    echo "✅ Gradients thématiques détectés"
else
    echo "📋 Gradients thématiques non détectés (opportunité d'unification)"
fi

# Vérification des animations
if grep -q "motion\." "$PROJECT_DIR/$ADMIN_FILE"; then
    echo "✅ Animations Framer Motion détectées"
else
    echo "📋 Animations non détectées (opportunité d'amélioration)"
fi

echo ""
echo "📊 RÉSUMÉ DE LA VALIDATION"
echo "=========================="

# Calcul du score de compatibilité
score=0
total=5

# Scoring
[ -f "$PROJECT_DIR/$ADMIN_FILE" ] && ((score++))
grep -q "@remix-run" "$PROJECT_DIR/$ADMIN_FILE" && ((score++))
if grep -q "lucide-react" "$PROJECT_DIR/$ADMIN_FILE"; then
    if ! grep -q "import.*{.*}.*lucide-react" "$PROJECT_DIR/$ADMIN_FILE"; then
        ((score++))
    fi
else
    ((score++))
fi
[ $unified_components_used -eq 1 ] && ((score++))
grep -q "from-.*-.*to-.*-\|motion\." "$PROJECT_DIR/$ADMIN_FILE" && ((score++))

percentage=$((score * 100 / total))

echo "Score de compatibilité: $score/$total"
echo "Pourcentage: $percentage%"
echo ""

if [ $score -eq $total ]; then
    echo "🎉 VALIDATION PARFAITE !"
    echo "✅ Interface admin parfaitement compatible"
    echo "✅ Prête pour l'intégration unifiée"
elif [ $score -ge 3 ]; then
    echo "✅ VALIDATION BONNE"
    echo "📋 Interface admin compatible avec améliorations possibles"
    echo "🔧 Recommandation: Procéder à l'unification"
else
    echo "⚠️  VALIDATION PARTIELLE"
    echo "📋 Interface admin nécessite des ajustements"
    echo "🔧 Recommandation: Corrections avant unification"
fi

echo ""
echo "🎯 RECOMMANDATIONS POUR L'ÉTAPE SUIVANTE"
echo "========================================"

if [ $unified_components_used -eq 0 ]; then
    echo "• Intégrer les composants unifiés (UnifiedCard, UnifiedTable, etc.)"
fi

if ! grep -q "from-.*-.*to-.*-" "$PROJECT_DIR/$ADMIN_FILE"; then
    echo "• Ajouter les gradients thématiques cohérents"
fi

if ! grep -q "motion\." "$PROJECT_DIR/$ADMIN_FILE"; then
    echo "• Intégrer les animations Framer Motion"
fi

echo "• Appliquer le design system unifié complet"
echo "• Maintenir la cohérence avec les modules dashboard"

echo ""
echo "✅ VALIDATION ADMIN TERMINÉE"
echo "🚀 Prêt pour l'étape suivante: Intégration Unifiée"
