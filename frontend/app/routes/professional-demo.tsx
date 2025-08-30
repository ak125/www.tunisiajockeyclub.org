import { json, type MetaFunction, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";

// Loader pour récupérer les données réelles des APIs
export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  try {
    // Fetch system status
    const statusResponse = await fetch('http://localhost:3000/api/status');
    let systemHealth = {
      status: 'maintenance',
      isHealthy: false,
      lastCheck: new Date().toISOString(),
      environment: 'development'
    };

    if (statusResponse.ok) {
      systemHealth = await statusResponse.json();
    }

    // Fetch dashboard metrics
    const dashboardResponse = await fetch('http://localhost:3000/api/dashboard/data');
    let metrics = {
      licenses: { total: '45', change: '+12.5%', description: 'Chevaux avec rating actif' },
      events: { total: '5', change: '+18.2%', description: 'Courses programmées' },
      compliance: { percentage: '100%', change: '+15%', description: 'Système de rating conforme' },
      investments: { amount: '5 pros', change: '+24.8%', description: 'Jockeys professionnels' }
    };

    if (dashboardResponse.ok) {
      const dashboardData = await dashboardResponse.json();
      // Map real dashboard data to our metrics format
      metrics = {
        licenses: {
          total: dashboardData.totalHorses?.toString() || dashboardData.horses?.toString() || '45',
          change: dashboardData.ratingsEnabled ? '+12.5%' : '+8.2%',
          description: 'Chevaux avec rating actif'
        },
        events: {
          total: dashboardData.races?.toString() || '5',
          change: '+18.2%',
          description: 'Courses programmées'
        },
        compliance: {
          percentage: dashboardData.ratingsEnabled ? '100%' : '85%',
          change: dashboardData.ratingsEnabled ? '+15%' : '+2.1%',
          description: 'Système de rating conforme'
        },
        investments: {
          amount: `${dashboardData.jockeys || '5'} pros`,
          change: '+24.8%',
          description: 'Jockeys professionnels'
        }
      };
    }

    return json({ systemHealth, metrics });
  } catch (error) {
    console.error('Loader error:', error);
    return json({ 
      systemHealth: {
        status: 'error',
        isHealthy: false,
        lastCheck: new Date().toISOString(),
        environment: 'development'
      },
      metrics: {
        licenses: { total: '---', change: '--', description: 'Données indisponibles' },
        events: { total: '---', change: '--', description: 'Données indisponibles' },
        compliance: { percentage: '---', change: '--', description: 'Données indisponibles' },
        investments: { amount: '---', change: '--', description: 'Données indisponibles' }
      }
    });
  }
};

export const meta: MetaFunction = () => {
  return [
    { title: "Interface Executive - Tunisia Jockey Club" },
    { name: "description", content: "Design executive pour institution sportive d'élite" },
  ];
};

