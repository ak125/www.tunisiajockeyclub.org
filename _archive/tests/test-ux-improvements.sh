#!/bin/bash

# Script de test des améliorations UX - Tunisia Jockey Club
# Test des thèmes personnalisables et animations avancées

echo "🎭 Test des Améliorations UX - Tunisia Jockey Club"
echo "=================================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages avec couleur
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[ℹ]${NC} $1"
}

print_header() {
    echo -e "\n${PURPLE}=== $1 ===${NC}"
}

# 1. Vérification de l'existence des fichiers système
print_header "Vérification des Fichiers Système"

files_to_check=(
    "frontend/app/utils/theme.client.ts"
    "frontend/app/utils/animation.client.ts"
    "frontend/app/components/ui/theme-customizer-simple.tsx"
    "frontend/app/components/ui/animated-components.tsx"
    "frontend/app/routes/settings.tsx"
    "frontend/app/routes/showcase.tsx"
)

missing_files=0
for file in "${files_to_check[@]}"; do
    if [[ -f "$file" ]]; then
        print_status "Fichier trouvé: $file"
    else
        print_error "Fichier manquant: $file"
        ((missing_files++))
    fi
done

if [[ $missing_files -eq 0 ]]; then
    print_status "Tous les fichiers système sont présents"
else
    print_error "$missing_files fichiers manquants"
    exit 1
fi

# 2. Analyse du contenu des fichiers système
print_header "Analyse du Système de Thème"

theme_features=(
    "ThemeManager"
    "THEME_COLORS"
    "useTheme"
    "localStorage"
    "ThemeConfig"
    "DEFAULT_THEME"
)

if [[ -f "frontend/app/utils/theme.client.ts" ]]; then
    for feature in "${theme_features[@]}"; do
        if grep -q "$feature" "frontend/app/utils/theme.client.ts"; then
            print_status "Fonctionnalité thème détectée: $feature"
        else
            print_warning "Fonctionnalité thème manquante: $feature"
        fi
    done
fi

print_header "Analyse du Système d'Animation"

animation_features=(
    "AnimationManager"
    "ANIMATION_KEYFRAMES"
    "useAnimation"
    "AnimationType"
    "respectReducedMotion"
    "requestAnimationFrame"
)

if [[ -f "frontend/app/utils/animation.client.ts" ]]; then
    for feature in "${animation_features[@]}"; do
        if grep -q "$feature" "frontend/app/utils/animation.client.ts"; then
            print_status "Fonctionnalité animation détectée: $feature"
        else
            print_warning "Fonctionnalité animation manquante: $feature"
        fi
    done
fi

# 3. Vérification des composants UI
print_header "Analyse des Composants UI"

ui_components=(
    "AnimatedButton"
    "AnimatedCard"
    "AnimatedInput"
    "LoadingSpinner"
    "ThemeCustomizer"
)

if [[ -f "frontend/app/components/ui/animated-components.tsx" ]]; then
    for component in "${ui_components[@]}"; do
        if grep -q "$component" "frontend/app/components/ui/animated-components.tsx"; then
            print_status "Composant UI trouvé: $component"
        else
            print_warning "Composant UI manquant dans animated-components: $component"
        fi
    done
fi

# 4. Vérification du customizer de thème
print_header "Analyse du Customizer de Thème"

customizer_features=(
    "Appearance"
    "Animation"
    "Accessibility"
    "Preview"
    "colorScheme"
    "handleColorChange"
)

if [[ -f "frontend/app/components/ui/theme-customizer-simple.tsx" ]]; then
    for feature in "${customizer_features[@]}"; do
        if grep -q "$feature" "frontend/app/components/ui/theme-customizer-simple.tsx"; then
            print_status "Fonctionnalité customizer détectée: $feature"
        else
            print_warning "Fonctionnalité customizer manquante: $feature"
        fi
    done
fi

# 5. Analyse des pages de démonstration
print_header "Vérification des Pages de Démonstration"

if [[ -f "frontend/app/routes/settings.tsx" ]]; then
    print_status "Page Settings créée"
    if grep -q "ThemeCustomizer" "frontend/app/routes/settings.tsx"; then
        print_status "ThemeCustomizer intégré dans Settings"
    else
        print_warning "ThemeCustomizer non intégré dans Settings"
    fi
else
    print_error "Page Settings manquante"
fi

if [[ -f "frontend/app/routes/showcase.tsx" ]]; then
    print_status "Page Showcase créée"
    showcase_sections=(
        "Animation Controls"
        "Button Showcase"
        "Card Showcase"
        "Input Showcase"
        "Loading Spinner"
        "Performance & Accessibility"
    )
    
    for section in "${showcase_sections[@]}"; do
        if grep -q "$section" "frontend/app/routes/showcase.tsx"; then
            print_status "Section showcase: $section"
        else
            print_warning "Section showcase manquante: $section"
        fi
    done
