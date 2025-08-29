import { motion } from "framer-motion";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { 
  TrendingUp, 
  Users, 
  Trophy, 
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  BarChart3,
  Eye,
  PlusCircle,
  Zap,
  ArrowRight,
  Activity,
  Palette
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "~/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { PerformanceBadge } from "~/shared/components/PerformanceBadge";
import { HorseAvatar } from "~/shared/components/OptimizedImage";
import { headers } from "~/shared/security/headers";
import { usePerformanceMonitor } from "~/shared/hooks/usePerformance";
import { useRaces } from "~/shared/services/raceService";

// Export security headers
export { headers };

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    // Récupérer les vraies données depuis l'API backend
    const baseUrl = 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/dashboard/data`;
    
    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    
    const apiData = await res.json();
    
    return json({
      overview: apiData.overview || {},
      recentHorses: apiData.recentHorses || [],
      upcomingRaces: apiData.upcomingRaces || [],
      topJockeys: apiData.topJockeys || [],
      performanceChart: apiData.performanceChart || [],
      meta: apiData.meta || {},
    });
  } catch (error) {
    console.error('Erreur lors du chargement du dashboard:', error);
    
    // Données de fallback en cas d'erreur
    return json({
      overview: {
        totalHorses: 45,
        totalUsers: 23,
        totalRaces: 8,
        totalJockeys: 15
      },
      recentHorses: [],
      upcomingRaces: [],
      topJockeys: [],
      performanceChart: [],
      meta: { source: 'fallback' },
      error: 'Utilisation des données de démonstration'
    });
  }
};

export default function DashboardMain() {
  const { overview, recentHorses, upcomingRaces, topJockeys, meta } = useLoaderData<typeof loader>();

  // Stats dynamiques basées sur les vraies données
  const statsCards = [
    { 
      title: "Courses Total", 
      value: overview.totalRaces?.toString() || "0", 
      icon: Calendar, 
      color: "text-blue-600" 
    },
    { 
      title: "Jockeys Actifs", 
      value: overview.totalJockeys?.toString() || "0", 
      icon: Users, 
      color: "text-green-600" 
    },
    { 
      title: "Chevaux Inscrits", 
      value: overview.totalHorses?.toString() || "0", 
      icon: Trophy, 
      color: "text-yellow-600" 
    },
    { 
      title: "Utilisateurs", 
      value: overview.totalUsers?.toString() || "0", 
      icon: Eye, 
      color: "text-purple-600" 
    }
  ];

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
          🏇 Tunisia Jockey Club
        </h1>
        <p className="text-slate-600">Tableau de bord des courses hippiques</p>
        {meta?.source && (
          <p className="text-xs text-slate-500">Source : {meta.source}</p>
        )}
      </motion.div>

      {/* Stats Cards - Maintenant dynamiques */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-10 w-10 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Prochaines Courses */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Prochaines Courses
                </CardTitle>
                <CardDescription>Courses programmées aujourd'hui</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard/races/advanced"
                  className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors text-sm font-medium"
                >
                  <BarChart3 className="h-4 w-4" />
                  Gestion Avancée
                </Link>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter une nouvelle course</DialogTitle>
                      <DialogDescription>
                        Créez une nouvelle course hippique avec les détails nécessaires.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nom de la course</label>
                        <input 
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="Ex: Prix de Carthage"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Heure</label>
                          <input 
                            type="time" 
                            className="w-full px-3 py-2 border rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Distance</label>
                          <input 
                            type="number" 
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="1600"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Annuler</Button>
                      <Button>Créer la course</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "14:30", name: "Prix de Carthage", distance: "1600m", participants: 12, status: "Confirmé" },
                  { time: "15:15", name: "Prix des Jasmins", distance: "2000m", participants: 8, status: "Inscriptions" },
                  { time: "16:00", name: "Grand Prix de Tunis", distance: "2400m", participants: 15, status: "Confirmé" }
                ].map((race, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Clock className="h-4 w-4" />
                        {race.time}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{race.name}</p>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {race.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {race.participants} chevaux
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={race.status === "Confirmé" ? "default" : "secondary"}>
                      {race.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistiques */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Performances du Mois
              </CardTitle>
              <CardDescription>Évolution des statistiques</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { label: "Nombre de courses", current: 89, previous: 76, trend: "+17%" },
                  { label: "Participation", current: 1245, previous: 1156, trend: "+8%" },
                  { label: "Revenus", current: 485600, previous: 423200, trend: "+15%" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm text-slate-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {stat.label === "Revenus" ? `${(stat.current / 1000).toFixed(0)}k DT` : stat.current}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">{stat.trend}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Accès Rapide aux Fonctionnalités Avancées */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mb-8"
      >
        <Card className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Accès Rapide - Fonctionnalités Avancées
            </CardTitle>
            <CardDescription>
              Accédez rapidement à toutes les nouvelles fonctionnalités du tableau de bord
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tournois */}
              <Link 
                to="/dashboard/tournaments" 
                className="group block p-4 border rounded-lg hover:shadow-lg transition-all duration-200 hover:border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-blue-900">Tournois</h3>
                </div>
                <p className="text-sm text-blue-700">
                  Gérez les tournois, classements et prix
                </p>
                <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                  <ArrowRight className="h-3 w-3" />
                  Voir les détails
                </div>
              </Link>

              {/* Analytics */}
              <Link 
                to="/dashboard/analytics" 
                className="group block p-4 border rounded-lg hover:shadow-lg transition-all duration-200 hover:border-green-300 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-150"
              >
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="h-6 w-6 text-green-600 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-green-900">Analytics</h3>
                </div>
                <p className="text-sm text-green-700">
                  Analyses avancées et visualisations
                </p>
                <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <ArrowRight className="h-3 w-3" />
                  Voir les stats
                </div>
              </Link>

              {/* Performance */}
              <Link 
                to="/dashboard/performance" 
                className="group block p-4 border rounded-lg hover:shadow-lg transition-all duration-200 hover:border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-150"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-purple-900">Performance</h3>
                </div>
                <p className="text-sm text-purple-700">
                  Monitoring système en temps réel
                </p>
                <div className="mt-2 text-xs text-purple-600 flex items-center gap-1">
                  <ArrowRight className="h-3 w-3" />
                  Voir les métriques
                </div>
              </Link>

              {/* Customization */}
              <Link 
                to="/dashboard/customization" 
                className="group block p-4 border rounded-lg hover:shadow-lg transition-all duration-200 hover:border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-150"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Palette className="h-6 w-6 text-orange-600 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-orange-900">Thèmes</h3>
                </div>
                <p className="text-sm text-orange-700">
                  Personnalisez l'apparence du site
                </p>
                <div className="mt-2 text-xs text-orange-600 flex items-center gap-1">
                  <ArrowRight className="h-3 w-3" />
                  Personnaliser
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tableau des Résultats */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg">
          <CardHeader>
            <CardTitle>Derniers Résultats</CardTitle>
            <CardDescription>Résultats des courses récentes</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Gagnant</TableHead>
                  <TableHead>Jockey</TableHead>
                  <TableHead>Temps</TableHead>
                  <TableHead>Cote</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { race: "Prix de Carthage", winner: "Thunder Bolt", jockey: "Ahmed Ben Ali", time: "1:42.35", odds: "3.2", status: "Terminé" },
                  { race: "Prix des Oliviers", winner: "Desert Wind", jockey: "Sami Gharbi", time: "1:58.12", odds: "5.8", status: "Terminé" },
                  { race: "Prix de Sidi Bou Said", winner: "Golden Arrow", jockey: "Karim Mansouri", time: "2:15.89", odds: "2.1", status: "Terminé" },
                  { race: "Prix des Jasmins", winner: "Lightning Strike", jockey: "Omar Trabelsi", time: "1:45.67", odds: "4.5", status: "En cours" }
                ].map((result, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{result.race}</TableCell>
                    <TableCell>{result.winner}</TableCell>
                    <TableCell>{result.jockey}</TableCell>
                    <TableCell>{result.time}</TableCell>
                    <TableCell>{result.odds}:1</TableCell>
                    <TableCell>
                      <Badge variant={result.status === "Terminé" ? "default" : "secondary"}>
                        {result.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
