import React from 'react';
import { AnimatedButton, AnimatedCard, AnimatedInput, LoadingSpinner } from '../components/ui/animated-components-fixed';
import { animationManager } from '../utils/animation.client';
import { useTheme } from '../utils/theme.client';

/**
 * Animation Showcase - Démonstration des Animations
 * Showcase page for all available animations and components
 */
export default function AnimationShowcase() {
  const { config } = useTheme();
  const [inputValue, setInputValue] = React.useState('');
  
  const cardRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (cardRef.current) {
      animationManager.animate(cardRef.current, 'fadeInUp', { duration: 800 });
    }
  }, []);

  const handleAnimationDemo = (animationType: string) => {
    const elements = document.querySelectorAll('.demo-target');
    elements.forEach((element, index) => {
      setTimeout(() => {
        animationManager.animate(element as HTMLElement, animationType as any, {
          duration: 600,
          delay: index * 100,
        });
      }, index * 50);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12" ref={cardRef}>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-turf-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
            🎭 Showcase des Animations
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez toutes les animations et composants interactifs disponibles 
            dans le système Tunisia Jockey Club avec personnalisation en temps réel.
          </p>
        </div>

        {/* Animation Controls */}
        <AnimatedCard variant="glass" animation="hover" className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            🎮 Contrôles d'Animation
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Fade In', type: 'fadeIn' },
              { name: 'Slide Up', type: 'slideInUp' },
              { name: 'Scale', type: 'scaleIn' },
              { name: 'Bounce', type: 'bounceIn' },
              { name: 'Rotate', type: 'rotateIn' },
              { name: 'Flip X', type: 'flipInX' },
              { name: 'Shake', type: 'shake' },
              { name: 'Pulse', type: 'pulse' },
            ].map((anim) => (
              <AnimatedButton
                key={anim.type}
                variant="outline"
                animation="bounce"
                onClick={() => handleAnimationDemo(anim.type)}
                className="demo-target"
              >
                {anim.name}
              </AnimatedButton>
            ))}
          </div>
        </AnimatedCard>

        {/* Button Showcase */}
        <AnimatedCard variant="elevated" animation="float" className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            🔘 Boutons Animés
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">Variantes</h3>
              <AnimatedButton variant="primary" animation="glow">
                Primary Button
              </AnimatedButton>
              <AnimatedButton variant="secondary" animation="pulse">
                Secondary Button
              </AnimatedButton>
              <AnimatedButton variant="outline" animation="bounce">
                Outline Button
              </AnimatedButton>
              <AnimatedButton variant="ghost" animation="slide">
                Ghost Button
              </AnimatedButton>
              <AnimatedButton variant="danger" animation="glow">
                Danger Button
              </AnimatedButton>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">Tailles</h3>
              <AnimatedButton size="sm" animation="bounce">Small</AnimatedButton>
              <AnimatedButton size="md" animation="pulse">Medium</AnimatedButton>
              <AnimatedButton size="lg" animation="glow">Large</AnimatedButton>
              <AnimatedButton size="xl" animation="slide">Extra Large</AnimatedButton>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">États</h3>
              <AnimatedButton isLoading>Loading...</AnimatedButton>
              <AnimatedButton disabled>Disabled</AnimatedButton>
              <AnimatedButton variant="primary" animation="glow">
                ✨ Avec Icône
              </AnimatedButton>
            </div>
          </div>
        </AnimatedCard>

        {/* Card Showcase */}
        <AnimatedCard variant="gradient" animation="tilt" className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            🎴 Cartes Animées
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatedCard variant="default" animation="hover" className="demo-target p-4">
              <h3 className="font-bold mb-2">Carte Standard</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Animation hover avec élévation subtile
              </p>
            </AnimatedCard>
            
            <AnimatedCard variant="elevated" animation="float" className="demo-target p-4">
              <h3 className="font-bold mb-2">Carte Élevée</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Animation float avec shadow
              </p>
            </AnimatedCard>
            
            <AnimatedCard variant="glass" animation="tilt" className="demo-target p-4">
              <h3 className="font-bold mb-2">Carte Glassmorphism</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Effet de verre avec tilt
              </p>
            </AnimatedCard>
            
            <AnimatedCard variant="gradient" animation="hover" className="demo-target p-4">
              <h3 className="font-bold mb-2">Carte Gradient</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Dégradé avec animation
              </p>
            </AnimatedCard>
          </div>
        </AnimatedCard>

        {/* Input Showcase */}
        <AnimatedCard variant="glass" animation="hover" className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            📝 Champs de Saisie Animés
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <AnimatedInput
                label="Champ Standard"
                placeholder="Tapez quelque chose..."
                animation="focus"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <AnimatedInput
                label="Champ avec Glow"
                placeholder="Animation glow au focus"
                animation="glow"
              />
              <AnimatedInput
                label="Champ d'Erreur"
                placeholder="Champ avec erreur"
                error="Ce champ est obligatoire"
                animation="focus"
              />
            </div>
            <div className="space-y-4">
              <AnimatedInput
                label="Champ Validé"
                placeholder="Champ avec succès"
                success={true}
                animation="glow"
              />
              <AnimatedInput
                label="Champ Désactivé"
                placeholder="Champ désactivé"
                disabled
                animation="none"
              />
              <AnimatedInput
                label="Champ Email"
                type="email"
                placeholder="votre@email.com"
                animation="focus"
              />
            </div>
          </div>
        </AnimatedCard>

        {/* Loading Spinner Showcase */}
        <AnimatedCard variant="elevated" animation="float" className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            ⏳ Indicateurs de Chargement
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <h3 className="font-semibold">Spinner Classique</h3>
              <LoadingSpinner variant="spinner" size="lg" color="primary" />
            </div>
            <div className="text-center space-y-4">
              <h3 className="font-semibold">Points Animés</h3>
              <LoadingSpinner variant="dots" size="lg" color="secondary" />
            </div>
            <div className="text-center space-y-4">
              <h3 className="font-semibold">Pulse</h3>
              <LoadingSpinner variant="pulse" size="lg" color="primary" />
            </div>
            <div className="text-center space-y-4">
              <h3 className="font-semibold">Barres</h3>
              <LoadingSpinner variant="bars" size="lg" color="secondary" />
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <LoadingSpinner 
              variant="spinner" 
              size="md" 
              color="primary" 
              text="Chargement des données..."
            />
          </div>
        </AnimatedCard>

        {/* Performance & Accessibility */}
        <AnimatedCard variant="gradient" animation="hover" className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            ♿ Accessibilité & Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold mb-4 text-green-600 dark:text-green-400">
                ✅ Fonctionnalités Accessibles
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Respect des préférences "prefers-reduced-motion"</li>
                <li>• Support complet du clavier</li>
                <li>• Contraste élevé disponible</li>
                <li>• Focus visible sur tous les éléments</li>
                <li>• Labels et descriptions pour lecteurs d'écran</li>
                <li>• Navigation ARIA conforme</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-blue-600 dark:text-blue-400">
                🚀 Optimisations Performance
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Animations CSS hardware-accelerated</li>
                <li>• requestAnimationFrame pour JS</li>
                <li>• Lazy loading des composants</li>
                <li>• Debouncing des événements</li>
                <li>• Réduction automatique selon préférences</li>
                <li>• Optimisation mémoire et GC</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> Toutes les animations respectent les préférences d'accessibilité de l'utilisateur.
              Activez "prefers-reduced-motion" dans vos paramètres système pour voir la différence.
            </p>
          </div>
        </AnimatedCard>

        {/* Real-time Theme Preview */}
        <AnimatedCard variant="glass" animation="hover">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            🎨 Aperçu Thème Actuel: {config.primaryColor}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Couleurs Primaires</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-turf-green-500 rounded-full"></div>
                  <span className="text-sm">Turf Green</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Blue</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Mode: {config.mode}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Taille Police: {config.fontSize}px
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Animations: {config.animations ? 'Activées' : 'Désactivées'}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Accessibilité</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Contraste élevé: {config.highContrast ? 'Oui' : 'Non'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mouvement réduit: {config.reducedMotion ? 'Oui' : 'Non'}
              </p>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}
