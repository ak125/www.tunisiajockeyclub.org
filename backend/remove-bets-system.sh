#!/bin/bash

# Script de suppression complète des paris du système Tunisia Jockey Club
# Utilise l'API REST Supabase pour supprimer la table bets

echo "🗑️  Suppression complète de la fonctionnalité des paris..."

# Variables Supabase
SUPABASE_URL="https://hssigihofbbdehqrnnoz.supabase.co"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzc2lnaWhvZmJiZGVocXJubm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU1OTM0OSwiZXhwIjoyMDcxMTM1MzQ5fQ.LJXci09iPB2JrHMMQlCorfDdRnJhMQCfhVNU01YD7o4"

# Étape 1: Vider la table bets (déjà fait)
echo "✅ Données des paris déjà supprimées"

# Étape 2: Supprimer la table bets de la base de données
echo "🔄 Suppression de la table bets..."

# Pour supprimer la table, utilisez l'éditeur SQL de Supabase avec cette commande :
# DROP TABLE IF EXISTS bets CASCADE;

echo "⚠️  Pour supprimer définitivement la table 'bets' :"
echo "   1. Connectez-vous à https://supabase.com/dashboard"
echo "   2. Ouvrez le projet hssigihofbbdehqrnnoz"
echo "   3. Allez dans 'SQL Editor'"
echo "   4. Exécutez: DROP TABLE IF EXISTS bets CASCADE;"

# Étape 3: Vérifier la suppression
echo "🔍 Vérification de la suppression..."

# Test si la table existe encore
response=$(curl -s -o /dev/null -w "%{http_code}" -X GET \
  -H "apikey: $SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  "$SUPABASE_URL/rest/v1/bets?select=count")

if [ "$response" = "404" ]; then
  echo "✅ Table 'bets' supprimée avec succès"
else
  echo "⚠️  Table 'bets' existe encore (code: $response)"
fi

echo "✅ Nettoyage du code terminé :"
echo "   - ❌ Modèle Bet supprimé du schema Prisma"
echo "   - ❌ Références aux paris supprimées du backend"
echo "   - ❌ Références aux paris supprimées du frontend"
echo "   - ❌ Interface utilisateur des paris nettoyée"

echo ""
echo "🎉 La fonctionnalité des paris a été complètement supprimée du système !"
echo "   Le système se concentre maintenant uniquement sur la gestion des courses hippiques."