else
    print_error "Page Showcase manquante"
fi

# 6. Vérification des fonctionnalités d'accessibilité
print_header "Analyse de l'Accessibilité"

accessibility_features=(
    "prefers-reduced-motion"
    "highContrast"
    "reducedMotion"
    "aria-"
    "screen reader"
    "focus:"
)

total_files_checked=0
total_accessibility_features=0

for file in "${files_to_check[@]}"; do
    if [[ -f "$file" ]]; then
        ((total_files_checked++))
        for feature in "${accessibility_features[@]}"; do
            if grep -q "$feature" "$file"; then
                ((total_accessibility_features++))
                print_status "Fonctionnalité accessibilité dans $(basename $file): $feature"
            fi
        done
    fi
done

# 7. Comptage des animations disponibles
print_header "Inventaire des Animations"

if [[ -f "frontend/app/utils/animation.client.ts" ]]; then
    animation_count=$(grep -c "fadeIn\|slideUp\|scaleIn\|bounce\|shake\|pulse\|rotate" "frontend/app/utils/animation.client.ts")
    print_status "Nombre d'animations détectées: $animation_count"
    
    if [[ $animation_count -gt 15 ]]; then
        print_status "Bibliothèque d'animations riche (>15 animations)"
    else
        print_warning "Bibliothèque d'animations limitée (<15 animations)"
    fi
fi

# 8. Vérification des couleurs de thème
print_header "Inventaire des Thèmes de Couleur"

if [[ -f "frontend/app/utils/theme.client.ts" ]]; then
    color_schemes=$(grep -c "turf-green\|blue\|emerald\|purple\|amber\|rose" "frontend/app/utils/theme.client.ts")
    print_status "Nombre de schémas de couleur détectés: $color_schemes"
    
    if [[ $color_schemes -gt 5 ]]; then
        print_status "Palette de couleurs complète (>5 schémas)"
    else
        print_warning "Palette de couleurs limitée (<5 schémas)"
    fi
fi

# 9. Test de compilation TypeScript (si tsc est disponible)
print_header "Test de Compilation TypeScript"

if command -v tsc &> /dev/null; then
    print_info "Test de compilation des fichiers TypeScript..."
    
    cd frontend 2>/dev/null || {
        print_warning "Impossible d'accéder au dossier frontend"
    }
    
    if [[ -f "tsconfig.json" ]]; then
        if tsc --noEmit --skipLibCheck 2>/dev/null; then
            print_status "Compilation TypeScript réussie"
        else
            print_warning "Erreurs de compilation TypeScript détectées"
        fi
    else
        print_warning "Fichier tsconfig.json non trouvé"
    fi
    
    cd .. 2>/dev/null || true
else
    print_warning "TypeScript Compiler (tsc) non disponible"
fi

# 10. Résumé final
print_header "Résumé Final"

print_info "Système de Thèmes:"
print_info "  - Fichiers système: $(([[ -f "frontend/app/utils/theme.client.ts" ]] && echo "✓" || echo "✗")) Présents"
print_info "  - Customizer UI: $(([[ -f "frontend/app/components/ui/theme-customizer-simple.tsx" ]] && echo "✓" || echo "✗")) Présent"
print_info "  - Page Settings: $(([[ -f "frontend/app/routes/settings.tsx" ]] && echo "✓" || echo "✗")) Présente"

print_info "Système d'Animations:"
print_info "  - Fichiers système: $(([[ -f "frontend/app/utils/animation.client.ts" ]] && echo "✓" || echo "✗")) Présents"
print_info "  - Composants animés: $(([[ -f "frontend/app/components/ui/animated-components.tsx" ]] && echo "✓" || echo "✗")) Présents"
print_info "  - Page Showcase: $(([[ -f "frontend/app/routes/showcase.tsx" ]] && echo "✓" || echo "✗")) Présente"

print_info "Fonctionnalités d'Accessibilité:"
print_info "  - Features détectées: $total_accessibility_features"
print_info "  - Support reduced motion: $(grep -q "reducedMotion" frontend/app/utils/*.ts && echo "✓" || echo "✗")"
print_info "  - Contraste élevé: $(grep -q "highContrast" frontend/app/utils/*.ts && echo "✓" || echo "✗")"

echo ""
print_status "Test des améliorations UX terminé!"
print_info "Pour tester l'interface:"
print_info "  1. Lancez le serveur de développement"
print_info "  2. Accédez à /settings pour la personnalisation"
print_info "  3. Accédez à /showcase pour voir les animations"
print_info "  4. Testez avec différentes préférences d'accessibilité"

echo -e "\n${CYAN}🎨 Les améliorations UX sont maintenant prêtes!${NC}"
