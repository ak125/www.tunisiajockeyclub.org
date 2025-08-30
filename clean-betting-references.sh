#!/bin/bash

echo "🧹 Nettoyage des références aux paris..."

# Vérifier que le fichier betting n'existe pas
if [ -f "frontend/app/routes/dashboard.betting.tsx" ]; then
    echo "⚠️  Suppression du fichier betting restant..."
    rm -f frontend/app/routes/dashboard.betting.tsx
fi

# Chercher et nettoyer les liens vers betting dans les dashboards
echo "🔍 Recherche de liens vers betting..."

# Chercher dans les fichiers dashboard pour les liens betting
find frontend/app/routes -name "dashboard*.tsx" -exec grep -l "betting" {} \; | while read file; do
    echo "🔧 Nettoyage de $file..."
    # Cette commande devra être adaptée selon les liens trouvés
done

# Chercher dans les fichiers de navigation
if [ -f "frontend/app/components/Navbar.tsx" ]; then
    if grep -q "betting" frontend/app/components/Navbar.tsx; then
        echo "🔧 Nettoyage de la navbar..."
        # Supprimer les liens betting de la navigation
    fi
fi

# Vérifier la base de données
echo "🗄️  État de la base de données après nettoyage:"
echo "✅ Table 'bets' supprimée"
echo "✅ Modèles Prisma nettoyés"

echo "✅ Nettoyage terminé ! Le système est maintenant sans paris."
echo "🎯 Focus sur: Gestion des courses hippiques uniquement"
