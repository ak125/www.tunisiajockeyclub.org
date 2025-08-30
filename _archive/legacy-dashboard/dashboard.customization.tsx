import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { 
  Palette, Moon, Sun, Settings, Save, RefreshCw,
  Eye, Target, Trophy, Users,
  ArrowRight, Sparkles, Brush, Download
} from "lucide-react";
import { useState, useEffect } from "react";

// Types pour les thèmes
interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  gradient: string;
  preview: string;
}

interface CustomizationData {
  themes: Theme[];
  currentTheme: string;
  customizations: {
    animations: boolean;
    compactMode: boolean;
    showIcons: boolean;
    autoRefresh: boolean;
  };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const mockData: CustomizationData = {
    themes: [
      {
        id: "default",
        name: "Classique",
        description: "Thème par défaut élégant",
        colors: {
          primary: "#3B82F6",
          secondary: "#10B981",
          accent: "#F59E0B",
          background: "#F8FAFC",
          surface: "#FFFFFF",
          text: "#1F2937"
        },
        gradient: "from-blue-50 to-indigo-50",
        preview: "bg-gradient-to-r from-blue-100 to-indigo-100"
      },
      {
        id: "dark",
        name: "Sombre",
        description: "Mode sombre moderne",
        colors: {
          primary: "#60A5FA",
          secondary: "#34D399",
          accent: "#FBBF24",
          background: "#0F172A",
          surface: "#1E293B",
          text: "#F1F5F9"
        },
        gradient: "from-slate-900 to-slate-800",
        preview: "bg-gradient-to-r from-slate-700 to-slate-800"
      },
      {
        id: "sunset",
        name: "Coucher de Soleil",
        description: "Couleurs chaudes du désert",
        colors: {
          primary: "#F97316",
          secondary: "#EF4444",
          accent: "#F59E0B",
          background: "#FFF7ED",
          surface: "#FFFFFF",
          text: "#9A3412"
        },
        gradient: "from-orange-50 to-red-50",
        preview: "bg-gradient-to-r from-orange-200 to-red-200"
      },
      {
        id: "forest",
        name: "Forêt",
        description: "Inspiré de la nature",
        colors: {
          primary: "#059669",
          secondary: "#0D9488",
          accent: "#84CC16",
          background: "#F0FDF4",
          surface: "#FFFFFF",
          text: "#064E3B"
        },
        gradient: "from-green-50 to-emerald-50",
        preview: "bg-gradient-to-r from-green-200 to-emerald-200"
      },
      {
        id: "royal",
        name: "Royal",
        description: "Luxe et élégance",
        colors: {
          primary: "#7C3AED",
          secondary: "#DB2777",
          accent: "#F59E0B",
          background: "#FAF5FF",
          surface: "#FFFFFF",
          text: "#581C87"
        },
        gradient: "from-purple-50 to-pink-50",
        preview: "bg-gradient-to-r from-purple-200 to-pink-200"
      },
      {
        id: "ocean",
        name: "Océan",
        description: "Fraîcheur marine",
        colors: {
          primary: "#0EA5E9",
          secondary: "#06B6D4",
          accent: "#10B981",
          background: "#F0F9FF",
          surface: "#FFFFFF",
          text: "#0C4A6E"
        },
        gradient: "from-sky-50 to-cyan-50",
        preview: "bg-gradient-to-r from-sky-200 to-cyan-200"
      }
    ],
    currentTheme: "default",
    customizations: {
      animations: true,
      compactMode: false,
      showIcons: true,
      autoRefresh: false
    }
  };

  return json(mockData);
}

