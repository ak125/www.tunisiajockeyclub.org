#!/bin/bash

echo "🔧 CORRECTION DES IMPORTS LUCIDE-REACT"
echo "======================================"
echo ""

# Script de correction automatique des imports Lucide dans tous les modules unifiés
cd /workspaces/tunisia-jockey-club-clean/frontend

# Liste des fichiers à corriger
files=(
    "app/routes/dashboard.horses.unified.tsx"
    "app/routes/dashboard.jockeys.unified.tsx"
    "app/routes/dashboard.courses.unified.tsx"
    "app/routes/dashboard.analytics.unified.tsx"
    "app/routes/dashboard.settings.unified.tsx"
    "app/routes/dashboard.calendar.unified.tsx"
    "app/components/unified/UnifiedComponents.tsx"
)

echo "📁 Fichiers à corriger: ${#files[@]}"

# Dictionnaire de remplacement des icônes problématiques
declare -A icon_replacements=(
    ["Horse"]="Activity"
    ["Jockey"]="User"
    ["Course"]="MapPin"
    ["Racing"]="Zap"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "🔄 Correction de: $file"
        
        # 1. Remplacer les imports named exports par import *
        sed -i 's/import { \([^}]*\) } from "lucide-react";/import * as Icons from "lucide-react";/g' "$file"
        
        # 2. Remplacer les usages directs par Icons.NomIcone
        for old_icon in "${!icon_replacements[@]}"; do
            new_icon="${icon_replacements[$old_icon]}"
            sed -i "s/<$old_icon /<Icons.$new_icon /g" "$file"
        done
        
        # 3. Remplacer les icônes courantes
        common_icons=("Search" "Filter" "Plus" "Edit" "Trash" "Eye" "Calendar" "Trophy" "Star" "TrendingUp" "Settings" "User" "Users" "Activity" "BarChart" "PieChart" "MapPin" "Zap" "Clock" "Check" "X" "Menu" "ChevronDown" "ChevronRight" "Home" "Database" "Shield" "Bell" "Mail" "Phone" "Globe" "Bookmark" "Heart" "Share" "Download" "Upload" "RefreshCw")
        
        for icon in "${common_icons[@]}"; do
            sed -i "s/<$icon /<Icons.$icon /g" "$file"
        done
        
        echo "✅ $file corrigé"
    else
        echo "⚠️  $file introuvable"
    fi
done

echo ""
echo "🧹 Nettoyage des imports multiples..."

# Nettoyer les imports multiples
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        # Supprimer les imports lucide-react en double
        awk '!seen[$0]++ || !/import.*lucide-react/' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    fi
done

echo ""
echo "✅ CORRECTION TERMINÉE"
echo "📋 Vérifiez que les icônes sont correctes dans chaque fichier"
