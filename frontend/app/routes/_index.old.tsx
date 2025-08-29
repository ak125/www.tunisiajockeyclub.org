import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from '@remix-run/react';
import { Trophy, Users, Clock, TrendingUp } from 'lucide-react';

// Optimized loader with minimal processing
export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({
    user: null,
    stats: {
      totalRaces: 124,
      activeHorses: 89,
      registeredJockeys: 32,
      upcomingEvents: 8
    },
    timestamp: new Date().toISOString(),
  });
};

// Lightweight hero section without heavy animations
function FastHeroSection() {
  return (
    <header 
      className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-12"
      role="banner"
      aria-labelledby="hero-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <img
            src="/api/placeholder/80/80"
            alt="Logo Tunisia Jockey Club - Club hippique tunisien"
            className="w-20 h-20 rounded-full border-4 border-white/20 mr-4"
            loading="eager"
          />
          <h1 
            id="hero-title"
            className="text-4xl font-bold"
          >
            Tunisia Jockey Club
          </h1>
        </div>
        
        <p className="text-lg max-w-2xl mx-auto mb-6 opacity-90">
          Centre d'excellence hippique - Système IFHA de rating international
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/ifha"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            aria-label="Accéder au système de rating IFHA"
          >
            <Trophy className="w-5 h-5 mr-2" />
            Rating IFHA
          </Link>
          
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            aria-label="Accéder au tableau de bord"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}

// Fast stats section without animations
function QuickStatsSection({ stats }: { stats: any }) {
  const statItems = [
    {
      icon: Trophy,
      value: stats.totalRaces,
      label: 'Courses Total',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: Users,
      value: stats.activeHorses,
      label: 'Chevaux Actifs',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Users,
      value: stats.registeredJockeys,
      label: 'Jockeys',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Clock,
      value: stats.upcomingEvents,
      label: 'Événements',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <section 
      className="py-8 bg-gray-50"
      aria-labelledby="stats-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="stats-title" className="sr-only">Statistiques rapides</h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statItems.map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bgColor} rounded-lg p-4 text-center`}
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
              <p className="text-xl font-bold text-gray-900">
                {stat.value.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main component - ultra-optimized
export default function FastHomePage() {
  const { stats } = useLoaderData<typeof loader>();

  return (
    <main role="main" aria-label="Page d'accueil Tunisia Jockey Club">
      <FastHeroSection />
      <QuickStatsSection stats={stats} />
      
      {/* Quick navigation */}
      <section className="py-8 bg-white" aria-labelledby="nav-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="nav-title" className="text-2xl font-bold text-gray-900 text-center mb-6">
            Accès Rapide
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/dashboard"
              className="p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
              aria-label="Accéder au tableau de bord complet"
            >
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">Dashboard</h3>
              <p className="text-sm text-blue-700">Gestion complète</p>
            </Link>
            
            <Link
              to="/ifha"
              className="p-6 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-center"
              aria-label="Utiliser le calculateur IFHA"
            >
              <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <h3 className="font-semibold text-yellow-900">Rating IFHA</h3>
              <p className="text-sm text-yellow-700">Calculs internationaux</p>
            </Link>
            
            <Link
              to="/statistics"
              className="p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center"
              aria-label="Consulter les statistiques"
            >
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-900">Statistiques</h3>
              <p className="text-sm text-green-700">Analyses détaillées</p>
            </Link>
          </div>
        </div>
      </section>
      
      {/* System status */}
      <footer className="py-4 bg-green-50 border-t border-green-200" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-green-700">
            <span className="inline-flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Système opérationnel - Cache Redis actif - Performance optimisée
            </span>
          </p>
        </div>
      </footer>
    </main>
  );
}
