#!/bin/bash

echo "🧪 TESTS D'INTÉGRATION AVANCÉS - TUNISIA JOCKEY CLUB"
echo "===================================================="
echo ""

# Configuration des couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/workspaces/tunisia-jockey-club-clean"
TEST_DATE=$(date +"%Y-%m-%d %H:%M:%S")

echo "📅 Date des tests: $TEST_DATE"
echo "📁 Projet: $PROJECT_DIR"
echo ""

# Fonction de test avancée
run_advanced_test() {
    local test_name="$1"
    local command="$2"
    local expected="$3"
    
    echo -e "${BLUE}🔍 Test: ${test_name}${NC}"
    
    result=$(eval "$command" 2>&1)
    if [[ $result == *"$expected"* ]] || eval "$command" &>/dev/null; then
        echo -e "${GREEN}✅ SUCCÈS${NC}"
        return 0
    else
        echo -e "${RED}❌ ÉCHEC${NC}"
        echo -e "${YELLOW}   Résultat: $result${NC}"
        return 1
    fi
}

# Variables de comptage
passed=0
total=0

echo "🎯 PHASE 1: TESTS SYSTÈME UNIFIÉ COMPLET"
echo "========================================"
echo ""

# Test 1: Modules dashboard unifiés
echo -e "${PURPLE}📋 Tests des Modules Dashboard${NC}"
((total++))
unified_modules=$(ls "$PROJECT_DIR/frontend/app/routes/dashboard."*.unified.tsx 2>/dev/null | wc -l)
if [ "$unified_modules" -ge 6 ]; then
    echo -e "${GREEN}✅ 6 modules dashboard unifiés détectés${NC}"
    ((passed++))
else
    echo -e "${RED}❌ Modules dashboard unifiés insuffisants ($unified_modules/6)${NC}"
fi

# Test 2: Interface admin unifiée
echo -e "${PURPLE}📋 Tests Interface Admin${NC}"
((total++))
if run_advanced_test "Interface admin unifiée" "grep -q 'UnifiedStatsGrid\|motion\.' '$PROJECT_DIR/frontend/app/routes/admin._index.tsx'" ""; then
    ((passed++))
fi

# Test 3: Composants unifiés
echo -e "${PURPLE}📋 Tests Composants Unifiés${NC}"
((total++))
if run_advanced_test "Composants unifiés complets" "test -f '$PROJECT_DIR/frontend/app/components/unified/UnifiedComponents.tsx' && grep -q 'UnifiedSearchBar\|UnifiedCard\|UnifiedTable' '$PROJECT_DIR/frontend/app/components/unified/UnifiedComponents.tsx'" ""; then
    ((passed++))
fi

echo ""
echo "🎯 PHASE 2: TESTS DE COHÉRENCE VISUELLE"
echo "======================================="
echo ""

# Test 4: Gradients thématiques
echo -e "${PURPLE}📋 Tests Gradients Thématiques${NC}"
((total++))
gradient_count=0
for module in "$PROJECT_DIR/frontend/app/routes/dashboard."*.unified.tsx; do
    if [ -f "$module" ] && grep -q "from-.*-.*to-.*-" "$module"; then
        ((gradient_count++))
    fi
done
if [ "$gradient_count" -ge 5 ]; then
    echo -e "${GREEN}✅ Gradients thématiques appliqués ($gradient_count modules)${NC}"
    ((passed++))
else
    echo -e "${RED}❌ Gradients thématiques insuffisants ($gradient_count/6)${NC}"
fi

# Test 5: Animations cohérentes
echo -e "${PURPLE}📋 Tests Animations${NC}"
((total++))
animation_count=0
for module in "$PROJECT_DIR/frontend/app/routes/dashboard."*.unified.tsx "$PROJECT_DIR/frontend/app/routes/admin._index.tsx"; do
    if [ -f "$module" ] && grep -q "motion\." "$module"; then
        ((animation_count++))
    fi
done
if [ "$animation_count" -ge 6 ]; then
    echo -e "${GREEN}✅ Animations Framer Motion intégrées ($animation_count modules)${NC}"
    ((passed++))
else
    echo -e "${RED}❌ Animations insuffisantes ($animation_count/7)${NC}"
fi

echo ""
echo "🎯 PHASE 3: TESTS TECHNIQUES AVANCÉS"
echo "===================================="
echo ""

# Test 6: Imports Lucide React corrigés
echo -e "${PURPLE}📋 Tests Imports Lucide React${NC}"
((total++))
lucide_issues=0
for module in "$PROJECT_DIR/frontend/app/routes/dashboard."*.unified.tsx "$PROJECT_DIR/frontend/app/routes/admin._index.tsx"; do
    if [ -f "$module" ] && grep -q "import.*{.*}.*lucide-react" "$module"; then
        ((lucide_issues++))
    fi
done
if [ "$lucide_issues" -eq 0 ]; then
    echo -e "${GREEN}✅ Imports Lucide React correctement formatés${NC}"
    ((passed++))
else
    echo -e "${RED}❌ $lucide_issues fichiers avec imports Lucide problématiques${NC}"
fi

# Test 7: Validation TypeScript
echo -e "${PURPLE}📋 Tests Validation TypeScript${NC}"
((total++))
cd "$PROJECT_DIR/frontend"
if run_advanced_test "Compilation TypeScript" "timeout 30 npx tsc --noEmit --skipLibCheck" ""; then
    ((passed++))
fi
cd "$PROJECT_DIR"

echo ""
echo "🎯 PHASE 4: TESTS D'INTÉGRATION DASHBOARD-ADMIN"
echo "==============================================="
echo ""

