import { Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { 
  Activity, 
  Users, 
  BarChart3, 
  Trophy,
  TrendingUp,
  Star,
  Target,
  Zap,
  ChevronRight,
  MapPin,
  DollarSign
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      title: "Chevaux d'Elite",
      description: "Base de données complète avec analyses de performance avancées",
      icon: Activity,
      color: "from-green-500 to-blue-500",
      link: "/horses/advanced",
      stats: "248 chevaux • 95% de satisfaction",
      highlights: ["Données temps réel", "Analytics avancés", "Profils détaillés"]
    },
    {
      title: "Jockeys Champions",
      description: "Profils détaillés et statistiques de nos meilleurs jockeys",
      icon: Users,
      color: "from-purple-500 to-pink-500",
      link: "/jockeys/advanced",
      stats: "60 jockeys • 32.5% taux moyen",
      highlights: ["Radar de compétences", "Historique complet", "Tendances"]
    },
    {
      title: "Analytics Intelligence",
      description: "Analyses économiques et statistiques complètes du secteur",
      icon: BarChart3,
      color: "from-blue-500 to-purple-500",
      link: "/statistics/advanced",
      stats: "4.8M DT revenus • +15% croissance",
      highlights: ["Impact économique", "Météo & performances", "Prédictions"]
    },
    {
      title: "Recherche Avancée",
      description: "Moteur de recherche intelligent avec filtres multiples",
      icon: Target,
      color: "from-orange-500 to-red-500",
      link: "/courses/search",
      stats: "Recherche instantanée",
      highlights: ["Filtres intelligents", "Résultats en temps réel", "Export données"]
    },
    {
      title: "Monitoring Live",
      description: "Surveillance temps réel de tous les systèmes du club",
      icon: Zap,
      color: "from-green-500 to-teal-500",
      link: "/monitoring",
      stats: "99.9% uptime • 24/7",
      highlights: ["Alertes automatiques", "Métriques live", "Rapports"]
    },
    {
      title: "Centre Notifications",
      description: "Hub centralisé pour toutes les notifications importantes",
      icon: Star,
      color: "from-yellow-500 to-orange-500",
      link: "/notifications",
      stats: "Notifications intelligentes",
      highlights: ["Filtres par type", "Actions rapides", "Historique"]
    }
  ];

  const quickStats = [
    { label: "Courses Mensuelles", value: "42", trend: "+8.3%", icon: Trophy, color: "blue" },
    { label: "Spectateurs Moyens", value: "2.4K", trend: "+15.2%", icon: Users, color: "green" },
    { label: "Revenus Mensuels", value: "745K", trend: "+12.8%", icon: DollarSign, color: "purple" },
    { label: "Taux de Réussite", value: "94.2%", trend: "+2.1%", icon: TrendingUp, color: "orange" },
    { label: "Chevaux Actifs", value: "248", trend: "+12.5%", icon: Activity, color: "pink" },
    { label: "Hippodromes", value: "4", trend: "0%", icon: MapPin, color: "red" }
  ];

  const recentHighlights = [
    {
      title: "Rahib Albadeia remporte le Prix de Ben Guerdane",
      date: "25 Août 2025",
      type: "victory",
      description: "Performance exceptionnelle avec un nouveau record de piste"
    },
    {
      title: "Nouveau système de monitoring lancé",
      date: "20 Août 2025", 
      type: "system",
      description: "Surveillance temps réel de toute l'infrastructure du club"
    },
    {
      title: "Fatma Trabelsi, jockey du mois d'août",
      date: "15 Août 2025",
      type: "achievement",
      description: "Excellentes performances avec 8 victoires ce mois-ci"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      {/* Hero Section */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          🏆 Tunisia Jockey Club
        </h1>
        <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
          Plateforme digitale d'excellence pour les sports équestres en Tunisie. 
          Découvrez nos champions, suivez les performances et accédez aux analyses les plus avancées.
        </p>
        
        <div className="flex justify-center space-x-4">
          <Link 
            to="/horses/advanced"
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <Activity className="h-5 w-5" />
            <span>Explorer les Chevaux</span>
          </Link>
          <Link 
            to="/statistics/advanced"
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <BarChart3 className="h-5 w-5" />
            <span>Voir les Stats</span>
          </Link>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12"
      >
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className={`bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-${stat.color}-400`}
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
              <div className="text-green-600 text-sm font-medium flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.trend}
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
            <p className="text-lg font-bold text-gray-800">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Features Grid */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group relative"
          >
            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 h-full">
              {/* Gradient Header */}
              <div className={`w-full h-2 bg-gradient-to-r ${feature.color} rounded-t-lg absolute top-0 left-0`}></div>
              
              {/* Icon and Title */}
              <div className="flex items-center space-x-3 mb-4 pt-2">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color}`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.stats}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4">{feature.description}</p>

              {/* Highlights */}
              <div className="space-y-2 mb-6">
                {feature.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Link
                to={feature.link}
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors group-hover:shadow-md"
              >
                <span>Explorer</span>
                <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Highlights */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">🔥 Actualités Récentes</h2>
          <Link 
            to="/news"
            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-1"
          >
            <span>Voir tout</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentHighlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center space-x-2 mb-3">
                <div className={`w-3 h-3 rounded-full ${
                  highlight.type === 'victory' ? 'bg-yellow-400' :
                  highlight.type === 'system' ? 'bg-blue-400' :
                  'bg-green-400'
                }`}></div>
                <span className="text-sm text-gray-500">{highlight.date}</span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">{highlight.title}</h3>
              <p className="text-sm text-gray-600">{highlight.description}</p>
              
              <button className="mt-3 text-blue-600 text-sm hover:text-blue-800 transition-colors">
                Lire plus →
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer CTA */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-center mt-12 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white"
      >
        <h2 className="text-2xl font-bold mb-4">🚀 Découvrez l'Excellence Équestre Tunisienne</h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Rejoignez-nous dans cette aventure digitale unique qui met en valeur le patrimoine équestre de la Tunisie
          avec des technologies de pointe et des analyses professionnelles.
        </p>
        
        <div className="flex justify-center space-x-4">
          <Link 
            to="/dashboard"
            className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Dashboard Principal
          </Link>
          <Link 
            to="/profile"
            className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-medium"
          >
            Mon Profil
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
