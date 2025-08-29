import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Trophy,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Mock data pour les statistiques
  const monthlyRevenue = [
    { month: "Jan", revenue: 45000, races: 12 },
    { month: "Fév", revenue: 52000, races: 14 },
    { month: "Mar", revenue: 48000, races: 13 },
    { month: "Avr", revenue: 61000, races: 16 },
    { month: "Mai", revenue: 55000, races: 15 },
    { month: "Jun", revenue: 67000, races: 18 },
    { month: "Jul", revenue: 72000, races: 19 },
    { month: "Aoû", revenue: 58000, races: 16 }
  ];

  const raceTypes = [
    { name: "Galop", value: 45, color: "#3B82F6" },
    { name: "Trot", value: 25, color: "#10B981" },
    { name: "Obstacle", value: 20, color: "#F59E0B" },
    { name: "Cross", value: 10, color: "#EF4444" }
  ];

  const dailyStats = [
    { day: "Lun", visitors: 420, races: 12 },
    { day: "Mar", visitors: 380, races: 8 },
    { day: "Mer", visitors: 450, races: 15 },
    { day: "Jeu", visitors: 520, races: 18 },
    { day: "Ven", visitors: 680, races: 22 },
    { day: "Sam", visitors: 850, races: 28 },
    { day: "Dim", visitors: 720, races: 20 }
  ];

  const topHorses = [
    { name: "Thunder Bolt", wins: 12, earnings: 45000, winRate: 75 },
    { name: "Desert Wind", wins: 9, earnings: 38000, winRate: 64 },
    { name: "Golden Arrow", wins: 8, earnings: 33000, winRate: 62 },
    { name: "Lightning Strike", wins: 7, earnings: 29000, winRate: 58 },
    { name: "Storm Runner", wins: 6, earnings: 25000, winRate: 55 }
  ];

  return json({ monthlyRevenue, raceTypes, dailyStats, topHorses });
};

export default function Statistics() {
  const { monthlyRevenue, raceTypes, dailyStats, topHorses } = useLoaderData<typeof loader>();

  const totalRevenue = monthlyRevenue.reduce((acc, month) => acc + month.revenue, 0);
  const avgRacesPerMonth = monthlyRevenue.reduce((acc, month) => acc + month.races, 0) / monthlyRevenue.length;
  const lastMonthRevenue = monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0;
  const previousMonthRevenue = monthlyRevenue[monthlyRevenue.length - 2]?.revenue || 0;
  const revenueChange = ((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-slate-800 mb-2">
          📊 Statistiques & Analytics
        </h1>
        <p className="text-slate-600">Tableau de bord des performances du club</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {[
          {
            title: "Revenus Total",
            value: `${(totalRevenue / 1000).toFixed(0)}k DT`,
            change: `+${revenueChange}%`,
            icon: DollarSign,
            color: "text-green-600",
            bgColor: "bg-green-100",
            trend: "up"
          },
          {
            title: "Courses/Mois",
            value: avgRacesPerMonth.toFixed(1),
            change: "+5.2%",
            icon: Trophy,
            color: "text-blue-600",
            bgColor: "bg-blue-100", 
            trend: "up"
          },
          {
            title: "Visiteurs Moyens",
            value: Math.round(dailyStats.reduce((acc, day) => acc + day.visitors, 0) / dailyStats.length).toLocaleString(),
            change: "+12.3%",
            icon: Users,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
            trend: "up"
          },
          {
            title: "Courses/Jour",
            value: Math.round(dailyStats.reduce((acc, day) => acc + day.races, 0) / dailyStats.length).toString(),
            change: "-2.1%",
            icon: Activity,
            color: "text-orange-600",
            bgColor: "bg-orange-100",
            trend: "down"
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Évolution des Revenus
              </CardTitle>
              <CardDescription>Revenus mensuels en dinars tunisiens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Race Types Distribution */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-green-600" />
                Types de Courses
              </CardTitle>
              <CardDescription>Répartition par discipline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center">
                <ResponsiveContainer width="70%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={raceTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {raceTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="w-30% space-y-3">
                  {raceTypes.map((type, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: type.color }}
                      />
                      <div>
                        <p className="font-medium text-slate-800">{type.name}</p>
                        <p className="text-sm text-slate-600">{type.value}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Activité Hebdomadaire
              </CardTitle>
              <CardDescription>Visiteurs et courses par jour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="visitors" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="races" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Horses */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Top Chevaux Performers
              </CardTitle>
              <CardDescription>Classement par nombre de victoires</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topHorses.map((horse, index) => (
                  <motion.div
                    key={horse.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-500' : 'bg-slate-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{horse.name}</p>
                        <p className="text-sm text-slate-600">{horse.wins} victoires</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{horse.earnings.toLocaleString()} DT</p>
                      <Badge variant={horse.winRate > 70 ? "default" : "secondary"}>
                        {horse.winRate}% victoires
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
