import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  Trophy, 
  TrendingUp, 
  Activity,
  Calendar,
  Star,
  Award,
  Target
} from 'lucide-react';

interface AdvancedDashboardProps {
  data: {
    overview: {
      totalHorses: number;
      totalUsers: number;
      totalRaces: number;
      totalInscriptions: number;
      totalResults: number;
    };
    recentHorses: any[];
    topJockeys: any[];
    upcomingRaces: any[];
    performanceChart: Array<{
      month: string;
      races: number;
      wins: number;
      participation: number;
    }>;
    distributionData: Array<{
      category: string;
      value: number;
      color: string;
    }>;
  };
}

export function AdvancedDashboard({ data }: AdvancedDashboardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const statsCards = [
    { 
      icon: Users, 
      label: 'Chevaux', 
      value: data.overview.totalHorses, 
      color: 'bg-blue-500',
      trend: '+12%'
    },
    { 
      icon: Trophy, 
      label: 'Courses', 
      value: data.overview.totalRaces, 
      color: 'bg-green-500',
      trend: '+8%'
    },
    { 
      icon: Activity, 
      label: 'Inscriptions', 
      value: data.overview.totalInscriptions, 
      color: 'bg-purple-500',
      trend: '+24%'
    },
    { 
      icon: Award, 
      label: 'Résultats', 
      value: data.overview.totalResults, 
      color: 'bg-yellow-500',
      trend: '+16%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.label}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-green-600 font-medium">{card.trend}</p>
              </div>
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Graphiques principaux */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Graphique de performance */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Mensuelle</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.performanceChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="races" fill="#3b82f6" name="Courses" />
              <Bar dataKey="wins" fill="#10b981" name="Victoires" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Distribution des chevaux */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Distribution des Chevaux</h3>
            <Target className="w-5 h-5 text-purple-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.distributionData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ category, value }) => `${category}: ${value}`}
              >
                {data.distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Listes détaillées */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chevaux récents */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Chevaux Récents</h3>
            <Star className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            {data.recentHorses.slice(0, 5).map((horse, index) => (
              <div key={horse.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{horse.name}</p>
                  <p className="text-sm text-gray-600">
                    {horse.sex === 'stallion' ? 'Étalon' : 'Jument'} • {horse.color}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(horse.birth_date).getFullYear()}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top jockeys */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Jockeys</h3>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            {data.topJockeys.slice(0, 5).map((jockey, index) => (
              <div key={jockey.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{jockey.full_name}</p>
                  <p className="text-sm text-gray-600">Jockey</p>
                </div>
                <div className="text-sm font-medium text-green-600">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Courses à venir */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.9 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Courses à Venir</h3>
            <Calendar className="w-5 h-5 text-purple-500" />
          </div>
          <div className="space-y-3">
            {data.upcomingRaces.slice(0, 5).map((race, index) => (
              <div key={race.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{race.name}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(race.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="text-sm font-medium text-yellow-600">
                  {race.prize} DT
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Graphique de tendance */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Taux de Participation</h3>
          <Activity className="w-5 h-5 text-indigo-500" />
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data.performanceChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="participation" 
              stroke="#6366f1" 
              strokeWidth={2}
              dot={{ fill: '#6366f1', strokeWidth: 2 }}
              name="Taux de Participation (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

export default AdvancedDashboard;
