#!/bin/bash
# Installation rapide des dépendances essentielles
# Stack: Shadcn/ui + Lucide React + Framer Motion

echo "🚀 Installation rapide - Tunisia Jockey Club"
echo "📦 Installation des dépendances essentielles..."

cd frontend

# Installation des packages essentiels en une fois
npm install \
  framer-motion \
  recharts \
  zustand \
  @tanstack/react-query \
  class-variance-authority \
  clsx \
  tailwind-merge \
  socket.io-client \
  date-fns \
  lucide-react \
  cmdk \
  vaul \
  sonner \
  @hookform/resolvers \
  react-hook-form

echo "✅ Packages installés!"

# Créer le fichier utils s'il n'existe pas
if [ ! -f "app/lib/utils.ts" ]; then
  mkdir -p app/lib
  cat > app/lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("fr-TN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency: "TND",
  }).format(amount)
}
EOF
  echo "✅ Fichier utils.ts créé"
fi

# Créer les dossiers de structure
mkdir -p app/stores app/hooks app/services app/components/dashboard app/routes/admin

echo "✅ Structure des dossiers créée"

# Installation des composants Shadcn/ui (optionnel)
echo "📋 Pour installer les composants Shadcn/ui, exécutez:"
echo "  npx shadcn-ui@latest init"
echo "  npx shadcn-ui@latest add button card dialog table badge"

echo ""
echo "🎯 Installation terminée!"
echo "🔧 Vous pouvez maintenant utiliser:"
echo "  - Framer Motion pour les animations"
echo "  - Recharts pour les graphiques"
echo "  - Zustand pour la gestion d'état"
echo "  - Lucide React pour les icônes"
echo "  - Shadcn/ui pour les composants UI"
echo ""
echo "🚀 Prochaine étape: Créer le dashboard admin"
