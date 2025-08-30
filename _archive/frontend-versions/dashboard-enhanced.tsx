import React from 'react';
import { AnimatedButton, AnimatedCard, LoadingSpinner } from '../components/ui/animated-components-fixed';
import { useAnimation } from '../utils/animation.client';
import { useTheme } from '../utils/theme.client';

/**
 * Enhanced Dashboard with Theme and Animation Integration
 * Tableau de bord amélioré avec intégration des thèmes et animations
 */
export default function DashboardEnhanced() {
  const { config, updateConfig } = useTheme();
  const { animate } = useAnimation();
  const [isLoading, setIsLoading] = React.useState(false);
  const [stats, setStats] = React.useState({
    totalRaces: 0,
    todaysRaces: 0,
    activeBets: 0,
    totalUsers: 0,
  });

  const headerRef = React.useRef<HTMLDivElement>(null);
  const statsRef = React.useRef<HTMLDivElement>(null);
  const chartRef = React.useRef<HTMLDivElement>(null);

  // Animation d'entrée au chargement
  React.useEffect(() => {
    const animateElements = async () => {
      if (headerRef.current) {
        await animate(headerRef.current, 'fadeInUp', { duration: 800 });
      }
      if (statsRef.current) {
        await animate(statsRef.current, 'slideUp', { duration: 600, delay: 200 });
      }
      if (chartRef.current) {
        await animate(chartRef.current, 'scaleIn', { duration: 500, delay: 400 });
      }
    };

    animateElements();
  }, [animate]);

  // Simulation de chargement des données
  React.useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setStats({
        totalRaces: 1247,
        todaysRaces: 8,
        activeBets: 2156,
        totalUsers: 5632,
      });
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleQuickThemeChange = (color: any) => {
    updateConfig({ primaryColor: color });
  };

  const handleAnimationToggle = () => {
    updateConfig({ animations: !config.animations });
  };

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    trend, 
    trendValue 
  }: { 
    title: string; 
    value: number | string; 
    icon: string; 
    trend: 'up' | 'down' | 'stable'; 
    trendValue: string 
  }) => (
    <AnimatedCard 
      variant="glass" 
      animation="hover"
      className="p-6 text-center relative overflow-hidden"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
        {title}
      </h3>
      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {isLoading ? (
          <LoadingSpinner variant="pulse" size="md" color="primary" />
        ) : (
          value
        )}
      </div>
      <div className={`flex items-center justify-center space-x-1 text-sm ${
        trend === 'up' ? 'text-green-500' : 
        trend === 'down' ? 'text-red-500' : 
        'text-gray-500'
      }`}>
        <span>
          {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
        </span>
        <span>{trendValue}</span>
      </div>
      
      {/* Animation background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </AnimatedCard>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-blue-900 dark:to-green-900">
      {/* Header avec contrôles rapides */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between" ref={headerRef}>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-turf-green-600 to-blue-600 bg-clip-text text-transparent">
                Tunisia Jockey Club
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Tableau de bord personnalisable avec animations avancées
              </p>
            </div>
            
            {/* Contrôles rapides de thème */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">Thème:</span>
                <div className="flex space-x-1">
                  {[
                    { color: 'turf-green', bg: 'bg-green-500' },
                    { color: 'blue', bg: 'bg-blue-500' },
                    { color: 'purple', bg: 'bg-purple-500' },
                    { color: 'amber', bg: 'bg-amber-500' },
                  ].map(({ color, bg }) => (
                    <button
                      key={color}
                      onClick={() => handleQuickThemeChange(color)}
                      className={`w-6 h-6 rounded-full ${bg} border-2 transition-all duration-200 ${
                        config.primaryColor === color 
                          ? 'border-white shadow-lg scale-110' 
                          : 'border-gray-300 hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <AnimatedButton
                variant="outline"
                size="sm"
                animation="bounce"
                onClick={handleAnimationToggle}
              >
                {config.animations ? '🎨 Animations ON' : '🎨 Animations OFF'}
              </AnimatedButton>

              <AnimatedButton variant="primary" size="sm" animation="glow">
                ⚙️ Paramètres
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" ref={statsRef}>
          <StatCard
            title="Total des Courses"
            value={stats.totalRaces}
            icon="🏇"
            trend="up"
            trendValue="+12%"
          />
          <StatCard
            title="Courses Aujourd'hui"
            value={stats.todaysRaces}
            icon="📅"
            trend="stable"
            trendValue="=0%"
          />
          <StatCard
            title="Paris Actifs"
            value={stats.activeBets}
            icon="💰"
            trend="up"
            trendValue="+8%"
          />
          <StatCard
            title="Utilisateurs"
            value={stats.totalUsers}
            icon="👥"
            trend="up"
            trendValue="+15%"
          />
        </div>

        {/* Contenu principal avec graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Graphique principal */}
          <div className="lg:col-span-2">
            <AnimatedCard variant="elevated" animation="float" className="h-96" ref={chartRef}>
              <div className="p-6 h-full flex flex-col">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  📊 Performance des Courses
                </h2>
                <div className="flex-1 flex items-center justify-center">
                  {isLoading ? (
                    <LoadingSpinner 
                      variant="spinner" 
                      size="lg" 
                      color="primary" 
                      text="Chargement des graphiques..."
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-turf-green-50 to-blue-50 dark:from-turf-green-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">📈</div>
                        <p className="text-gray-600 dark:text-gray-300">
                          Graphique interactif des performances
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedCard>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Dernières courses */}
            <AnimatedCard variant="glass" animation="hover">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🏁 Dernières Courses
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'Prix de Tunis', time: '14:30', status: 'Terminée' },
                    { name: 'Grand Prix', time: '15:45', status: 'En cours' },
                    { name: 'Prix Habib', time: '16:30', status: 'À venir' },
                  ].map((race, index) => (
                    <div 
                      key={race.name}
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {race.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {race.time}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        race.status === 'Terminée' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                        race.status === 'En cours' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                      }`}>
                        {race.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedCard>

            {/* Actions rapides */}
            <AnimatedCard variant="gradient" animation="tilt">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  ⚡ Actions Rapides
                </h3>
                <div className="space-y-3">
                  <AnimatedButton 
                    variant="primary" 
                    animation="glow" 
                    className="w-full"
                  >
                    🆕 Nouvelle Course
                  </AnimatedButton>
                  <AnimatedButton 
                    variant="secondary" 
                    animation="pulse" 
                    className="w-full"
                  >
                    📋 Voir Résultats
                  </AnimatedButton>
                  <AnimatedButton 
                    variant="outline" 
                    animation="bounce" 
                    className="w-full"
                  >
                    📊 Rapports
                  </AnimatedButton>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>

        {/* Footer avec informations système */}
        <div className="mt-12 p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>Thème actuel: {config.primaryColor}</span>
              <span>•</span>
              <span>Mode: {config.mode}</span>
              <span>•</span>
              <span>Animations: {config.animations ? 'Activées' : 'Désactivées'}</span>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Système opérationnel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
