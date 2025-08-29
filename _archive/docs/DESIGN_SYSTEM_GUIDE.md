# 🎨 Design System - Tunisia Jockey Club

## 🎯 Philosophy & Principles

### Design Philosophy
Notre design system s'inspire de l'univers hippique tunisien, alliant **tradition** et **modernité**, **élégance** et **performance**.

### Core Principles
1. **🏇 Contexte Hippique**: Chaque composant reflète l'univers des courses
2. **⚡ Performance First**: Optimisation systématique des interactions  
3. **♿ Accessibilité**: Standards WCAG AA respectés
4. **📱 Responsive Design**: Mobile-first approach
5. **🎭 Consistency**: Cohérence visuelle et comportementale

---

## 🎨 Color Palette

### Primary Colors
```css
/* Turf Green - Couleur de gazon */
--turf-green-50: #F0F7ED
--turf-green-500: #2D5016  /* Primary */
--turf-green-900: #16240E

/* Racing Gold - Or des victoires */
--racing-gold-50: #FFFEF7
--racing-gold-500: #FFD700  /* Secondary */
--racing-gold-900: #594C00

/* Jockey Silk - Soie des casaques */  
--jockey-silk-50: #FAF6F4
--jockey-silk-500: #8B4513  /* Accent */
--jockey-silk-900: #48240B
```

### Usage Guidelines
- **Turf Green**: Actions principales, navigation, états actifs
- **Racing Gold**: Victoires, récompenses, highlights importants  
- **Jockey Silk**: Accents, détails premium, éléments de luxe
- **Gray Scale**: Contenus secondaires, textes, borders

### Color Combinations
```css
/* Combinaisons approuvées */
.victory-theme { 
  background: racing-gold-500; 
  color: turf-green-900; 
}

.premium-theme {
  background: gradient(jockey-silk-500, jockey-silk-600);
  color: white;
}

.status-active {
  background: turf-green-100;
  color: turf-green-800;
  border: turf-green-300;
}
```

---

## 📐 Typography

### Font Stack
```css
/* Sans-serif - Interface */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Serif - Titres premium */
font-family: 'Playfair Display', Georgia, serif;

/* Display - Branding */
font-family: 'Cinzel', 'Times New Roman', serif;

/* Monospace - Données */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale
```css
/* Hierarchy */
.text-display { font-size: 3.5rem; font-weight: 800; }  /* 56px */
.text-h1 { font-size: 2.5rem; font-weight: 700; }       /* 40px */
.text-h2 { font-size: 2rem; font-weight: 600; }         /* 32px */
.text-h3 { font-size: 1.5rem; font-weight: 600; }       /* 24px */
.text-body-lg { font-size: 1.125rem; font-weight: 400; } /* 18px */
.text-body { font-size: 1rem; font-weight: 400; }        /* 16px */
.text-sm { font-size: 0.875rem; font-weight: 400; }     /* 14px */
.text-xs { font-size: 0.75rem; font-weight: 500; }      /* 12px */
```

### Usage Context
- **Display**: Page headers, hero sections
- **H1-H3**: Section titles, card headers  
- **Body**: Paragraphs, descriptions
- **Small**: Metadata, captions, labels

---

## 🧩 Component Library

### 🔘 Buttons

#### Variants
```tsx
// Actions principales
<HippicButton variant="primary">Voir Course</HippicButton>

// Actions hippiques spécialisées
<BetButton>Parier 50 TND</BetButton>
<RegisterButton>Inscrire Cheval</RegisterButton>
<VictoryButton>🏆 Victoire!</VictoryButton>

// États de course
<RaceStatusButton status="upcoming">À venir</RaceStatusButton>
<RaceStatusButton status="ongoing">En cours</RaceStatusButton>
<RaceStatusButton status="completed">Terminée</RaceStatusButton>
```

#### Usage Guidelines
- **Primary**: Action principale par écran (max 1)
- **Secondary**: Actions secondaires importantes
- **Outline**: Actions neutres, navigation
- **Ghost**: Actions tertiaires, utilitaires

### 🏷️ Badges

#### Variants
```tsx
// Performances
<HippicBadge variant="victory">1ère place</HippicBadge>
<HippicBadge variant="podium">2ème place</HippicBadge>
<HippicBadge variant="participation">Participation</HippicBadge>

// Statuts
<StatusBadge status="active" />    // 🟢 Actif
<StatusBadge status="veteran" />   // ⭐ Vétéran  
<StatusBadge status="rookie" />    // 🆕 Débutant

// Courses
<RaceBadge status="upcoming" />    // ⏰ À venir
<RaceBadge status="ongoing" />     // 🏁 En cours
<RaceBadge status="completed" />   // ✅ Terminée

// Position automatique
<HippicBadge position={1}>Thunder Bolt</HippicBadge> // 🥇
```

### 🃏 Cards

#### Horse Card
```tsx
<HorseCard 
  horse={horseData}
  animate={true}
  onView={() => navigateToHorse(horse.id)}
  onEdit={() => openEditModal(horse.id)}
/>
```

#### Jockey Card  
```tsx
<JockeyCard
  jockey={jockeyData}
  compact={false}
  animate={true}
  onView={() => navigateToJockey(jockey.id)}
/>
```

---

## 🎬 Animations & Micro-interactions

### Animation Tokens
```css
/* Duration */
--duration-fast: 150ms;
--duration-normal: 300ms; 
--duration-slow: 500ms;

/* Easing */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Hippic Animations */
--shimmer-duration: 2s;
--pulse-duration: 3s;
--float-duration: 3s;
```

### Contextual Animations
```tsx
// Victory celebration
<motion.div
  animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
  transition={{ duration: 0.6 }}
