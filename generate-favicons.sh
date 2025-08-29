#!/bin/bash

# Script de génération des favicons et icônes d'application
# Tunisia Jockey Club - Branding institutionnel

echo "🏇 Génération des favicons Tunisia Jockey Club..."

cd /workspaces/tunisia-jockey-club-clean/frontend/public

# Couleurs institutionnelles
PRIMARY="#0F766E"  # Vert institution
ACCENT="#D21C1C"   # Rouge Tunisie

# Créer un favicon simple avec les couleurs institutionnelles
echo "📱 Création du favicon.ico (32x32)..."
convert -size 32x32 xc:"$PRIMARY" \
    -fill "$ACCENT" -draw "circle 16,16 16,8" \
    -fill "white" -pointsize 16 -font "DejaVu-Sans-Bold" \
    -gravity center -annotate +0+0 "TJC" \
    favicon.ico

# Favicon 16x16
echo "🔸 Création du favicon-16x16.png..."
convert -size 16x16 xc:"$PRIMARY" \
    -fill "$ACCENT" -draw "circle 8,8 8,4" \
    -fill "white" -pointsize 8 -font "DejaVu-Sans-Bold" \
    -gravity center -annotate +0+0 "T" \
    favicon-16x16.png

# Favicon 32x32
echo "🔹 Création du favicon-32x32.png..."
convert -size 32x32 xc:"$PRIMARY" \
    -fill "$ACCENT" -draw "circle 16,16 16,8" \
    -fill "white" -pointsize 16 -font "DejaVu-Sans-Bold" \
    -gravity center -annotate +0+0 "TJC" \
    favicon-32x32.png

# Apple Touch Icon 180x180
echo "🍎 Création de l'apple-touch-icon.png (180x180)..."
convert -size 180x180 xc:"$PRIMARY" \
    -fill "$ACCENT" -draw "circle 90,90 90,45" \
    -fill "white" -pointsize 48 -font "DejaVu-Sans-Bold" \
    -gravity center -annotate +0-10 "TJC" \
    -fill "white" -pointsize 20 -font "DejaVu-Sans" \
    -gravity center -annotate +0+25 "1888" \
    apple-touch-icon.png

# Android Chrome 192x192
echo "🤖 Création de android-chrome-192x192.png..."
convert -size 192x192 xc:"$PRIMARY" \
    -fill "$ACCENT" -draw "rectangle 20,20 172,172" \
    -fill "white" -pointsize 48 -font "DejaVu-Sans-Bold" \
    -gravity center -annotate +0-15 "TJC" \
    -fill "white" -pointsize 20 -font "DejaVu-Sans" \
    -gravity center -annotate +0+25 "TUNISIA" \
    android-chrome-192x192.png

# Android Chrome 512x512
echo "📱 Création de android-chrome-512x512.png..."
convert -size 512x512 xc:"$PRIMARY" \
    -fill "$ACCENT" -draw "rectangle 50,50 462,462" \
    -fill "white" -pointsize 120 -font "DejaVu-Sans-Bold" \
    -gravity center -annotate +0-40 "TJC" \
    -fill "white" -pointsize 48 -font "DejaVu-Sans" \
    -gravity center -annotate +0+60 "TUNISIA" \
    -fill "white" -pointsize 32 -font "DejaVu-Sans" \
    -gravity center -annotate +0+110 "JOCKEY CLUB" \
    android-chrome-512x512.png

# MS Tile
echo "🔲 Création de mstile-144x144.png..."
convert -size 144x144 xc:"$PRIMARY" \
    -fill "$ACCENT" -draw "rectangle 10,10 134,134" \
    -fill "white" -pointsize 32 -font "DejaVu-Sans-Bold" \
    -gravity center -annotate +0-10 "TJC" \
    -fill "white" -pointsize 16 -font "DejaVu-Sans" \
    -gravity center -annotate +0+15 "1888" \
    mstile-144x144.png

echo "✅ Favicons générés avec succès!"
echo ""
echo "📁 Fichiers créés:"
ls -la *.ico *.png | grep -E "(favicon|apple|android|mstile)" | head -10
echo ""
echo "🎯 Configuration complète:"
echo "   • favicon.ico (classique)"
echo "   • favicon-16x16.png et favicon-32x32.png"
echo "   • apple-touch-icon.png (iOS)"
echo "   • android-chrome-192x192.png et android-chrome-512x512.png"
echo "   • mstile-144x144.png (Windows)"
echo ""
echo "🚀 Prêt pour le déploiement!"