export default function CustomizationPage() {
  const data = useLoaderData<CustomizationData>();
  const [selectedTheme, setSelectedTheme] = useState(data.currentTheme);
  const [customizations, setCustomizations] = useState(data.customizations);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const currentThemeData = data.themes.find(t => t.id === selectedTheme) || data.themes[0];

  useEffect(() => {
    // Appliquer le thème sélectionné
    const root = document.documentElement;
    const theme = currentThemeData;
    
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text', theme.colors.text);
  }, [selectedTheme, currentThemeData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className={`min-h-screen transition-all duration-500 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white' 
          : `bg-gradient-to-br ${currentThemeData.gradient}`
      }`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header
        className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white/80 backdrop-blur-sm border-gray-200'} shadow-sm border-b`}
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Palette className="w-8 h-8" style={{ color: currentThemeData.colors.primary }} />
                Personnalisation
              </h1>
              <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Personnalisez l'apparence de votre dashboard
              </p>
            </div>
            
            <div className="flex gap-3">
              <Link
                to="/dashboard-main"
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  isDarkMode 
                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Dashboard
              </Link>
              
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-3 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400' 
                    : 'bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {previewMode ? 'Quitter Aperçu' : 'Aperçu'}
              </button>
              
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" />
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel de Thèmes */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <div className={`rounded-xl shadow-sm border p-6 ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <Brush className="w-6 h-6" style={{ color: currentThemeData.colors.primary }} />
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Sélection du Thème
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.themes.map((theme, index) => (
                  <motion.div
                    key={theme.id}
                    className={`relative p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                      selectedTheme === theme.id
                        ? `border-2 ring-4 ring-opacity-50`
                        : isDarkMode
                        ? 'border-slate-600 hover:border-slate-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{
                      borderColor: selectedTheme === theme.id ? theme.colors.primary : undefined
                    }}
                    onClick={() => setSelectedTheme(theme.id)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {selectedTheme === theme.id && (
                      <motion.div
                        className="absolute -top-2 -right-2 rounded-full p-1"
                        style={{ backgroundColor: theme.colors.primary }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Sparkles className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                    
                    <div className={`w-full h-16 rounded-lg mb-3 ${theme.preview}`}></div>
                    
                    <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {theme.name}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {theme.description}
                    </p>
                    
                    <div className="flex gap-1 mt-3">
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: theme.colors.primary }}
                      ></div>
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: theme.colors.secondary }}
                      ></div>
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: theme.colors.accent }}
                      ></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Panel de Personnalisation */}
          <motion.div variants={itemVariants}>
            <div className={`rounded-xl shadow-sm border p-6 ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-6 h-6" style={{ color: currentThemeData.colors.primary }} />
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Options
                </h2>
              </div>

              <div className="space-y-6">
                {/* Animations */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Animations
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Effets visuels fluides
                    </p>
                  </div>
                  <button
                    onClick={() => setCustomizations({...customizations, animations: !customizations.animations})}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      customizations.animations ? 'bg-blue-600' : isDarkMode ? 'bg-slate-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        customizations.animations ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>

                {/* Mode Compact */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Mode Compact
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Interface plus dense
                    </p>
                  </div>
                  <button
                    onClick={() => setCustomizations({...customizations, compactMode: !customizations.compactMode})}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      customizations.compactMode ? 'bg-blue-600' : isDarkMode ? 'bg-slate-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        customizations.compactMode ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>

                {/* Afficher les Icônes */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Icônes
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Afficher les icônes
                    </p>
                  </div>
                  <button
                    onClick={() => setCustomizations({...customizations, showIcons: !customizations.showIcons})}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      customizations.showIcons ? 'bg-blue-600' : isDarkMode ? 'bg-slate-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        customizations.showIcons ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>

                {/* Auto-actualisation */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Auto-refresh
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Mise à jour auto
                    </p>
                  </div>
                  <button
                    onClick={() => setCustomizations({...customizations, autoRefresh: !customizations.autoRefresh})}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      customizations.autoRefresh ? 'bg-blue-600' : isDarkMode ? 'bg-slate-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        customizations.autoRefresh ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 space-y-3">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Exporter le Thème
                </button>
                
                <button className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 border ${
                  isDarkMode 
                    ? 'border-slate-600 text-gray-300 hover:bg-slate-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}>
                  <RefreshCw className="w-4 h-4" />
                  Réinitialiser
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Aperçu des Composants */}
        {previewMode && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`rounded-xl shadow-sm border p-6 ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'
            }`}>
              <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Aperçu des Composants
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Courses Actives
                      </p>
                      <p className="text-2xl font-bold" style={{ color: currentThemeData.colors.primary }}>
                        12
                      </p>
                    </div>
                    {customizations.showIcons && <Target className="w-8 h-8" style={{ color: currentThemeData.colors.primary }} />}
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Chevaux
                      </p>
                      <p className="text-2xl font-bold" style={{ color: currentThemeData.colors.secondary }}>
                        45
                      </p>
                    </div>
                    {customizations.showIcons && <Users className="w-8 h-8" style={{ color: currentThemeData.colors.secondary }} />}
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Victoires
                      </p>
                      <p className="text-2xl font-bold" style={{ color: currentThemeData.colors.accent }}>
                        8
                      </p>
                    </div>
                    {customizations.showIcons && <Trophy className="w-8 h-8" style={{ color: currentThemeData.colors.accent }} />}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${customizations.animations ? 'transform hover:scale-105' : ''}`}
                  style={{ 
                    backgroundColor: currentThemeData.colors.primary,
                    color: 'white'
                  }}
                >
                  Bouton Principal
                </button>
                <button
                  className={`ml-3 px-6 py-3 rounded-lg font-medium border-2 transition-colors ${customizations.animations ? 'transform hover:scale-105' : ''} ${
                    isDarkMode ? 'text-white hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{ 
                    borderColor: currentThemeData.colors.primary,
                    color: currentThemeData.colors.primary
                  }}
                >
                  Bouton Secondaire
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
