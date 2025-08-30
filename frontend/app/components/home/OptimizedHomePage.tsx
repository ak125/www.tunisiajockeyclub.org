import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Trophy, Users, Clock } from 'lucide-react';
import { OptimizedImage } from '../ui/OptimizedImage';

// Lazy loading des composants lourds
const StatsSection = lazy(() => import('./StatsSection'));
const RacingCalendar = lazy(() => import('./RacingCalendar'));
const TopHorsesCarousel = lazy(() => import('./TopHorsesCarousel'));

interface HomePageProps {
  stats?: {
    totalRaces: number;
    activeHorses: number;
    registeredJockeys: number;
    upcomingEvents: number;
  };
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-48 bg-gray-200 rounded-lg"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section 
      className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16 overflow-hidden"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 
            id="hero-title"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
          >
            Tunisia Jockey Club
          </h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto mb-8 opacity-90">
            Centre d'excellence hippique - Système IFHA de rating international
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/ifha"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              aria-label="Accéder au système de rating IFHA"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Rating IFHA
            </motion.a>
            
            <motion.a
              href="/dashboard"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              aria-label="Accéder au tableau de bord"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Dashboard
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Éléments décoratifs */}
      <div className="absolute top-10 right-10 opacity-10">
        <OptimizedImage
          src="/api/placeholder/200/200"
          alt=""
          className="w-32 h-32"
          role="presentation"
          loading="eager"
        />
      </div>
    </section>
  );
}

function QuickStatsSection({ stats }: { stats?: HomePageProps['stats'] }) {
  const defaultStats = {
    totalRaces: 0,
    activeHorses: 0,
    registeredJockeys: 0,
    upcomingEvents: 0,
    ...stats
  };

  const statItems = [
    {
      icon: Trophy,
      value: defaultStats.totalRaces,
      label: 'Courses Total',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: Users,
      value: defaultStats.activeHorses,
      label: 'Chevaux Actifs',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Users,
      value: defaultStats.registeredJockeys,
      label: 'Jockeys',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Clock,
      value: defaultStats.upcomingEvents,
      label: 'Événements',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <section 
      className="py-12 bg-gray-50"
      aria-labelledby="stats-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="stats-title" className="sr-only">Statistiques rapides</h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`${stat.bgColor} rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow`}
            >
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
              <p className="text-2xl font-bold text-gray-900">
                {stat.value.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OptimizedHomePage({ stats }: HomePageProps) {
  return (
    <main role="main" aria-label="Page d'accueil Tunisia Jockey Club">
      {/* Hero Section - Chargement immédiat */}
      <HeroSection />
      
      {/* Quick Stats - Chargement immédiat */}
      <QuickStatsSection stats={stats} />
      
      {/* Sections avec lazy loading */}
      <Suspense fallback={<LoadingSkeleton />}>
        <StatsSection />
      </Suspense>
      
      <Suspense fallback={<LoadingSkeleton />}>
        <RacingCalendar />
      </Suspense>
      
      <Suspense fallback={<LoadingSkeleton />}>
        <TopHorsesCarousel />
      </Suspense>
    </main>
  );
}

export default OptimizedHomePage;
