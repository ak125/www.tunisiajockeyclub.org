import { motion } from "framer-motion";
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
  PlusCircle
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

export default function DashboardMain() {
  const performanceData = usePerformanceMonitor('dashboard-main');
  const { data: recentRaces, isLoading: racesLoading } = useRaces({ 
    recent: true, 
    limit: 5 
  });
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
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {[
          { title: "Courses Aujourd'hui", value: "12", icon: Calendar, color: "text-blue-600" },
          { title: "Jockeys Actifs", value: "89", icon: Users, color: "text-green-600" },
          { title: "Prix Total", value: "245,000 DT", icon: DollarSign, color: "text-yellow-600" },
          { title: "Spectateurs", value: "1,543", icon: Eye, color: "text-purple-600" }
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
