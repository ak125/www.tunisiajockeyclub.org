import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import { ExecutiveBadge, ExecutiveStatus } from "../components/ui/executive-components";
import { ExecutiveNavigation } from "../components/ui/executive-navigation";

export const loader: LoaderFunction = async () => {
  try {
    // Fetch system status
    const response = await fetch('http://localhost:3000/api/status');
    let systemHealth = {
      status: 'maintenance',
      isHealthy: false,
      lastCheck: new Date().toISOString(),
      environment: 'development'
    };

    if (response.ok) {
      systemHealth = await response.json();
    }

    return json({ systemHealth });
  } catch (error) {
    return json({ 
      systemHealth: {
        status: 'error',
        isHealthy: false,
        lastCheck: new Date().toISOString(),
        environment: 'development'
      }
    });
  }
};

export default function ExecutiveIndex() {
  const { systemHealth } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-2xl">🏇</span>
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-800">Club Jockey Tunisie</h1>
                <p className="text-lg text-slate-600 font-medium">Système de Gestion Exécutif</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ExecutiveStatus
                status={systemHealth.isHealthy ? 'operational' : 'critical'}
                label={systemHealth.isHealthy ? 'Système Opérationnel' : 'Maintenance'}
              />
              <ExecutiveBadge variant="ministerial" size="lg">
                AUTORITÉ OFFICIELLE
              </ExecutiveBadge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-black text-slate-800 mb-6"
            >
              Interface de Gestion
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Professionnelle
              </span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            >
              Système intégré de gestion pour les sports équestres en Tunisie. 
              Interface exécutive avec analytics avancés, gestion des licences professionnelles 
              et rapports de conformité réglementaire.
            </motion.p>
          </div>

          {/* Key Features Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Gestion Centralisée",
                description: "Interface unique pour toutes les opérations du secteur équestre",
                icon: "🏛️",
                color: "from-indigo-500 to-indigo-600"
              },
              {
                title: "Analytics Avancés", 
                description: "Rapports détaillés et analytics en temps réel",
                icon: "📊",
                color: "from-purple-500 to-purple-600"
              },
              {
                title: "Conformité Réglementaire",
                description: "Respect des standards internationaux et locaux",
                icon: "✅", 
                color: "from-emerald-500 to-emerald-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/60 hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Section */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <ExecutiveNavigation />
          </motion.div>
        </div>
      </section>

      {/* System Status Footer */}
      <footer className="bg-white/80 backdrop-blur-lg border-t border-slate-200/60 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-sm text-slate-600">
                <span className="font-medium">Dernière mise à jour:</span> {new Date(systemHealth.lastCheck).toLocaleString('fr-FR')}
              </div>
              <ExecutiveBadge variant="certified" size="sm">
                Environment: {systemHealth.environment}
              </ExecutiveBadge>
            </div>
            
            <div className="flex items-center space-x-4">
              <ExecutiveBadge variant="international" size="sm">
                Standards ISO 9001
              </ExecutiveBadge>
              <ExecutiveBadge variant="premium" size="sm">
                Certifié FEI
              </ExecutiveBadge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
