# 🎨 Performance & Bundle Analysis

## 📊 Bundle CSS Actuel

### Taille Baseline
- **CSS Total**: ~150KB (acceptable)
- **Gzipped**: ~25KB 
- **Unused CSS**: ~30% (estimation)

### Composants shadcn/ui Active
✅ **Installés** (9/20):
- Button, Card, Badge, Table, Dialog
- Input, Select, Label
- ❌ **Manquants**: Toast, Alert, Popover, Accordion, Tabs, Sheet

### Variables CSS
- **Custom Properties**: 45+ variables
- **Couleurs**: 20+ tokens (trop complexe)
- **Animations**: 10 définies, 3 utilisées

## ⚡ Optimisations Recommandées

### 1. Purge CSS Avancé
```js
// tailwind.config.cjs
module.exports = {
  content: {
    files: ['./app/**/*.{js,jsx,ts,tsx}'],
    extract: {
      // Extraire classes dynamiques
      tsx: (content) => content.match(/class(Name)?=["']([^"']*)/g)?.map(match => match.split(/["']/)[1]) || []
    }
  },
  
  // Safelist pour classes générées dynamiquement
  safelist: [
    // Classes hippiques essentielles
    'bg-turf-green-500',
    'text-racing-gold-600', 
    'border-jockey-silk-400',
    
    // Positions dynamiques (1er, 2e, 3e...)
    {
      pattern: /^(bg|text|border)-(racing-gold|turf-green|jockey-silk)-(100|200|300|400|500|600)$/,
      variants: ['hover', 'active', 'focus']
    },
    
    // Animations contextuelles
    'animate-pulse-slow',
    'animate-shimmer',
    'animate-bounce-subtle'
  ]
}
```

### 2. Variables CSS Optimisées
```css
/* global.css - Design Tokens Consolidés */
:root {
  /* Couleurs Primaires (Réduites de 20+ à 8) */
  --racing-primary: #2D5016;    /* Turf Green */
  --racing-secondary: #FFD700;  /* Racing Gold */
  --racing-accent: #8B4513;     /* Jockey Silk */
  --racing-neutral: #6B7280;    /* Gray */
  
  /* Variantes Automatiques (HSL) */
  --racing-primary-light: hsl(from var(--racing-primary) h s calc(l + 20%));
  --racing-primary-dark: hsl(from var(--racing-primary) h s calc(l - 20%));
  
  /* Espacements Harmonisés */
  --space-racing: 1.5rem;  /* 24px */
  --radius-racing: 0.75rem; /* 12px */
  
  /* Shadows Contextuelles */
  --shadow-racing: 0 10px 40px rgba(255, 215, 0, 0.3);
  --shadow-turf: 0 10px 40px rgba(45, 80, 22, 0.2);
}
```

### 3. Bundle Splitting
```js
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer shadcn/ui
          'shadcn-ui': ['@radix-ui/react-slot', '@radix-ui/react-dialog'],
          
          // CSS critique séparé
          'critical-styles': ['./app/global.css'],
          
          // Animations optionnelles
          'animations': ['framer-motion']
        }
      }
    }
  }
})
```

## 📈 Objectifs Performance

### Métriques Cibles
- **CSS Total**: <120KB (-20%)
- **Gzipped**: <20KB (-20%)
- **Unused CSS**: <15% (-50%)
- **First Paint**: <800ms
- **LCP**: <1.2s

### Outils de Mesure
```bash
# Bundle analyzer
npm install --save-dev tailwindcss-bundle-analyzer

# Critical CSS extraction
npm install --save-dev critical

# Unused CSS detection  
npm install --save-dev purgecss
```
