#!/bin/bash

# Script de génération d'images Open Graph 1280x640
# Optimisé pour le SEO et les réseaux sociaux

# Couleurs institutionnelles Tunisia Jockey Club
PRIMARY_COLOR="#0F766E"  # Vert institution
ACCENT_COLOR="#D21C1C"   # Rouge Tunisie
BACKGROUND="#FFFFFF"     # Blanc
TEXT_COLOR="#1F2937"     # Gris foncé

echo "🎨 Génération des images Open Graph 1280x640..."

# Vérifier si ImageMagick est installé
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick n'est pas installé. Installation..."
    sudo apt-get update && sudo apt-get install -y imagemagick
fi

cd /workspaces/tunisia-jockey-club-clean/frontend/public/images/og

# 1. Page d'accueil - TJC Home
echo "📄 Création de tjc-home-1280x640.jpg..."
convert -size 1280x640 xc:"$BACKGROUND" \
    -fill "$PRIMARY_COLOR" -draw "rectangle 0,0 1280,120" \
    -fill "$ACCENT_COLOR" -draw "rectangle 0,520 1280,640" \
    -fill "$TEXT_COLOR" -pointsize 72 -font "Arial-Bold" \
    -gravity center -annotate +0-100 "TUNISIA JOCKEY CLUB" \
    -fill "$PRIMARY_COLOR" -pointsize 36 -font "Arial" \
    -gravity center -annotate +0-30 "Institution Hippique Certifiée IFHA depuis 1888" \
    -fill "white" -pointsize 28 -font "Arial" \
    -gravity center -annotate +0+280 "Excellence • Intégrité • Performance" \
    tjc-home-1280x640.jpg

# 2. Dashboard - Analytics professionnels
echo "📊 Création de tjc-dashboard-1280x640.jpg..."
convert -size 1280x640 xc:"$BACKGROUND" \
    -fill "$PRIMARY_COLOR" -draw "rectangle 0,0 1280,100" \
    -fill "$ACCENT_COLOR" -draw "rectangle 1080,100 1280,640" \
    -fill "white" -pointsize 64 -font "Arial-Bold" \
    -gravity northwest -annotate +40+20 "DASHBOARD PRO" \
    -fill "$TEXT_COLOR" -pointsize 48 -font "Arial-Bold" \
    -gravity center -annotate +0-80 "Analytics IFHA" \
    -fill "$PRIMARY_COLOR" -pointsize 32 -font "Arial" \
    -gravity center -annotate +0-20 "KPIs • Statistiques • Performance" \
    -fill "$TEXT_COLOR" -pointsize 24 -font "Arial" \
    -gravity center -annotate +0+40 "Tableau de bord institutionnel" \
    -fill "white" -pointsize 20 -font "Arial" \
    -gravity southeast -annotate +20+20 "En temps réel" \
    tjc-dashboard-1280x640.jpg

# 3. Statuts - Gouvernance officielle
echo "📋 Création de tjc-statuts-1280x640.jpg..."
convert -size 1280x640 xc:"$BACKGROUND" \
    -fill "$TEXT_COLOR" -draw "rectangle 40,40 1240,600" \
    -fill "$PRIMARY_COLOR" -draw "rectangle 60,60 1220,160" \
    -fill "white" -pointsize 56 -font "Arial-Bold" \
    -gravity center -annotate +0-200 "STATUTS OFFICIELS" \
    -fill "$TEXT_COLOR" -pointsize 36 -font "Arial" \
    -gravity center -annotate +0-80 "Gouvernance institutionnelle" \
    -fill "$PRIMARY_COLOR" -pointsize 28 -font "Arial" \
    -gravity center -annotate +0-20 "Certification IFHA • Depuis 1888" \
    -fill "$TEXT_COLOR" -pointsize 24 -font "Arial" \
    -gravity center -annotate +0+40 "Statuts • Missions • Valeurs" \
    -fill "$ACCENT_COLOR" -pointsize 20 -font "Arial-Bold" \
    -gravity center -annotate +0+100 "TUNISIA JOCKEY CLUB" \
    tjc-statuts-1280x640.jpg

# 4. Charte - Excellence et valeurs
echo "🏆 Création de tjc-charte-1280x640.jpg..."
convert -size 1280x640 xc:"$BACKGROUND" \
    -fill "$PRIMARY_COLOR" -draw "circle 200,200 200,120" \
    -fill "$ACCENT_COLOR" -draw "circle 1080,440 1080,380" \
    -fill "$TEXT_COLOR" -pointsize 60 -font "Arial-Bold" \
    -gravity center -annotate +0-120 "CHARTE D'EXCELLENCE" \
    -fill "$PRIMARY_COLOR" -pointsize 32 -font "Arial" \
    -gravity center -annotate +0-50 "Valeurs • Mission • Engagement Qualité" \
    -fill "$TEXT_COLOR" -pointsize 26 -font "Arial" \
    -gravity center -annotate +0+10 "Standards IFHA • Innovation • Intégrité" \
    -fill "$ACCENT_COLOR" -pointsize 22 -font "Arial-Bold" \
    -gravity center -annotate +0+80 "Tunisia Jockey Club - Excellence depuis 1888" \
    tjc-charte-1280x640.jpg

# 5. Mentions légales - Conformité RGPD
echo "⚖️ Création de tjc-mentions-1280x640.jpg..."
convert -size 1280x640 xc:"$BACKGROUND" \
    -fill "$TEXT_COLOR" -draw "rectangle 0,0 1280,120" \
    -fill "$TEXT_COLOR" -draw "rectangle 0,520 1280,640" \
    -fill "white" -pointsize 54 -font "Arial-Bold" \
    -gravity center -annotate +0-200 "MENTIONS LÉGALES" \
    -fill "$TEXT_COLOR" -pointsize 32 -font "Arial" \
    -gravity center -annotate +0-80 "Protection des données • RGPD" \
    -fill "$PRIMARY_COLOR" -pointsize 28 -font "Arial" \
    -gravity center -annotate +0-20 "Conditions d'utilisation" \
    -fill "$TEXT_COLOR" -pointsize 24 -font "Arial" \
    -gravity center -annotate +0+40 "Propriété intellectuelle • Cookies" \
    -fill "white" -pointsize 20 -font "Arial" \
    -gravity center -annotate +0+280 "Tunisia Jockey Club - Conformité légale" \
    tjc-mentions-1280x640.jpg

echo "✅ Images Open Graph générées avec succès!"
echo "📁 Emplacement: /workspaces/tunisia-jockey-club-clean/frontend/public/images/og/"
echo "🔍 Vérification des tailles..."

for img in *.jpg; do
    if [ -f "$img" ]; then
        size=$(identify -format "%wx%h" "$img" 2>/dev/null || echo "Error")
        filesize=$(du -h "$img" | cut -f1)
        echo "   $img : $size ($filesize)"
    fi
done

echo ""
echo "🎯 Images optimisées pour:"
echo "   • Facebook Open Graph"
echo "   • Twitter Cards"
echo "   • LinkedIn partage"
echo "   • WhatsApp preview"
echo "   • Discord embed"
echo ""
echo "🚀 Ratio 2:1 (1280x640) - Standard Open Graph optimisé!"
