import React from 'react';
import { AnimatedButton, AnimatedCard, LoadingSpinner } from '../components/ui/animated-components-fixed';
import { useTheme } from '../utils/theme.client';
import { useAnimation } from '../utils/animation.client';

/**
 * Page de Démonstration UX - Tunisia Jockey Club
 * Intégration des améliorations avec les données réelles
 */
export default function UXDemo() {
  const { config, updateConfig } = useTheme();
  const { animate } = useAnimation();
  const [isLoading, setIsLoading] = React.useState(false);
  const [demoStats, setDemoStats] = React.useState({
    horses: 45,
    users: 10,
    races: 5,
    jockeys: 5,
    ratingsEnabled: true
  });

  const headerRef = React.useRef<HTMLDivElement>(null);
  const statsGridRef = React.useRef<HTMLDivElement>(null);

  // Animation d'entrée
  React.useEffect(() => {
    const animateEntrance = async () => {
      if (headerRef.current) {
        await animate(headerRef.current, 'fadeInUp', { duration: 800 });
      }
      if (statsGridRef.current) {
        await animate(statsGridRef.current, 'slideUp', { duration: 600, delay: 300 });
      }
    };
    animateEntrance();
  }, [animate]);

  // Simulation chargement données
  const refreshData = async () => {
    setIsLoading(true);
    // Simule un appel API
    await new Promise(resolve => setTimeout(resolve, 2000));
    setDemoStats(prev => ({
      ...prev,
      horses: prev.horses + Math.floor(Math.random() * 5),
      users: prev.users + Math.floor(Math.random() * 3)
    }));
    setIsLoading(false);
  };

  // Changement rapide de thème
  const quickThemeChange = (color: string) => {
    updateConfig({ primaryColor: color as any });
    
    // Animation de confirmation
    const button = document.querySelector(`[data-theme="${color}"]`);
    if (button) {
      animate(button as HTMLElement, 'bounce', { duration: 500 });
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    description,
    color = 'blue'
  }: {
    title: string;
    value: number | string;
    icon: string;
    description: string;
    color?: string;
  }) => (
    <AnimatedCard 
      variant="glass" 
      animation="hover"
      className={`p-6 text-center border-l-4 border-${color}-500 hover:border-${color}-600 transition-all duration-300`}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {isLoading ? (
          <LoadingSpinner variant="pulse" size="md" color="primary" />
        ) : (
          <span className="animate-countUp">{value}</span>
        )}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </AnimatedCard>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-blue-900 dark:to-green-900">
      {/* Header avec contrôles de thème */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4" ref={headerRef}>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-turf-green-600 to-blue-600 bg-clip-text text-transparent">
                🎨 Démonstration UX Avancée
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Système de personnalisation Tunisia Jockey Club
              </p>
            </div>
            
            {/* Sélecteur de thèmes rapide */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">Thèmes:</span>
              {[
                { color: 'turf-green', name: 'Hippique', bg: 'bg-green-600' },
                { color: 'blue', name: 'Classique', bg: 'bg-blue-600' },
                { color: 'purple', name: 'Royal', bg: 'bg-purple-600' },
                { color: 'emerald', name: 'Émeraude', bg: 'bg-emerald-600' },
                { color: 'amber', name: 'Doré', bg: 'bg-amber-600' },
                { color: 'rose', name: 'Rose', bg: 'bg-rose-600' },
              ].map(({ color, name, bg }) => (
                <button
                  key={color}
                  data-theme={color}
                  onClick={() => quickThemeChange(color)}
                  className={`
                    w-8 h-8 rounded-full ${bg} border-2 transition-all duration-200 
                    hover:scale-110 hover:shadow-lg
                    ${config.primaryColor === color 
                      ? 'border-white shadow-lg scale-110 ring-2 ring-gray-400' 
                      : 'border-gray-300'
                    }
                  `}
                  title={name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Statistiques en temps réel */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
              📊 Statistiques en Temps Réel
            </h2>
            <div className="flex gap-3">
              <AnimatedButton
                variant="outline"
                size="sm"
                animation="bounce"
                onClick={refreshData}
                disabled={isLoading}
              >
                {isLoading ? '🔄 Actualisation...' : '🔄 Actualiser'}
              </AnimatedButton>
              <AnimatedButton
                variant="secondary"
                size="sm"
                animation="glow"
                onClick={() => updateConfig({ animations: !config.animations })}
              >
                {config.animations ? '🎭 Animations ON' : '🎭 Animations OFF'}
              </AnimatedButton>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" ref={statsGridRef}>
            <StatCard
              title="Chevaux"
              value={demoStats.horses}
              icon="🐎"
              description="Total des chevaux enregistrés"
              color="green"
            />
            <StatCard
              title="Utilisateurs"
              value={demoStats.users}
              icon="👥"
              description="Utilisateurs actifs"
              color="blue"
            />
            <StatCard
              title="Courses"
              value={demoStats.races}
              icon="🏁"
              description="Courses programmées"
              color="purple"
            />
            <StatCard
              title="Jockeys"
              value={demoStats.jockeys}
              icon="🏇"
              description="Jockeys professionnels"
              color="amber"
            />
          </div>
        </div>

        {/* Démonstration des composants */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Boutons animés */}
          <AnimatedCard variant="elevated" animation="float">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              🔘 Boutons Interactifs
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <AnimatedButton variant="primary" animation="glow" size="sm">
                  🆕 Nouveau
                </AnimatedButton>
                <AnimatedButton variant="secondary" animation="pulse" size="sm">
                  📊 Rapports
                </AnimatedButton>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <AnimatedButton variant="outline" animation="bounce" size="sm">
                  ⚙️ Paramètres
                </AnimatedButton>
                <AnimatedButton variant="ghost" animation="slide" size="sm">
                  📋 Liste
                </AnimatedButton>
              </div>
              <AnimatedButton variant="danger" animation="glow" className="w-full" size="sm">
                ⚠️ Action Critique
              </AnimatedButton>
            </div>
          </AnimatedCard>

          {/* Informations système */}
          <AnimatedCard variant="gradient" animation="tilt">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              ⚡ État du Système
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm font-medium">Thème actuel</span>
                <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                  {config.primaryColor}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm font-medium">Mode d'affichage</span>
                <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                  {config.mode}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm font-medium">Animations</span>
                <span className={`text-sm ${config.animations ? 'text-green-600' : 'text-red-600'}`}>
                  {config.animations ? '✅ Activées' : '❌ Désactivées'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm font-medium">Ratings System</span>
                <span className="text-sm text-green-600">
                  {demoStats.ratingsEnabled ? '✅ Opérationnel' : '❌ Indisponible'}
                </span>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Indicateurs de performance */}
        <AnimatedCard variant="glass" animation="hover" className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            📈 Performance & Analytics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                98.5%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Temps de réponse optimal
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                195ms
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Latence API Supabase
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                60fps
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Fluidité des animations
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Navigation rapide */}
        <AnimatedCard variant="elevated" animation="hover">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            🚀 Navigation Rapide
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnimatedButton 
              variant="outline" 
              animation="bounce"
              className="justify-center"
              onClick={() => window.open('/settings', '_blank')}
            >
              ⚙️ Paramètres Complets
            </AnimatedButton>
            <AnimatedButton 
              variant="outline" 
              animation="pulse"
              className="justify-center"
              onClick={() => window.open('/showcase', '_blank')}
            >
              🎭 Showcase Animations
            </AnimatedButton>
            <AnimatedButton 
              variant="outline" 
              animation="glow"
              className="justify-center"
              onClick={() => window.open('/dashboard-enhanced', '_blank')}
            >
              📊 Dashboard Avancé
            </AnimatedButton>
            <AnimatedButton 
              variant="primary" 
              animation="slide"
              className="justify-center"
            >
              📖 Guide Complet
            </AnimatedButton>
          </div>
        </AnimatedCard>

        {/* Footer avec état système */}
        <div className="mt-8 p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl backdrop-blur-sm border border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-4 mb-2 sm:mb-0">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                Système opérationnel
              </span>
              <span>•</span>
              <span>UX System v2.0.0</span>
              <span>•</span>
              <span>Tunisia Jockey Club</span>
            </div>
            <div className="text-center sm:text-right">
              <span>Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
