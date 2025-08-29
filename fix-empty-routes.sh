#!/bin/bash

echo "=== Correction des Routes Vides ==="

# Liste des fichiers vides détectés
FILES=(
  "reglementation.rating.tsx"
  "executive-demo.tsx"  
  "dashboard.new.tsx"
  "_index.new.tsx"
  "professional-demo-clean.tsx"
  "reglementation/rating/simple.tsx"
)

cd /workspaces/tunisia-jockey-club-clean/frontend/app/routes

for file in "${FILES[@]}"; do
  if [ -f "$file" ] && [ ! -s "$file" ]; then
    echo "Correction de: $file"
    
    # Générer le nom de composant depuis le nom de fichier
    COMPONENT_NAME=$(echo "$file" | sed 's/\.tsx$//' | sed 's/[^a-zA-Z0-9]//g' | sed 's/^./\U&/')
    
    cat > "$file" << EOF
import { json } from "@remix-run/node";

export const loader = async () => {
  return json({ message: "Page en développement" });
};

export default function ${COMPONENT_NAME}() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">${COMPONENT_NAME}</h1>
      <p className="text-gray-600">Cette page est en cours de développement...</p>
      <div className="mt-4">
        <a href="/dashboard" className="text-blue-600 hover:text-blue-800">
          ← Retour au Dashboard
        </a>
      </div>
    </div>
  );
}
EOF
    echo "✅ $file corrigé"
  fi
done

echo ""
echo "🏇 Correction des routes vides terminée ! 🏇"
