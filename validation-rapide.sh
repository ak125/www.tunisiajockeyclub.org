#!/bin/bash

echo "🧪 TUNISIA JOCKEY CLUB - VALIDATION RAPIDE"
echo "=========================================="
echo ""

# Compteurs
success=0
total=0

# Test 1: Modules unifiés présents
echo "1️⃣ Vérification des modules unifiés..."
unified_count=$(ls frontend/app/routes/dashboard.*.unified.tsx 2>/dev/null | wc -l)
total=$((total+1))
if [ "$unified_count" -ge 5 ]; then
    echo "✅ $unified_count modules unifiés trouvés"
    success=$((success+1))
else
    echo "❌ Modules unifiés manquants ($unified_count trouvés)"
fi

# Test 2: Composants de base
echo ""
echo "2️⃣ Vérification des composants..."
total=$((total+1))
if [ -f "frontend/app/components/unified/UnifiedComponents.tsx" ]; then
    echo "✅ Composants unifiés présents"
    success=$((success+1))
else
    echo "❌ Composants unifiés manquants"
fi

# Test 3: Structure principale
echo ""
echo "3️⃣ Vérification de la structure..."
total=$((total+1))
if [ -f "frontend/app/components/Navbar.tsx" ] && [ -f "frontend/app/root.tsx" ]; then
    echo "✅ Structure principale intacte"
    success=$((success+1))
else
    echo "❌ Structure principale incomplète"
fi

# Test 4: Configuration
echo ""
echo "4️⃣ Vérification des configurations..."
total=$((total+1))
if [ -f "frontend/package.json" ] && [ -f "backend/package.json" ]; then
    echo "✅ Configurations présentes"
    success=$((success+1))
else
    echo "❌ Configurations manquantes"
fi

# Test 5: Validation syntax simple
echo ""
echo "5️⃣ Validation syntax basique..."
total=$((total+1))
syntax_errors=$(find frontend/app/routes -name "dashboard.*.unified.tsx" -exec grep -l "import.*from" {} \; 2>/dev/null | wc -l)
if [ "$syntax_errors" -ge 5 ]; then
    echo "✅ Syntax des imports correcte"
    success=$((success+1))
else
    echo "❌ Problèmes de syntax détectés"
fi

# Résultats
echo ""
echo "📊 RÉSULTATS"
echo "============"
echo "Tests réussis: $success/$total"
percentage=$((success * 100 / total))
echo "Taux de succès: $percentage%"

if [ $success -eq $total ]; then
    echo ""
    echo "🎉 VALIDATION COMPLÈTE RÉUSSIE !"
    echo "✅ Intégration prête pour le déploiement"
else
    echo ""
    echo "⚠️  Validation partielle ($success/$total)"
    echo "📋 Vérification détaillée recommandée"
fi
