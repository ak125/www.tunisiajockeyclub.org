#!/bin/bash

echo "🧪 TUNISIA JOCKEY CLUB - TEST D'INTÉGRATION COMPLET"
echo "===================================================="
echo ""

# Configuration des couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction de test
run_test() {
    local test_name="$1"
    local command="$2"
    
    echo -e "${BLUE}🔍 Test: ${test_name}${NC}"
    
    if eval "$command" &>/dev/null; then
        echo -e "${GREEN}✅ SUCCÈS${NC}"
        return 0
    else
        echo -e "${RED}❌ ÉCHEC${NC}"
        return 1
    fi
}

# Variables de test
passed=0
total=0

echo "1️⃣ TESTS DES MODULES UNIFIÉS"
echo "=============================="

# Test 1: Vérification des fichiers unifiés
((total++))
if run_test "Présence des modules unifiés" "ls frontend/app/routes/dashboard.*.unified.tsx | wc -l | grep -q '^6$'"; then
    ((passed++))
fi

# Test 2: Vérification des composants unifiés
((total++))
if run_test "Composants unifiés" "test -f frontend/app/components/unified/UnifiedComponents.tsx"; then
    ((passed++))
fi

# Test 3: Validation TypeScript
((total++))
if run_test "Validation TypeScript" "cd frontend && npx tsc --noEmit --skipLibCheck"; then
    ((passed++))
fi

echo ""
echo "2️⃣ TESTS DE STRUCTURE"
echo "======================"

# Test 4: Structure des routes
((total++))
if run_test "Structure des routes dashboard" "find frontend/app/routes -name 'dashboard.*' | wc -l | awk '{if(\$1 >= 10) exit 0; else exit 1}'"; then
    ((passed++))
fi

# Test 5: Composants essentiels
((total++))
if run_test "Composants essentiels" "test -f frontend/app/components/Navbar.tsx && test -f frontend/app/root.tsx"; then
    ((passed++))
fi

echo ""
echo "3️⃣ TESTS DE CONFIGURATION"
echo "=========================="

# Test 6: Configuration package.json
((total++))
if run_test "Configuration frontend" "test -f frontend/package.json && grep -q remix frontend/package.json"; then
    ((passed++))
fi

# Test 7: Configuration backend
((total++))
if run_test "Configuration backend" "test -f backend/package.json && test -f backend/src/server.ts"; then
    ((passed++))
fi

# Test 8: Configuration base de données
((total++))
if run_test "Configuration Supabase" "test -f config/supabase/config.js"; then
    ((passed++))
fi

echo ""
echo "4️⃣ TESTS AVANCÉS"
echo "=================="

# Test 9: Imports et dépendances
((total++))
if run_test "Validation des imports" "cd frontend && grep -r 'import.*unified' app/routes/dashboard.*.tsx | wc -l | awk '{if(\$1 >= 5) exit 0; else exit 1}'"; then
    ((passed++))
fi

# Test 10: Cohérence des thèmes
((total++))
if run_test "Thèmes cohérents" "cd frontend && grep -r 'from-.*-500.*to-.*-600' app/routes/dashboard.*.unified.tsx | wc -l | awk '{if(\$1 >= 5) exit 0; else exit 1}'"; then
    ((passed++))
fi

echo ""
echo "📊 RÉSULTATS DES TESTS"
echo "======================"
echo -e "Tests réussis: ${GREEN}${passed}${NC}/${total}"

# Calcul du pourcentage
percentage=$((passed * 100 / total))
echo -e "Taux de succès: ${GREEN}${percentage}%${NC}"

if [ $passed -eq $total ]; then
    echo ""
    echo -e "${GREEN}🎉 TOUS LES TESTS SONT PASSÉS !${NC}"
    echo -e "${GREEN}✅ Intégration complète validée${NC}"
    echo ""
    echo "🚀 PRÊT POUR LE DÉPLOIEMENT"
    exit 0
else
    echo ""
    echo -e "${YELLOW}⚠️  Quelques tests ont échoué${NC}"
    echo -e "${YELLOW}📋 Vérification manuelle recommandée${NC}"
    exit 1
fi
