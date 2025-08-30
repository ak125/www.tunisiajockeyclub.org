import { motion } from 'framer-motion';
import { Trophy, Users, TrendingUp, Activity } from 'lucide-react';

interface StatsData {
  totalRaces: number;
  activeHorses: number;
  registeredJockeys: number;
  upcomingEvents: number;
}

interface StatsSectionProps {
  stats: StatsData;
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const statItems = [
    {
      icon: Trophy,
      value: stats.totalRaces,
      label: 'Courses Total',
      description: 'Courses organisées cette saison',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      icon: Activity,
      value: stats.activeHorses,
      label: 'Chevaux Actifs',
      description: 'Chevaux en compétition',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      icon: Users,
      value: stats.registeredJockeys,
      label: 'Jockeys Enregistrés',
      description: 'Jockeys professionnels',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      icon: TrendingUp,
      value: stats.upcomingEvents,
      label: 'Événements À Venir',
      description: 'Prochaines courses programmées',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    }
  ];

  return (
    <section 
      className="py-12 bg-gray-50"
      aria-labelledby="dashboard-stats"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 
            id="dashboard-stats" 
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Statistiques du Club
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Aperçu des activités et performances du Tunisia Jockey Club
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100 
              }}
              whileHover={{ 
                scale: 1.02, 
                transition: { duration: 0.2 } 
              }}
              className={`
                ${stat.bgColor} ${stat.borderColor}
                border rounded-xl p-6 text-center 
                shadow-sm hover:shadow-md transition-all duration-300
                cursor-pointer
              `}
              role="article"
              aria-labelledby={`stat-${index}-title`}
              aria-describedby={`stat-${index}-desc`}
            >
              <div className="flex justify-center mb-4">
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-full border-2 ${stat.borderColor}`}>
                  <stat.icon 
                    className="w-8 h-8" 
                    aria-hidden="true"
                  />
                </div>
              </div>
              
              <motion.p 
                className="text-3xl font-bold text-gray-900 mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: (index * 0.1) + 0.3, type: "spring" }}
              >
                {stat.value.toLocaleString()}
              </motion.p>
              
              <h3 
                id={`stat-${index}-title`}
                className="text-lg font-semibold text-gray-800 mb-1"
              >
                {stat.label}
              </h3>
              
              <p 
                id={`stat-${index}-desc`}
                className="text-sm text-gray-600"
              >
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Indicateur de mise à jour */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <Activity className="w-4 h-4 text-green-500" aria-hidden="true" />
            Données mises à jour en temps réel
          </p>
        </motion.div>
      </div>
    </section>
  );
}