>
  🏆 Victoire!
</motion.div>

// Betting action
<motion.button
  whileTap={{ scale: 0.95 }}
  whileHover={{ scale: 1.02 }}
  className="bet-button"
>
  💰 Parier
</motion.button>

// Loading race data
<HippicLoader message="Chargement des courses..." />
```

### Performance Guidelines
- **Max Duration**: 500ms pour interactions UI
- **60fps**: Privilégier transform et opacity
- **Reduced Motion**: Respecter prefers-reduced-motion
- **Progressive Enhancement**: Fallbacks CSS purs

---

## ♿ Accessibility Standards

### WCAG AA Compliance

#### Color Contrast
- **Text Regular**: 4.5:1 minimum
- **Text Large**: 3:1 minimum  
- **UI Components**: 3:1 minimum

#### Focus Management
```css
/* Focus visible pour tous les interactifs */
.interactive:focus-visible {
  outline: 2px solid var(--racing-gold-500);
  outline-offset: 2px;
  border-radius: 4px;
}
```

#### Screen Reader Support
```tsx
// Labels descriptifs
<HippicButton 
  aria-label="Parier 50 TND sur Thunder Bolt dans la course de 15h30"
>
  Parier 50 TND
</HippicButton>

// États dynamiques
<HippicBadge 
  variant="victory"
  aria-label="Première place dans la course du Grand Prix"
>
  1ère place
</HippicBadge>
```

#### Keyboard Navigation
- **Tab Order**: Logique et prévisible
- **Skip Links**: Navigation rapide 
- **Escape**: Fermeture modals/dropdowns
- **Enter/Space**: Activation boutons

---

## 📱 Responsive Patterns

### Breakpoints
```css
/* Mobile First */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }  
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### Component Adaptations
```tsx
// Cards responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <HorseCard compact={isMobile} />
</div>

// Navigation mobile
<nav className="hidden md:flex md:space-x-4 lg:space-x-6">
  {/* Desktop nav */}
</nav>
<MobileNavDrawer className="md:hidden" />
```

---

## 🔄 State Management

### Loading States
```tsx
// Skeleton loading
{isLoading && <HorseCardSkeleton />}
{isLoading && <DashboardSkeleton />}

// Progressive loading
<Suspense fallback={<HippicLoader />}>
  <LazyComponent />
</Suspense>
```

### Error States
```tsx
// Error boundaries hippiques
<ErrorBoundary 
  fallback={<ErrorState icon="🐎" message="Erreur lors du chargement des chevaux" />}
>
  <HorsesList />
</ErrorBoundary>
```

### Empty States
```tsx
// États vides contextuels
<EmptyState
  icon="🏇"
  title="Aucun jockey trouvé"
  description="Aucun jockey ne correspond à vos critères de recherche"
  action={<Button onClick={clearFilters}>Réinitialiser les filtres</Button>}
/>
```

---

## 📊 Usage Analytics

### Component Metrics
```typescript
// Tracking d'usage
const trackComponentUsage = (component: string, variant: string) => {
  analytics.track('component_used', {
    component,
    variant,
    context: 'hippic_ui'
  });
};

// Dans les composants
<HippicButton 
  onClick={() => {
    trackComponentUsage('HippicButton', 'bet');
    onBet();
  }}
>
  Parier
</HippicButton>
```

### Performance Monitoring
```typescript
// Core Web Vitals hippiques
const measureInteraction = () => {
  // Time to Interactive pour actions critiques
  const ttiMeasure = performance.measure('bet-action-tti');
  
  // Cumulative Layout Shift pour grilles de chevaux
  const clsMeasure = performance.measure('horse-grid-cls');
};
```

---

## 🛠️ Development Guidelines

### Component Creation Checklist
- [ ] **TypeScript**: Props typées avec interfaces
- [ ] **Accessibility**: ARIA labels et roles
- [ ] **Responsive**: Mobile-first design
- [ ] **Animation**: Motion respectueuse
- [ ] **Performance**: Lazy loading si applicable
- [ ] **Testing**: Tests unitaires et visuels
- [ ] **Documentation**: Storybook stories

### Code Style
```typescript
// Naming convention
interface HorseCardProps {
  horse: Horse;          // Data props
  compact?: boolean;     // Variant props
  animate?: boolean;     // Behavior props  
  onView?: () => void;   // Event handlers
}

// Component structure
export const HorseCard = React.forwardRef<HTMLDivElement, HorseCardProps>(
  ({ horse, compact = false, animate = true, onView, ...props }, ref) => {
    // Hooks first
    const [isHovered, setIsHovered] = useState(false);
    
    // Computed values
    const cardVariant = getCardVariant(horse.status);
    
    // Event handlers
    const handleClick = useCallback(() => {
      trackComponentUsage('HorseCard', 'view');
      onView?.();
    }, [onView]);
    
    // Render
    return (
      <Card ref={ref} className={cn(baseClasses, className)} {...props}>
        {/* Content */}
      </Card>
    );
  }
);
```

---

## 📚 Resources

### Design Tokens
- [Figma Design System](figma-link)
- [Tailwind Config](./tailwind.config.cjs)
- [CSS Variables](./app/global.css)

### Documentation
- [Component Storybook](storybook-link)
- [Accessibility Guide](./docs/accessibility.md)
- [Performance Best Practices](./PERFORMANCE_AUDIT.md)

### Tools & Scripts
```bash
# Lancer Storybook
npm run storybook

# Audit accessibilité
npm run a11y-audit

# Tests visuels
npm run test:visual

# Bundle analysis  
npm run analyze:bundle
```
