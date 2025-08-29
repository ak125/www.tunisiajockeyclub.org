import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { 
  ArrowLeft,
  Calendar,
  Trophy,
  Users,
  MapPin,
  Clock,
  DollarSign,
  BarChart3,
  TrendingUp,
  Star
} from "lucide-react";

// Types
interface Race {
  id: string;
  name: string;
  date: string;
  location: string;
  distance: number;
  surface: string;
  prize_money: number;
  participants: number;
  status: string;
  category: string;
}

interface RaceStats {
  totalRaces: number;
  totalPrizeMoney: number;
  avgParticipants: number;
  upcomingRaces: number;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Données de démonstration pour les courses avancées
  const races: Race[] = [
    {
      id: "1",
      name: "Grand Prix de Carthage",
      date: "2025-09-15",
      location: "Hippodrome de Carthage",
      distance: 2400,
      surface: "Gazon",
      prize_money: 75000,
      participants: 16,
      status: "Confirmée",
      category: "Groupe I"
    },
    {
      id: "2", 
      name: "Prix de Sidi Bou Said",
      date: "2025-09-22",
      location: "Hippodrome de Sidi Bou Said",
      distance: 1600,
      surface: "Gazon",
      prize_money: 45000,
      participants: 14,
      status: "Inscriptions ouvertes",
      category: "Groupe II"
    },
    {
      id: "3",
      name: "Prix du Sahara",
      date: "2025-09-29",
      location: "Hippodrome de Tozeur",
      distance: 2000,
      surface: "Sable",
      prize_money: 35000,
      participants: 12,
      status: "Planifiée",
      category: "Groupe III"
    },
    {
      id: "4",
      name: "Derby de Tunis",
      date: "2025-10-06",
      location: "Hippodrome de Tunis",
      distance: 2400,
      surface: "Gazon",
      prize_money: 100000,
      participants: 18,
      status: "Confirmée",
      category: "Groupe I"
    }
  ];

  const stats: RaceStats = {
    totalRaces: races.length,
    totalPrizeMoney: races.reduce((sum, race) => sum + race.prize_money, 0),
    avgParticipants: Math.round(races.reduce((sum, race) => sum + race.participants, 0) / races.length),
    upcomingRaces: races.filter(race => race.status !== "Terminée").length
  };

  return json({ races, stats });
};

export default function RacesAdvanced() {
  const { races, stats } = useLoaderData<typeof loader>();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmée": return "bg-green-100 text-green-800";
      case "Inscriptions ouvertes": return "bg-blue-100 text-blue-800";
      case "Planifiée": return "bg-yellow-100 text-yellow-800";
      case "Terminée": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Groupe I": return "bg-purple-100 text-purple-800";
      case "Groupe II": return "bg-blue-100 text-blue-800";
      case "Groupe III": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête avec navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Retour au Dashboard
            </Link>
            <div className="h-6 w-px bg-slate-300" />
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
              <Trophy className="h-8 w-8 text-amber-600" />
              Courses Avancées
            </h1>
          </div>
        </motion.div>

        {/* Statistiques rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Courses</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalRaces}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Prix Total</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {(stats.totalPrizeMoney / 1000).toFixed(0)}k DT
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Moy. Participants</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.avgParticipants}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">À Venir</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.upcomingRaces}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tableau des courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-600" />
                Programme des Courses Avancées
              </CardTitle>
              <CardDescription>
                Vue détaillée des courses avec informations complètes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Lieu</TableHead>
                      <TableHead>Distance</TableHead>
                      <TableHead>Surface</TableHead>
                      <TableHead>Prix</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {races.map((race, index) => (
                      <motion.tr
                        key={race.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="hover:bg-slate-50"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-amber-500" />
                            {race.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-500" />
                            {new Date(race.date).toLocaleDateString('fr-FR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-500" />
                            {race.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          {race.distance}m
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{race.surface}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {race.prize_money.toLocaleString()} DT
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-slate-500" />
                            {race.participants}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor(race.category)}>
                            {race.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(race.status)}>
                            {race.status}
                          </Badge>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex justify-center gap-4"
        >
          <Link to="/dashboard/races">
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Voir Toutes les Courses
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour au Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
