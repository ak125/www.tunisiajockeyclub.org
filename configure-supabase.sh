#!/bin/bash

echo "🔧 CONFIGURATION SUPABASE - TUNISIA JOCKEY CLUB"
echo "==============================================="
echo ""

ENV_FILE="/workspaces/tunisia-jockey-club-clean/.env"

echo "📋 Ce script va vous aider à configurer les variables Supabase."
echo "Vous devez avoir ces informations depuis votre dashboard Supabase:"
echo ""
echo "1. URL du projet (https://your-project.supabase.co)"
echo "2. Clé API anonyme (anon key)"  
echo "3. Clé de service (service role key)"
echo "4. URL de la base de données PostgreSQL"
echo ""

# Vérifier si .env existe
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Fichier .env introuvable. Création..."
    cat > "$ENV_FILE" << 'EOF'
# Variables d'environnement pour Tunisia Jockey Club
NODE_ENV=development
PORT=3000
SESSION_SECRET=tunisia-jockey-club-secret-key-2025
REDIS_URL=redis://localhost:6379
EOF
fi

echo "📄 Fichier .env actuel:"
echo "======================"
cat "$ENV_FILE"
echo ""

echo "🔧 INSTRUCTIONS DE CONFIGURATION:"
echo "=================================="
echo ""
echo "1. Allez sur https://supabase.com/dashboard"
echo "2. Sélectionnez votre projet Tunisia Jockey Club"
echo "3. Allez dans Settings > API"
echo "4. Copiez les informations suivantes:"
echo ""
echo "   SUPABASE_URL=https://[votre-project-ref].supabase.co"
echo "   SUPABASE_ANON_KEY=[votre-anon-key]"
echo "   SUPABASE_SERVICE_ROLE_KEY=[votre-service-role-key]"
echo ""
echo "5. Allez dans Settings > Database"
echo "6. Copiez la DATABASE_URL:"
echo ""
echo "   DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
echo ""

# Proposer d'éditer le fichier
echo "📝 ACTIONS POSSIBLES:"
echo "===================="
echo ""
echo "Option 1: Éditer manuellement le fichier .env avec VS Code"
echo "Option 2: Ajouter les variables via ce script (pas encore implémenté)"
echo "Option 3: Utiliser les variables d'environnement du système"
echo ""

# Vérifier les variables actuelles
echo "🔍 VARIABLES ACTUELLEMENT DÉFINIES:"
echo "==================================="

env_vars=("SUPABASE_URL" "SUPABASE_ANON_KEY" "SUPABASE_SERVICE_ROLE_KEY" "DATABASE_URL")

all_defined=true
for var in "${env_vars[@]}"; do
    if [ -n "${!var}" ]; then
        echo "✅ $var: défini"
    else
        echo "❌ $var: non défini"
        all_defined=false
    fi
done

echo ""

if [ "$all_defined" = true ]; then
    echo "✅ TOUTES LES VARIABLES SONT DÉFINIES !"
    echo ""
    echo "🚀 Redémarrez le serveur pour appliquer les changements:"
    echo "   cd /workspaces/tunisia-jockey-club-clean"
    echo "   npm run dev"
    echo ""
    echo "🔍 Testez ensuite avec:"
    echo "   curl -X POST http://localhost:3000/api/auth/users-sample"
else
    echo "⚠️  VARIABLES MANQUANTES - Suivez les instructions ci-dessus"
fi

echo ""
echo "📊 RAPPEL - VOS DONNÉES ACTUELLES:"
echo "=================================="
echo "• Users: 97 utilisateurs"
echo "• Horses: 46 chevaux" 
echo "• Jockeys: 42 jockeys"
echo "• Owners: 33 propriétaires"
echo "• Trainers: 21 entraîneurs"
echo "• Races: 8 courses"
echo "• Race entries: 16 inscriptions"
echo "• Race results: 8 résultats"
echo "• Racecourses: 5 hippodromes"
echo ""

echo "🎯 Une fois configuré, vous pourrez vous connecter avec vos vrais utilisateurs !"
echo ""
echo "📧 En attendant, utilisez les comptes de développement:"
echo "   • monia@gmail.com / password123"
echo "   • admin@tjc.tn / admin123" 
echo "   • test@test.com / test123"
echo ""
echo "🕒 Configuration terminée à: $(date)"
