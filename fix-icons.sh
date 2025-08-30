#!/bin/bash

echo "🔧 CORRECTION RAPIDE DES ICÔNES LUCIDE"
echo "====================================="

cd /workspaces/tunisia-jockey-club-clean/frontend

# Correction des icônes dans tous les modules unifiés
echo "📝 Correction des icônes inexistantes..."

# Dashboard Jockeys
sed -i 's/icon: Jockey/icon: Icons.User/g' app/routes/dashboard.jockeys.unified.tsx
sed -i 's/icon={Jockey}/icon={Icons.User}/g' app/routes/dashboard.jockeys.unified.tsx

# Dashboard Courses  
sed -i 's/icon: Course/icon: Icons.MapPin/g' app/routes/dashboard.courses.unified.tsx
sed -i 's/icon={Course}/icon={Icons.MapPin}/g' app/routes/dashboard.courses.unified.tsx
sed -i 's/icon: Racing/icon: Icons.Zap/g' app/routes/dashboard.courses.unified.tsx
sed -i 's/icon={Racing}/icon={Icons.Zap}/g' app/routes/dashboard.courses.unified.tsx

# Dashboard Analytics
sed -i 's/icon: BarChart3/icon: Icons.BarChart/g' app/routes/dashboard.analytics.unified.tsx
sed -i 's/icon={BarChart3}/icon={Icons.BarChart}/g' app/routes/dashboard.analytics.unified.tsx

# Dashboard Settings
sed -i 's/icon: Cog/icon: Icons.Settings/g' app/routes/dashboard.settings.unified.tsx
sed -i 's/icon={Cog}/icon={Icons.Settings}/g' app/routes/dashboard.settings.unified.tsx

# Dashboard Calendar
sed -i 's/icon: CalendarDays/icon: Icons.Calendar/g' app/routes/dashboard.calendar.unified.tsx
sed -i 's/icon={CalendarDays}/icon={Icons.Calendar}/g' app/routes/dashboard.calendar.unified.tsx

echo "🧹 Nettoyage des références non importées..."

# Supprimer les références à des icônes non importées dans tous les fichiers
for file in app/routes/dashboard.*.unified.tsx; do
    if [ -f "$file" ]; then
        echo "🔄 Nettoyage de: $file"
        # Remplacer les icônes problématiques par des alternatives
        sed -i 's/Jockey/Icons.User/g' "$file"
        sed -i 's/Course/Icons.MapPin/g' "$file"  
        sed -i 's/Racing/Icons.Zap/g' "$file"
        sed -i 's/BarChart3/Icons.BarChart/g' "$file"
        sed -i 's/Cog/Icons.Settings/g' "$file"
        sed -i 's/CalendarDays/Icons.Calendar/g' "$file"
    fi
done

echo "✅ CORRECTION TERMINÉE"
