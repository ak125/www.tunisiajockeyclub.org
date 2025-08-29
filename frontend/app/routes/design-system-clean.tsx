import { type MetaFunction } from "@remix-run/node";
import { motion } from "framer-motion";

export const meta: MetaFunction = () => {
  return [
    { title: "Design System Executive - Tunisia Jockey Club" },
    { name: "description", content: "Catalogue complet des styles UI Executive" },
  ];
};

export default function DesignSystemDemo() {
  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-8xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Design System Executive</h1>
              <p className="text-lg text-slate-600 mt-2">Catalogue des composants UI - Tunisia Jockey Club</p>
            </div>
            <button className="px-8 py-3 bg-gradient-to-r from-indigo-900 to-slate-900 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-0.5">
              Interface Principale
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-8xl mx-auto px-8 py-12">
        
        {/* Colors Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-black text-slate-900 mb-8">Palette de Couleurs Executive</h2>
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
              <div className="grid md:grid-cols-4 gap-8">
                
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Primary - Slate</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-50 rounded border"></div>
                      <span className="text-sm font-mono">slate-50</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded"></div>
                      <span className="text-sm font-mono">slate-100</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-500 rounded"></div>
                      <span className="text-sm font-mono text-white">slate-500</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-900 rounded"></div>
                      <span className="text-sm font-mono text-white">slate-900</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Authority - Indigo</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded"></div>
                      <span className="text-sm font-mono">indigo-100</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-600 rounded"></div>
                      <span className="text-sm font-mono text-white">indigo-600</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-900 rounded"></div>
                      <span className="text-sm font-mono text-white">indigo-900</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Success - Emerald</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded"></div>
                      <span className="text-sm font-mono">emerald-100</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-500 rounded"></div>
                      <span className="text-sm font-mono text-white">emerald-500</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-700 rounded"></div>
                      <span className="text-sm font-mono text-white">emerald-700</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Critical - Red</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded"></div>
                      <span className="text-sm font-mono">red-100</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-500 rounded"></div>
                      <span className="text-sm font-mono text-white">red-500</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-700 rounded"></div>
                      <span className="text-sm font-mono text-white">red-700</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Typography Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-black text-slate-900 mb-8">Typographie Executive</h2>
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
              <div className="space-y-8">
                
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Headlines - Titres Officiels</h3>
                  <div className="space-y-4">
                    <div className="text-6xl font-black text-slate-900 tracking-tight">Excellence Institutionnelle</div>
                    <div className="text-4xl font-black text-slate-900 tracking-tight">Autorité Suprême</div>
                    <div className="text-3xl font-black text-slate-900 tracking-tight">Institution Officielle</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Titles - Sous-sections</h3>
                  <div className="space-y-3">
                    <div className="text-2xl font-bold text-slate-900">Supervision & Performance</div>
                    <div className="text-xl font-bold text-slate-900">Centre de Commande Executive</div>
                    <div className="text-lg font-semibold text-slate-900">Données Stratégiques 2025</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Body Text - Contenu</h3>
                  <div className="space-y-3">
                    <p className="text-lg text-slate-600 leading-relaxed">
                      Autorité suprême des sports hippiques tunisiens. Institution officielle supervisant l'intégrité, 
                      la réglementation et l'excellence des compétitions hippiques depuis 1884.
                    </p>
                    <p className="text-base text-slate-600 leading-relaxed">
                      Indicateurs de performance institutionnelle et supervision des opérations stratégiques.
                    </p>
                    <p className="text-sm text-slate-500">
                      Sous tutelle du Ministère de la Jeunesse et des Sports de la République Tunisienne.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Labels - Système</h3>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-sm font-bold text-slate-600 uppercase tracking-wide">OFFICIEL</span>
                    <span className="text-sm font-bold text-emerald-600 uppercase tracking-wide">OPÉRATIONNEL</span>
                    <span className="text-sm font-bold text-red-600 uppercase tracking-wide">URGENT</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">CERTIFIÉ</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Badges Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-black text-slate-900 mb-8">Badges Executive</h2>
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
              <div className="grid md:grid-cols-3 gap-8">
                
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Authority Badges</h3>
                  <div className="space-y-4">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-900 to-slate-900 text-white shadow-2xl border border-indigo-800/20">
                      Autorité Officielle
                    </span>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-800 to-emerald-900 text-white shadow-2xl border border-emerald-700/20">
                      Certifié
                    </span>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-2xl border border-purple-700/20">
                      Ministériel
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Status Indicators</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-bold text-emerald-700 uppercase tracking-wide">OPÉRATIONNEL</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-bold text-yellow-700 uppercase tracking-wide">ATTENTION</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-bold text-red-700 uppercase tracking-wide">CRITIQUE</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Progress Rings</h3>
                  <div className="flex items-center justify-center">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="#e2e8f0"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="#4f46e5"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray="251"
                          strokeDashoffset="50"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-xl font-black text-indigo-600">85%</div>
                          <div className="text-xs font-bold text-slate-500 uppercase">Conformité</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Buttons Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-black text-slate-900 mb-8">Buttons Executive</h2>
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
              <div className="grid md:grid-cols-2 gap-8">
                
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Primary Actions</h3>
                  <div className="space-y-4">
                    <button className="px-8 py-3 bg-gradient-to-r from-indigo-900 to-slate-900 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-0.5">
                      Tableau de Bord Executive
                    </button>
                    <button className="px-8 py-3 bg-gradient-to-r from-red-800 to-red-900 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300">
                      Action Ministérielle
                    </button>
                    <button className="px-8 py-3 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300">
                      Certification Validée
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Secondary Actions</h3>
                  <div className="space-y-4">
                    <button className="px-8 py-3 bg-white text-slate-900 border-2 border-slate-300 hover:border-slate-900 font-semibold rounded-2xl transition-all duration-300">
                      Documentation Officielle
                    </button>
                    <button className="px-8 py-3 bg-slate-50 text-slate-700 hover:bg-slate-100 font-semibold rounded-2xl transition-all duration-300">
                      Support Professionnel
                    </button>
                    <button className="px-8 py-3 bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold rounded-2xl transition-all duration-300">
                      Accès Rapide
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Cards Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-black text-slate-900 mb-8">Executive Cards</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-100 group">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-slate-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">🏅</span>
                  </div>
                  <div className="text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full">
                    +12.5%
                  </div>
                </div>
                <div className="text-4xl font-black text-slate-900 mb-2 group-hover:text-indigo-900 transition-colors duration-300">1,247</div>
                <div className="text-lg font-bold text-slate-800 mb-2">Licences Actives</div>
                <div className="text-sm text-slate-500 font-medium">Professionnels certifiés</div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-100 group">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">🏆</span>
                  </div>
                  <div className="text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full">
                    +18.2%
                  </div>
                </div>
                <div className="text-4xl font-black text-slate-900 mb-2 group-hover:text-emerald-900 transition-colors duration-300">89</div>
                <div className="text-lg font-bold text-slate-800 mb-2">Événements</div>
                <div className="text-sm text-slate-500 font-medium">Compétitions supervisées</div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-100 group">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">✓</span>
                  </div>
                  <div className="text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full">
                    +2.1%
                  </div>
                </div>
                <div className="text-4xl font-black text-slate-900 mb-2 group-hover:text-purple-900 transition-colors duration-300">98.9%</div>
                <div className="text-lg font-bold text-slate-800 mb-2">Conformité</div>
                <div className="text-sm text-slate-500 font-medium">Standards internationaux</div>
              </div>
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  );
}