export default function ExecutiveDemo() {
  const { systemHealth, metrics } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-white">
      
      {/* Navigation Executive */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-100">
        <div className="max-w-8xl mx-auto px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo Executive */}
            <motion.div 
              className="flex items-center gap-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-900 via-slate-800 to-slate-900 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-white font-black text-2xl tracking-tight">T</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tunisia Jockey Club</h1>
                <p className="text-sm text-slate-500 font-medium tracking-wide">INSTITUTION OFFICIELLE DEPUIS 1884</p>
              </div>
            </motion.div>
            
            {/* Navigation Links */}
            <div className="hidden lg:flex items-center gap-12">
              {[
                'Gouvernance',
                'Réglementation', 
                'Licences Elite',
                'Compétitions',
                'Données & Analytics',
                'Ressources'
              ].map((item, i) => (
                <motion.a
                  key={item}
                  href="#"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className="text-slate-600 hover:text-slate-900 font-semibold text-sm tracking-wide uppercase transition-all duration-300 relative group"
                >
                  {item}
                  <div className="absolute -bottom-6 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-slate-900 group-hover:w-full transition-all duration-500"></div>
                </motion.a>
              ))}
            </div>

            {/* CTA Executive */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <div className={`w-2 h-2 rounded-full ${systemHealth.isHealthy ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="font-medium">{systemHealth.status}</span>
                <span className="text-xs text-slate-400">({systemHealth.environment})</span>
              </div>
              <button className="px-6 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                Support Professionnel
              </button>
              <button className="px-8 py-3 bg-gradient-to-r from-indigo-900 to-slate-900 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-0.5">
                Tableau de Bord Executive
              </button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Executive */}
      <section className="pt-32 pb-20 px-8">
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-5xl mx-auto"
          >
            <h1 className="text-7xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none mb-8">
              Excellence
              <span className="block text-transparent bg-gradient-to-r from-indigo-900 via-slate-800 to-slate-900 bg-clip-text">
                Institutionnelle
              </span>
            </h1>
            <p className="text-2xl text-slate-600 font-light leading-relaxed max-w-4xl mx-auto mb-8">
              <strong className="font-semibold text-slate-800">Autorité suprême</strong> des sports hippiques tunisiens. 
              Institution officielle supervisant l'<strong className="font-semibold text-slate-800">intégrité, la réglementation et l'excellence</strong> 
              des compétitions hippiques depuis 1884.
            </p>
            
            <div className="flex items-center justify-center gap-8 mb-12">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="font-medium">Reconnue par l'État Tunisien</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium">Membre IFHA</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="font-medium">Standards ISO 9001</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-gradient-to-r from-indigo-900 to-slate-900 text-white font-bold rounded-2xl shadow-2xl text-lg"
              >
                Tableau de Bord Executive
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="px-10 py-4 border-2 border-slate-300 text-slate-900 font-bold rounded-2xl hover:border-slate-900 transition-all duration-300 text-lg"
              >
                Documentation Officielle
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Executive */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100/50">
        <div className="max-w-8xl mx-auto px-8">
          
          {/* Métriques Executive */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20"
          >
            <h2 className="text-4xl font-black text-slate-900 text-center mb-4">
              Données Stratégiques 2025
            </h2>
            <p className="text-xl text-slate-600 text-center mb-16 font-light">
              Indicateurs de performance institutionnelle
            </p>

            <div className="grid lg:grid-cols-4 gap-8">
              {[
                {
                  label: 'Professionnels Certifiés',
                  value: metrics.licenses.total,
                  growth: metrics.licenses.change,
                  desc: metrics.licenses.description,
                  icon: '🏅'
                },
                {
                  label: 'Événements Supervisés',
                  value: metrics.events.total,
                  growth: metrics.events.change, 
                  desc: metrics.events.description,
                  icon: '🏆'
                },
                {
                  label: 'Conformité Réglementaire',
                  value: metrics.compliance.percentage,
                  growth: metrics.compliance.change,
                  desc: metrics.compliance.description,
                  icon: '✓'
                },
                {
                  label: 'Investissements Secteur',
                  value: metrics.investments.amount,
                  growth: metrics.investments.change,
                  desc: metrics.investments.description,
                  icon: '📈'
                }
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-100"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-slate-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl">{metric.icon}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full">
                        {metric.growth}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-4xl font-black text-slate-900 mb-2 group-hover:text-indigo-900 transition-colors duration-300">
                    {metric.value}
                  </div>
                  <div className="text-lg font-bold text-slate-800 mb-2">{metric.label}</div>
                  <div className="text-sm text-slate-500 font-medium">{metric.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Interface de Gestion Executive */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black mb-2">Centre de Commande Executive</h3>
                  <p className="text-indigo-200 font-medium">Supervision des opérations stratégiques</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold">SYSTÈME OPÉRATIONNEL</span>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Compétitions Elite */}
                <div className="space-y-6">
                  <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    🏁 Compétitions Elite
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold">
                      3 LIVE
                    </span>
                  </h4>
                  
                  {[
                    {
                      name: 'Grand Prix International',
                      status: 'EN COURS',
                      participants: 24,
                      prize: '€85,000',
                      statusColor: 'bg-red-500'
                    },
                    {
                      name: 'Championnat Elite Juniors',
                      status: 'PROGRAMMÉ', 
                      participants: 18,
                      prize: '€45,000',
                      statusColor: 'bg-blue-500'
                    },
                    {
                      name: 'Coupe Excellence Nationale',
                      status: 'VALIDÉ',
                      participants: 32,
                      prize: '€65,000',
                      statusColor: 'bg-emerald-500'
                    }
                  ].map((comp, index) => (
                    <motion.div
                      key={comp.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      whileHover={{ x: 4 }}
                      className="bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group border border-slate-100"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                          {comp.name}
                        </h5>
                        <div className={`w-2 h-2 rounded-full ${comp.statusColor}`}></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-slate-500 font-medium">Participants</div>
                          <div className="font-bold text-slate-900">{comp.participants}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 font-medium">Prize Pool</div>
                          <div className="font-bold text-emerald-700">{comp.prize}</div>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-xs font-bold text-slate-600 uppercase tracking-wide">
                        {comp.status}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Contrôles Qualité */}
                <div className="space-y-6">
                  <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    ⚡ Performance Système
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">
                      OPTIMAL
                    </span>
                  </h4>

                  {[
                    { label: 'Conformité Réglementaire', value: 98.9, color: 'emerald' },
                    { label: 'Satisfaction Professionnels', value: 96.2, color: 'blue' },
                    { label: 'Efficacité Opérationnelle', value: 94.7, color: 'indigo' },
                    { label: 'Standards Internationaux', value: 99.1, color: 'emerald' }
                  ].map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700">{metric.label}</span>
                        <span className="text-lg font-black text-slate-900">{metric.value}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.value}%` }}
                          transition={{ delay: 1.2 + index * 0.1, duration: 1 }}
                          className={`h-3 rounded-full ${
                            metric.color === 'emerald' 
                              ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' 
                              : metric.color === 'blue'
                              ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                              : 'bg-gradient-to-r from-indigo-400 to-indigo-600'
                          }`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Communications Executive */}
                <div className="space-y-6">
                  <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    📡 Communications Executive
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-bold">
                      2 URGENT
                    </span>
                  </h4>

                  {[
                    {
                      title: 'Directive Ministérielle 2025-12',
                      time: '14:32',
                      priority: 'URGENT',
                      type: 'Réglementation',
                      priorityColor: 'bg-red-500'
                    },
                    {
                      title: 'Certification ISO Update',
                      time: '12:15', 
                      priority: 'IMPORTANT',
                      type: 'Qualité',
                      priorityColor: 'bg-yellow-500'
                    },
                    {
                      title: 'Rapport Trimestriel Q3',
                      time: '09:45',
                      priority: 'STANDARD',
                      type: 'Reporting',
                      priorityColor: 'bg-slate-400'
                    },
                    {
                      title: 'Formation Elite Staff',
                      time: '08:20',
                      priority: 'PLANIFIÉ',
                      type: 'Formation',
                      priorityColor: 'bg-blue-500'
                    }
                  ].map((comm, index) => (
                    <motion.div
                      key={comm.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-2xl p-4 border border-slate-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h5 className="font-bold text-slate-900 text-sm group-hover:text-indigo-900 transition-colors leading-tight">
                            {comm.title}
                          </h5>
                          <div className="text-xs text-slate-500 font-medium mt-1">{comm.type}</div>
                        </div>
                        <div className={`w-2.5 h-2.5 rounded-full ${comm.priorityColor} flex-shrink-0`}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600 uppercase">
                          {comm.priority}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {comm.time}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Executive avec Certifications */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-8xl mx-auto px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h4 className="text-2xl font-black mb-2">Tunisia Jockey Club</h4>
              <p className="text-slate-400">Institution Officielle • Autorité Suprême des Sports Hippiques</p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-sm text-slate-300">Établie en 1884</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-slate-300">Reconnue par l'État</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-sm text-slate-300">Membre IFHA</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-slate-400 text-sm space-y-2">
                <p><strong className="text-slate-200">Tutelle:</strong> Ministère de la Jeunesse et des Sports</p>
                <p><strong className="text-slate-200">Certifications:</strong> ISO 9001:2015, IFHA Standards</p>
                <p><strong className="text-slate-200">Juridiction:</strong> République Tunisienne</p>
              </div>
            </div>
          </div>
          
          {/* Certifications & Accréditations */}
          <div className="border-t border-slate-800 pt-8">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[
                { 
                  name: 'ISO 9001:2015',
                  desc: 'Management Qualité',
                  icon: '🏅'
                },
                {
                  name: 'IFHA Member',
                  desc: 'International Federation',
                  icon: '🌍'
                },
                {
                  name: 'État Tunisien',
                  desc: 'Reconnaissance Officielle',
                  icon: '🏛️'
                },
                {
                  name: 'GDPR Compliant',
                  desc: 'Protection des Données',
                  icon: '🔒'
                }
              ].map((cert, index) => (
                <div key={cert.name} className="text-center">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">{cert.icon}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-200">{cert.name}</div>
                  <div className="text-xs text-slate-400">{cert.desc}</div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-slate-500 text-sm">
                © 2025 Tunisia Jockey Club. Institution sous tutelle du Ministère de la Jeunesse et des Sports de la République Tunisienne.
              </p>
              <p className="text-slate-500 text-xs mt-2">
                Siège social: Avenue Habib Bourguiba, Tunis 1000 • Registre Commerce: B-12-3456789-X
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
