#!/bin/bash
# 🎯 Script d'analyse performance UI/UX - Tunisia Jockey Club

echo "🎨 === AUDIT PERFORMANCE UI/UX === 🎨"
echo ""

# Variables
FRONTEND_DIR="./frontend"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_DIR="./performance-reports"

mkdir -p $REPORT_DIR

echo "📊 1. Analyse du Bundle CSS..."

# Taille du bundle CSS
cd $FRONTEND_DIR
if [ -f "dist/assets/*.css" ]; then
    CSS_SIZE=$(ls -la dist/assets/*.css 2>/dev/null | awk '{print $5}' | head -1)
    CSS_SIZE_KB=$((CSS_SIZE / 1024))
    echo "   📦 CSS Bundle: ${CSS_SIZE_KB}KB"
    
    # Compression gzip simulée
    CSS_GZIP=$(gzip -c dist/assets/*.css 2>/dev/null | wc -c)
    CSS_GZIP_KB=$((CSS_GZIP / 1024))
    echo "   🗜️  Gzipped: ${CSS_GZIP_KB}KB"
else
    echo "   ⚠️  Bundle CSS non trouvé - Lancement du build..."
    npm run build
fi

echo ""
echo "🧩 2. Audit des Composants..."

# Compter les composants shadcn/ui
SHADCN_COUNT=$(find app/components/ui -name "*.tsx" | wc -l)
echo "   🎯 Composants shadcn/ui: ${SHADCN_COUNT}"

# Composants hippiques custom
HIPPIC_COUNT=$(find app/components/ui -name "hippic-*.tsx" | wc -l)
echo "   🏇 Composants hippiques: ${HIPPIC_COUNT}"

# Analyse des imports
echo "   📥 Analyse des imports..."
TOTAL_IMPORTS=$(grep -r "import.*from" app/ | wc -l)
SHADCN_IMPORTS=$(grep -r "import.*ui/" app/ | wc -l)
EXTERNAL_IMPORTS=$(grep -r "import.*node_modules" app/ 2>/dev/null | wc -l || echo "0")

echo "      • Total imports: ${TOTAL_IMPORTS}"
echo "      • Imports UI: ${SHADCN_IMPORTS}" 
echo "      • Imports externes: ${EXTERNAL_IMPORTS}"

echo ""
echo "🎨 3. Analyse Tailwind CSS..."

# Classes Tailwind utilisées
TAILWIND_CLASSES=$(grep -r "className.*=.*[\"']" app/ | grep -o 'className="[^"]*"' | wc -l)
echo "   🎭 Classes utilisées: ${TAILWIND_CLASSES}"

# Classes custom hippiques
HIPPIC_CLASSES=$(grep -rE "(turf-green|racing-gold|jockey-silk)" app/ | wc -l)
echo "   🏆 Classes hippiques: ${HIPPIC_CLASSES}"

# Animations utilisées
ANIMATIONS=$(grep -rE "(animate-|motion\.|framer)" app/ | wc -l)
echo "   🎬 Animations: ${ANIMATIONS}"

echo ""
echo "⚡ 4. Optimisations Possibles..."

# CSS non utilisé (estimation)
if command -v purgecss >/dev/null 2>&1; then
    echo "   🧹 Analyse PurgeCSS disponible"
    # purgecss --css dist/assets/*.css --content 'app/**/*.tsx' --output purged.css
else
    echo "   📦 Installation PurgeCSS recommandée: npm i -g purgecss"
fi

# Bundle analyzer
if [ -f "package.json" ] && grep -q "webpack-bundle-analyzer" package.json; then
    echo "   📊 Bundle analyzer configuré"
else
    echo "   💡 Recommandation: npm install --save-dev webpack-bundle-analyzer"
fi

echo ""
echo "🚀 5. Recommandations Performance..."

# Calculs et recommandations
if [ "$CSS_SIZE_KB" -gt 200 ]; then
    echo "   ⚠️  Bundle CSS volumineux (${CSS_SIZE_KB}KB > 200KB)"
    echo "      → Activer tree-shaking avancé"
    echo "      → Purger les classes non utilisées"
fi

if [ "$SHADCN_COUNT" -lt 8 ]; then
    echo "   📈 Opportunité: ${SHADCN_COUNT}/20 composants shadcn/ui utilisés"
    echo "      → Implémenter: Toast, Alert, Popover, Sheet"
fi

if [ "$HIPPIC_COUNT" -gt 0 ]; then
    echo "   ✅ Design system hippique actif (${HIPPIC_COUNT} composants)"
else
    echo "   🎯 Créer composants spécialisés hippiques"
fi

echo ""
echo "📋 6. Génération du Rapport..."

# Rapport JSON
cat > "$REPORT_DIR/ui-performance-${TIMESTAMP}.json" << EOF
{
  "timestamp": "${TIMESTAMP}",
  "css": {
    "bundleSize": "${CSS_SIZE_KB}KB",
    "gzipSize": "${CSS_GZIP_KB}KB"
  },
  "components": {
    "shadcnCount": ${SHADCN_COUNT},
    "hippicCount": ${HIPPIC_COUNT},
    "totalImports": ${TOTAL_IMPORTS}
  },
  "tailwind": {
    "classesUsed": ${TAILWIND_CLASSES},
    "hippicClasses": ${HIPPIC_CLASSES},
    "animations": ${ANIMATIONS}
  },
  "recommendations": [
    "Optimize CSS bundle size",
    "Implement missing shadcn components", 
    "Add more hippic specializations"
  ]
}
EOF

echo "   💾 Rapport sauvé: $REPORT_DIR/ui-performance-${TIMESTAMP}.json"

# Rapport Markdown
cat > "$REPORT_DIR/ui-audit-${TIMESTAMP}.md" << EOF
# 🎨 UI/UX Performance Audit - ${TIMESTAMP}

## 📊 Métriques Clés
- **CSS Bundle**: ${CSS_SIZE_KB}KB (gzip: ${CSS_GZIP_KB}KB)
- **Composants UI**: ${SHADCN_COUNT} shadcn + ${HIPPIC_COUNT} hippiques  
- **Classes Tailwind**: ${TAILWIND_CLASSES} utilisées
- **Animations**: ${ANIMATIONS} implémentées

## 🎯 Score Performance
$(if [ "$CSS_SIZE_KB" -lt 150 ]; then echo "✅ CSS: Excellent (<150KB)"; elif [ "$CSS_SIZE_KB" -lt 200 ]; then echo "⚠️ CSS: Bon (150-200KB)"; else echo "❌ CSS: À optimiser (>200KB)"; fi)

$(if [ "$SHADCN_COUNT" -gt 10 ]; then echo "✅ Composants: Complet (>10)"; elif [ "$SHADCN_COUNT" -gt 5 ]; then echo "⚠️ Composants: Partiel (5-10)"; else echo "❌ Composants: Insuffisant (<5)"; fi)

$(if [ "$HIPPIC_COUNT" -gt 3 ]; then echo "✅ Spécialisation: Excellente"; elif [ "$HIPPIC_COUNT" -gt 0 ]; then echo "⚠️ Spécialisation: En cours"; else echo "❌ Spécialisation: Manquante"; fi)

## 🚀 Actions Prioritaires
1. **Optimisation CSS**: $(if [ "$CSS_SIZE_KB" -gt 150 ]; then echo "Réduire de $((CSS_SIZE_KB - 150))KB"; else echo "Maintenir"; fi)
2. **Composants**: Implémenter $((20 - SHADCN_COUNT)) composants manquants
3. **Hippique**: Ajouter $((5 - HIPPIC_COUNT)) spécialisations

## 📈 Évolution
- Baseline: 150KB CSS / 9 composants
- Objectif: <120KB CSS / 15+ composants / 5+ hippiques
- Timeline: 2 semaines

EOF

echo "   📄 Audit complet: $REPORT_DIR/ui-audit-${TIMESTAMP}.md"

echo ""
echo "🎯 7. Prochaines Étapes..."
echo "   1. Implémenter composants hippiques manquants"
echo "   2. Optimiser bundle CSS avec PurgeCSS"
echo "   3. Ajouter tests visuels avec Storybook"
echo "   4. Configurer monitoring performance"

echo ""
echo "✅ === AUDIT TERMINÉ === ✅"
echo "📊 Consultez les rapports dans: $REPORT_DIR/"

# Retour au répertoire racine
cd ..

# Ouvrir le rapport le plus récent si possible
if command -v code >/dev/null 2>&1; then
    echo "🚀 Ouverture du rapport dans VS Code..."
    code "$REPORT_DIR/ui-audit-${TIMESTAMP}.md"
fi
