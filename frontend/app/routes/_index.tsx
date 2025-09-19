import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Trophy, 
  Users, 
  ArrowRight,
  Star,
  Zap,
  Crown,
  Sparkles,
  Eye,
  BarChart3,
  Activity,
  DollarSign,
  Target,
  Globe,
  ChevronRight,
  TrendingUp,
  Award,
  Timer,
  Gauge,
  Flame,
  Shield,
  Play,
  ChevronDown
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export async function loader() {
  try {
    // Récupérer les données des courses depuis l'API
    const response = await fetch('http://localhost:3000/api/courses');
    const data = response.ok ? await response.json() : { courses: [] };
    
    return json({
      courses: data.courses || []
    });
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    return json({
      courses: []
    });
  }
}

export default function HomePage() {
  const { courses } = useLoaderData<typeof loader>();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeMetric, setActiveMetric] = useState(0);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const heroImages = [
    "/images/hero-1.jpg",
    "/images/hero-2.jpg", 
    "/images/hero-3.jpg"
  ];

  const livesStats = [
    { label: "Courses Aujourd'hui", value: "12", trend: "+15%", color: "bg-blue-500", icon: Calendar },
    { label: "Jockeys Actifs", value: "48", trend: "+8%", color: "bg-green-500", icon: Users },
    { label: "Chevaux Inscrits", value: "156", trend: "+12%", color: "bg-purple-500", icon: Crown },
    { label: "Prix Total", value: "2.4M DT", trend: "+22%", color: "bg-orange-500", icon: Trophy }
  ];

  const quickActions = [
    { 
      title: "Regarder en Live", 
      desc: "Course en direct",
      icon: Play,
      color: "bg-red-500",
      link: "/live",
      badge: "🔴 LIVE"
    },
    { 
      title: "Résultats Flash", 
      desc: "Derniers résultats",
      icon: Zap,
      color: "bg-yellow-500",
      link: "/results",
      badge: "⚡ NEW"
    },
    { 
      title: "Pronostics", 
      desc: "Paris intelligents",
      icon: Target,
      color: "bg-indigo-500",
      link: "/predictions",
      badge: "🎯 HOT"
    },
    { 
      title: "Rankings", 
      desc: "Classements live",
      icon: Award,
      color: "bg-pink-500",
      link: "/rankings",
      badge: "👑 TOP"
    }
  ];
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const metricTimer = setInterval(() => {
      setActiveMetric(prev => (prev + 1) % livesStats.length);
    }, 3000);
    return () => clearInterval(metricTimer);
  }, [livesStats.length]);

  useEffect(() => {
    const heroTimer = setInterval(() => {
      setHeroImageIndex(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(heroTimer);
  }, [heroImages.length]);
  
  const finishedCourses = courses.filter(race => race.status === 'finished');
  const upcomingCourses = courses.filter(race => race.status === 'scheduled');

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Groupe I': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Groupe II': return 'bg-orange-100 text-orange-800 border-orange-200'; 
      case 'Groupe III': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Listed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pur Sang Arabe': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const eliteMetrics = [
    { label: "Chevaux Elite", value: "156", icon: Activity, color: "text-green-600", trend: "+12%" },
    { label: "Jockeys Pro", value: "89", icon: Users, color: "text-blue-600", trend: "+8%" },
    { label: "Revenus 2024", value: "4.8M DT", icon: DollarSign, color: "text-purple-600", trend: "+15%" },
    { label: "Courses Elite", value: "42", icon: Trophy, color: "text-orange-600", trend: "+22%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section Premium Révolutionnaire */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600 text-white overflow-hidden min-h-[80vh] flex items-center"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-black/30"></div>
        <motion.div 
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        ></motion.div>
        
        {/* Particles Effect */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contenu principal premium */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-center space-x-3"
                >
                  <div className="relative">
                    <Crown className="h-10 w-10 text-yellow-300" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-2 border-2 border-yellow-300/30 rounded-full"
                    ></motion.div>
                  </div>
                  <motion.span 
                    animate={{ boxShadow: ["0 0 20px rgba(255,255,255,0.3)", "0 0 30px rgba(255,255,255,0.6)", "0 0 20px rgba(255,255,255,0.3)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-sm font-bold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30"
                  >
                    🏆 Elite Equestrian Platform
                  </motion.span>
                </motion.div>

                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-5xl sm:text-7xl font-bold leading-tight"
                >
                  <span className="block">Tunisia</span>
                  <span className="block text-yellow-300">Jockey Club</span>
                  <motion.span 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="block text-2xl sm:text-3xl mt-4 text-white/90 font-medium"
                  ></motion.span>
                </motion.h1>

                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="text-xl text-white/90 leading-relaxed max-w-xl"
                >
                  L'excellence équestre tunisienne avec des analytics avancées, 
                  des données en temps réel et une expérience premium pour les passionnés de courses.
                </motion.p>

                {/* Actions rapides premium */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="grid grid-cols-2 gap-4 mt-8"
                >
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.title}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link to={action.link} className="block">
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all duration-300">
                          <div className="flex items-center space-x-3">
                            <div className={`${action.color} p-2 rounded-lg`}>
                              <action.icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white">{action.title}</p>
                              <p className="text-xs text-white/70">{action.desc}</p>
                            </div>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                              {action.badge}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            {/* Stats live premium */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Horloge live */}
              <motion.div 
                animate={{ boxShadow: ["0 0 30px rgba(255,255,255,0.3)", "0 0 50px rgba(255,255,255,0.6)", "0 0 30px rgba(255,255,255,0.3)"] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center"
              >
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Timer className="h-5 w-5 text-yellow-300" />
                  <span className="text-sm font-semibold text-white/90">Live Time</span>
                </div>
                <div className="text-3xl font-mono font-bold text-yellow-300">
                  {currentTime.toLocaleTimeString('fr-TN')}
                </div>
                <div className="text-sm text-white/70 mt-1">
                  {currentTime.toLocaleDateString('fr-TN', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </div>
              </motion.div>

              {/* Stats animées */}
              <div className="grid grid-cols-2 gap-4">
                {livesStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 ${
                      activeMetric === index ? 'ring-2 ring-yellow-300' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className="h-5 w-5 text-white/80" />
                      <span className="text-xs bg-green-500/80 text-white px-2 py-1 rounded-full">
                        {stat.trend}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-white/70">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Principal */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/dashboard" 
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 px-8 rounded-xl text-center flex items-center justify-center space-x-3 transition-all duration-300 shadow-2xl"
                >
                  <Sparkles className="h-6 w-6" />
                  <span className="text-lg">Accéder au Dashboard Elite</span>
                  <ArrowRight className="h-6 w-6" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>
                    Centre d'Excellence Hippique
                  </span>
                </h1>
                <p className="text-xl text-white/90 max-w-2xl">
                  Depuis 1888, nous incarnons l'excellence hippique tunisienne avec des technologies de pointe et une expertise reconnue internationalement.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/horses/advanced"
                  className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg flex items-center space-x-2"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Découvrir nos Chevaux Elite</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/statistics/advanced"
                  className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-orange-600 transition-all flex items-center space-x-2"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>Analytics BI</span>
                </Link>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Tunis, Tunisie</span>
                  <span className="font-mono">{currentTime.toLocaleTimeString('fr-TN')}</span>
                </div>
              </div>
            </div>

            {/* Métriques en temps réel */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-300" />
                  <span>Performance Live</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {eliteMetrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                      <div
                        key={metric.label}
                        className={`p-4 rounded-xl transition-all duration-500 ${
                          activeMetric === index
                            ? 'bg-white/20 border-2 border-yellow-300 scale-105'
                            : 'bg-white/5 border border-white/10'
                        }`}
                      >
                        <Icon className={`h-6 w-6 ${metric.color} mb-2`} />
                        <div className="text-2xl font-bold">{metric.value}</div>
                        <div className="text-sm opacity-80">{metric.label}</div>
                        <div className="text-xs text-green-300 mt-1">{metric.trend}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-blue-300" />
                  <div>
                    <div className="font-semibold">Certification IFHA</div>
                    <div className="text-sm opacity-80">Système de Rating International</div>
                  </div>
                  <div className="ml-auto">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Actif
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Fonctionnalités Avancées Premium */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl shadow-2xl p-8 mb-8 border border-blue-100"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-8 w-8 text-purple-600" />
              </motion.div>
              <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                🚀 Fonctionnalités Elite
              </h3>
              <motion.div
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                <Crown className="h-8 w-8 text-yellow-500" />
              </motion.div>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Découvrez notre écosystème premium avec des outils d'analyse avancés et des données en temps réel
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                to: "/horses/advanced",
                color: "green",
                emoji: "🐎",
                title: "Chevaux Elite",
                desc: "Analytics avancées et profils détaillés",
                bgGradient: "from-green-400 to-emerald-500",
                hoverBg: "hover:bg-green-50"
              },
              {
                to: "/jockeys/advanced", 
                color: "blue",
                emoji: "🏇",
                title: "Jockeys Champions",
                desc: "Statistiques pros et analyses",
                bgGradient: "from-blue-400 to-indigo-500", 
                hoverBg: "hover:bg-blue-50"
              },
              {
                to: "/statistics/advanced",
                color: "purple", 
                emoji: "📊",
                title: "Business Intelligence",
                desc: "Tableaux de bord avancés",
                bgGradient: "from-purple-400 to-violet-500",
                hoverBg: "hover:bg-purple-50"
              },
              {
                to: "/home/advanced",
                color: "yellow",
                emoji: "🏠", 
                title: "Hub Premium",
                desc: "Centre de contrôle intégré",
                bgGradient: "from-yellow-400 to-orange-500",
                hoverBg: "hover:bg-yellow-50"
              },
              {
                to: "/races/advanced",
                color: "orange",
                emoji: "🏃‍♂️",
                title: "Courses Avancées", 
                desc: "Gestion complète avec analytics",
                bgGradient: "from-orange-400 to-red-500",
                hoverBg: "hover:bg-orange-50"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ scale: 0, opacity: 0, y: 20 }}
                whileInView={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to={feature.to}
                  className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border-2 border-transparent hover:border-${feature.color}-200 ${feature.hoverBg} relative overflow-hidden`}
                >
                  {/* Background Glow Effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  ></motion.div>
                  
                  <div className="text-center relative z-10">
                    {/* Badge NOUVEAU avec effet pulse */}
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          "0 0 0 0 rgba(239, 68, 68, 0.7)",
                          "0 0 0 10px rgba(239, 68, 68, 0)",
                          "0 0 0 0 rgba(239, 68, 68, 0)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                    >
                      <span className="flex items-center space-x-1">
                        <Flame className="h-3 w-3" />
                        <span>NOUVEAU</span>
                      </span>
                    </motion.div>

                    {/* Icon avec animation */}
                    <motion.div 
                      className={`w-20 h-20 bg-gradient-to-br ${feature.bgGradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl transition-all duration-300`}
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="text-3xl filter drop-shadow-lg">{feature.emoji}</span>
                    </motion.div>

                    <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {feature.desc}
                    </p>
                    
                    {/* CTA avec animation */}
                    <motion.div 
                      className={`mt-6 text-${feature.color}-600 font-bold group-hover:text-${feature.color}-700 flex items-center justify-center space-x-2`}
                      whileHover={{ x: 5 }}
                    >
                      <span>Découvrir</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Stats en bas */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {eliteMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                <metric.icon className={`h-8 w-8 ${metric.color} mx-auto mb-2`} />
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
                <div className="text-xs text-green-600 font-semibold">{metric.trend}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

            <Link 
              to="/jockeys/advanced"
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-2 border-transparent hover:border-blue-200"
            >
              <div className="text-center relative">
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  NOUVEAU
                </div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <span className="text-2xl">🏇</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Jockeys Champions</h4>
                <p className="text-gray-600 text-sm">Statistiques pros et analyses de performance</p>
                <div className="mt-4 text-blue-600 font-medium group-hover:text-blue-700">
                  Découvrir →
                </div>
              </div>
            </Link>

            <Link 
              to="/statistics/advanced"
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-2 border-transparent hover:border-purple-200"
            >
              <div className="text-center relative">
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  NOUVEAU
                </div>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Business Intelligence</h4>
                <p className="text-gray-600 text-sm">Tableaux de bord avancés et analytics</p>
                <div className="mt-4 text-purple-600 font-medium group-hover:text-purple-700">
                  Découvrir →
                </div>
              </div>
            </Link>

            <Link 
              to="/home/advanced"
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-2 border-transparent hover:border-yellow-200"
            >
              <div className="text-center relative">
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  NOUVEAU
                </div>
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                  <span className="text-2xl">🏠</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Hub Premium</h4>
                <p className="text-gray-600 text-sm">Centre de contrôle intégré avec KPIs</p>
                <div className="mt-4 text-yellow-600 font-medium group-hover:text-yellow-700">
                  Découvrir →
                </div>
              </div>
            </Link>

            <Link 
              to="/races/advanced"
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-2 border-transparent hover:border-orange-200"
            >
              <div className="text-center relative">
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  NOUVEAU
                </div>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                  <span className="text-2xl">🏃‍♂️</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Courses Avancées</h4>
                <p className="text-gray-600 text-sm">Gestion complète des courses avec analytics</p>
                <div className="mt-4 text-orange-600 font-medium group-hover:text-orange-700">
                  Découvrir →
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Section Excellence Hippique */}
        <section className="bg-gradient-to-r from-blue-50 to-green-50 py-16 mb-16 rounded-2xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Excellence Hippique Tunisienne
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Un héritage de plus de 135 ans d'expertise équestre, combinant tradition et innovation technologique
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Crown className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Patrimoine Historique</h3>
                <p className="text-gray-600 mb-6">
                  Depuis 1888, le Tunisia Jockey Club perpétue les traditions hippiques avec une expertise reconnue dans tout le Maghreb.
                </p>
                <div className="flex justify-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Fondé en 1888
                  </span>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg border border-green-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Innovation Technologique</h3>
                <p className="text-gray-600 mb-6">
                  Système IFHA de rating international, analytics avancées et technologies de pointe pour l'excellence équestre.
                </p>
                <div className="flex justify-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Zap className="h-4 w-4 mr-1" />
                    Technologie 2024
                  </span>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg border border-purple-100">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Rayonnement International</h3>
                <p className="text-gray-600 mb-6">
                  Reconnaissance IFHA, partenariats internationaux et participation aux grands événements hippiques mondiaux.
                </p>
                <div className="flex justify-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Certification IFHA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Results Section */}
        {finishedCourses.length > 0 && (
          <section className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                🏆 Derniers Résultats
              </h3>
              <p className="text-gray-600 text-lg">
                Les performances récentes de nos champions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {finishedCourses.slice(0, 6).map((race) => (
                <div key={race.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900">{race.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(race.category)}`}>
                      {race.category}
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(race.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{race.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-2" />
                      <span>{race.distance}m - {race.surface}</span>
                    </div>
                  </div>

                  {race.results && race.results.length > 0 && (
                    <div className="border-t pt-4">
                      <h5 className="font-semibold text-gray-900 mb-2">Podium</h5>
                      <div className="space-y-2">
                        {race.results.slice(0, 3).map((result, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3 ${
                                index === 0 ? 'bg-yellow-500' : 
                                index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                              }`}>
                                {index + 1}
                              </span>
                              <span className="font-medium">{result.horse}</span>
                            </div>
                            <span className="text-sm text-gray-500">{result.jockey}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Races Section */}
        {upcomingCourses.length > 0 && (
          <section className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                📅 Prochaines Courses
              </h3>
              <p className="text-gray-600 text-lg">
                Les événements à venir dans votre calendrier hippique
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingCourses.slice(0, 6).map((race) => (
                <div key={race.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900">{race.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(race.category)}`}>
                      {race.category}
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(race.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{race.time || '15:00'}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{race.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-2" />
                      <span>{race.distance}m - {race.surface}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{race.participants || 'TBA'} participants</span>
                    </div>
                    <Link 
                      to={`/races/${race.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                    >
                      Détails
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Call to Action Section */}
        <section className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-16 rounded-2xl text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Rejoignez l'Excellence Hippique Tunisienne
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Découvrez notre écosystème complet : formations, événements, et technologies de pointe
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/dashboard"
                className="bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg flex items-center"
              >
                <Eye className="h-5 w-5 mr-2" />
                Accéder au Dashboard
              </Link>
              <Link 
                to="/rating"
                className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-orange-600 transition-all flex items-center"
              >
                <Target className="h-5 w-5 mr-2" />
                Système Rating IFHA
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
