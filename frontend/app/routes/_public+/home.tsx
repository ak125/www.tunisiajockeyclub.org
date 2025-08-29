import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import AdvancedDashboard from "~/components/dashboard/AdvancedDashboard";
import GlobalSearch from "~/components/search/GlobalSearch";
import DetailedProfile from "~/components/profile/DetailedProfile";

interface SearchResult {
  id: string;
  type: 'horse' | 'jockey' | 'trainer' | 'owner' | 'race';
  title: string;
  subtitle: string;
  description: string;
  metadata?: any;
}

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<{id: string, type: string} | null>(null);

  const handleSearchResultSelect = (result: SearchResult) => {
    if (['horse', 'jockey', 'trainer', 'owner'].includes(result.type)) {
      setSelectedProfile({ id: result.id, type: result.type });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-yellow-600 via-yellow-500 to-green-600 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                🏇 Tunisia Jockey Club
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-yellow-100">
                Plateforme moderne de gestion hippique tunisienne
              </p>
              <p className="text-lg mb-12 text-yellow-200 max-w-3xl mx-auto">
                Découvrez l'univers passionnant des courses de chevaux en Tunisie avec des données authentiques 
                de l'Hippodrome de Ben Guerdane et une interface utilisateur de dernière génération.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setIsSearchOpen(true)}
                  className="bg-white text-yellow-700 hover:bg-yellow-50 px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  🔍 Explorer les données
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  📊 Voir les statistiques
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Fonctionnalités Avancées
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Une plateforme complète avec des outils modernes pour suivre et analyser l'univers hippique tunisien
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "🏇",
                  title: "Données Authentiques",
                  description: "97 participants réels de l'Hippodrome de Ben Guerdane avec historiques complets"
                },
                {
                  icon: "📊",
                  title: "Dashboard Interactif",
                  description: "Graphiques en temps réel, statistiques avancées et analyses de performance"
                },
                {
                  icon: "🔍",
                  title: "Recherche Intelligente",
                  description: "Trouvez instantanément chevaux, jockeys, entraîneurs avec recherche floue"
                },
                {
                  icon: "👤",
                  title: "Profils Détaillés",
                  description: "Pages complètes avec historiques, performances et connexions"
                },
                {
                  icon: "🏆",
                  title: "Classements Live",
                  description: "Palmarès actualisés, statistiques de victoires et taux de réussite"
                },
                {
                  icon: "📱",
                  title: "Interface Responsive",
                  description: "Optimisé pour tous les appareils avec design moderne"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="text-4xl mb-4 text-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Dashboard en Action
              </h2>
              <p className="text-lg text-gray-600">
                Découvrez les statistiques en temps réel de l'hippodrome tunisien
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <AdvancedDashboard />
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-yellow-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Données en Temps Réel
              </h2>
              <p className="text-lg text-green-100">
                Programme officiel de l'Hippodrome de Ben Guerdane - 37e Journée
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "97", label: "Participants", subtitle: "Utilisateurs actifs" },
                { number: "45", label: "Chevaux", subtitle: "Pur-sang Arabes" },
                { number: "4", label: "Courses", subtitle: "Programme du 2 août" },
                { number: "16,575", label: "DT", subtitle: "Dotations totales" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                  <div className="text-lg font-semibold text-green-100">{stat.label}</div>
                  <div className="text-sm text-green-200">{stat.subtitle}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Prêt à Explorer ?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Rejoignez la communauté hippique tunisienne et découvrez tous les secrets du turf
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setIsSearchOpen(true)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  🔍 Commencer l'exploration
                </Button>
                <Button 
                  className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  📖 En savoir plus
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Modal de recherche globale */}
      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onResultSelect={handleSearchResultSelect}
      />

      {/* Modal de profil détaillé */}
      {selectedProfile && (
        <DetailedProfile
          profileId={selectedProfile.id}
          profileType={selectedProfile.type as 'horse' | 'jockey' | 'trainer' | 'owner'}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </>
  );
}  