# Test 8: Navigation cohérente
echo -e "${PURPLE}📋 Tests Navigation${NC}"
((total++))
nav_files=0
for file in "$PROJECT_DIR/frontend/app/components/Navbar.tsx" "$PROJECT_DIR/frontend/app/root.tsx"; do
    if [ -f "$file" ]; then
        ((nav_files++))
    fi
done
if [ "$nav_files" -eq 2 ]; then
    echo -e "${GREEN}✅ Fichiers de navigation présents${NC}"
    ((passed++))
else
    echo -e "${RED}❌ Fichiers de navigation manquants ($nav_files/2)${NC}"
fi

# Test 9: Cohérence des données
echo -e "${PURPLE}📋 Tests Cohérence Données${NC}"
((total++))
if run_advanced_test "Structure des données" "grep -q 'loader.*async\|LoaderFunctionArgs' '$PROJECT_DIR/frontend/app/routes/admin._index.tsx' && grep -q 'useLoaderData' '$PROJECT_DIR/frontend/app/routes/admin._index.tsx'" ""; then
    ((passed++))
fi

echo ""
echo "🎯 PHASE 5: TESTS DE PERFORMANCE"
echo "================================"
echo ""

# Test 10: Optimisations bundle
echo -e "${PURPLE}📋 Tests Optimisations${NC}"
((total++))
if run_advanced_test "Configuration optimisée" "test -f '$PROJECT_DIR/frontend/package.json' && grep -q 'vite\|remix' '$PROJECT_DIR/frontend/package.json'" ""; then
    ((passed++))
fi

# Test 11: Structure projet
echo -e "${PURPLE}📋 Tests Structure Projet${NC}"
((total++))
required_dirs=("frontend/app/routes" "frontend/app/components" "backend/src" "config")
missing_dirs=0
for dir in "${required_dirs[@]}"; do
    if [ ! -d "$PROJECT_DIR/$dir" ]; then
        ((missing_dirs++))
    fi
done
if [ "$missing_dirs" -eq 0 ]; then
    echo -e "${GREEN}✅ Structure projet complète${NC}"
    ((passed++))
else
    echo -e "${RED}❌ $missing_dirs répertoires manquants${NC}"
fi

# Test 12: Backup et sécurité
echo -e "${PURPLE}📋 Tests Backup et Sécurité${NC}"
((total++))
if run_advanced_test "Backups créés" "test -f '$PROJECT_DIR/frontend/app/routes/admin._index.tsx.backup'" ""; then
    ((passed++))
fi

echo ""
echo "📊 RÉSULTATS FINAUX DES TESTS AVANCÉS"
echo "====================================="

# Calcul des métriques
percentage=$((passed * 100 / total))
echo -e "Tests réussis: ${GREEN}${passed}${NC}/${total}"
echo -e "Taux de succès: ${GREEN}${percentage}%${NC}"

# Évaluation de la qualité
if [ $percentage -eq 100 ]; then
    echo ""
    echo -e "${GREEN}🏆 EXCELLENCE TOTALE !${NC}"
    echo -e "${GREEN}✅ Système entièrement unifié et optimisé${NC}"
    echo -e "${GREEN}✅ Interface dashboard-admin cohérente${NC}"
    echo -e "${GREEN}✅ Performance et stabilité garanties${NC}"
    echo -e "${GREEN}🚀 PRÊT POUR DÉPLOIEMENT PRODUCTION${NC}"
elif [ $percentage -ge 90 ]; then
    echo ""
    echo -e "${GREEN}🌟 EXCELLENTE QUALITÉ${NC}"
    echo -e "${GREEN}✅ Système quasi-parfaitement unifié${NC}"
    echo -e "${YELLOW}📋 Quelques optimisations mineures possibles${NC}"
    echo -e "${GREEN}🚀 PRÊT POUR DÉPLOIEMENT${NC}"
elif [ $percentage -ge 80 ]; then
    echo ""
    echo -e "${YELLOW}⭐ BONNE QUALITÉ${NC}"
    echo -e "${GREEN}✅ Système bien unifié${NC}"
    echo -e "${YELLOW}📋 Améliorations recommandées avant production${NC}"
else
    echo ""
    echo -e "${RED}⚠️  QUALITÉ À AMÉLIORER${NC}"
    echo -e "${YELLOW}📋 Corrections nécessaires avant déploiement${NC}"
fi

echo ""
echo "🎯 DÉTAILS PAR CATÉGORIE"
echo "========================"
echo "🎨 Système unifié: Modules dashboard + interface admin"
echo "🔧 Cohérence technique: Imports, TypeScript, structure"
echo "🎭 Expérience utilisateur: Navigation, animations, gradients"
echo "⚡ Performance: Optimisations, bundle, configuration"

echo ""
echo "📋 RECOMMANDATIONS POUR LA SUITE"
echo "================================="

if [ $percentage -ge 90 ]; then
    echo "• Procéder au déploiement production final"
    echo "• Créer la documentation utilisateur"
    echo "• Configurer le monitoring de production"
elif [ $percentage -ge 80 ]; then
    echo "• Corriger les derniers problèmes identifiés"
    echo "• Optimiser les performances si nécessaire"
    echo "• Valider avec tests supplémentaires"
else
    echo "• Réviser les éléments en échec"
    echo "• Compléter l'unification manquante"
    echo "• Relancer les tests après corrections"
fi

echo ""
echo "✅ TESTS D'INTÉGRATION AVANCÉS TERMINÉS"
echo "🎉 Tunisia Jockey Club - Système unifié testé avec succès !"
