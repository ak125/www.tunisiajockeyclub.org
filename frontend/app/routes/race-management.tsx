import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  MapPin,
  Clock,
  Users,
  Trophy,
  Search,
  Filter,
  Download
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "~/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

export default function RaceManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const races = [
    { id: 1, name: "Prix de Carthage", date: "2024-01-15", time: "14:30", distance: "1600m", participants: 12, status: "Confirmé", prize: "50,000 DT" },
    { id: 2, name: "Prix des Jasmins", date: "2024-01-15", time: "15:15", distance: "2000m", participants: 8, status: "Inscriptions", prize: "35,000 DT" },
    { id: 3, name: "Grand Prix de Tunis", date: "2024-01-15", time: "16:00", distance: "2400m", participants: 15, status: "Confirmé", prize: "100,000 DT" },
    { id: 4, name: "Prix des Oliviers", date: "2024-01-16", time: "14:00", distance: "1800m", participants: 10, status: "Planifié", prize: "40,000 DT" },
    { id: 5, name: "Prix de Sidi Bou Said", date: "2024-01-16", time: "15:30", distance: "1400m", participants: 14, status: "Inscriptions", prize: "60,000 DT" }
  ];

  const filteredRaces = races.filter(race => {
    const matchesSearch = race.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || race.status === statusFilter;
    return matchesSearch && matchesStatus;
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              🏇 Gestion des Courses
            </h1>
            <p className="text-slate-600">Planifiez et gérez les courses hippiques</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle course</DialogTitle>
                <DialogDescription>
                  Ajoutez les détails de la nouvelle course hippique.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                <div className="space-y-2">
                  <Label htmlFor="raceName">Nom de la course</Label>
                  <Input id="raceName" placeholder="Ex: Prix de Carthage" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prize">Prix total</Label>
                  <Input id="prize" placeholder="50,000 DT" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Heure</Label>
                  <Input id="time" type="time" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la distance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1200">1200m</SelectItem>
                      <SelectItem value="1400">1400m</SelectItem>
                      <SelectItem value="1600">1600m</SelectItem>
                      <SelectItem value="1800">1800m</SelectItem>
                      <SelectItem value="2000">2000m</SelectItem>
                      <SelectItem value="2400">2400m</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="groupe1">Groupe I</SelectItem>
                      <SelectItem value="groupe2">Groupe II</SelectItem>
                      <SelectItem value="groupe3">Groupe III</SelectItem>
                      <SelectItem value="handicap">Handicap</SelectItem>
                      <SelectItem value="maiden">Maiden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Participants max</Label>
                  <Input id="maxParticipants" type="number" placeholder="16" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="track">Piste</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la piste" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Piste principale</SelectItem>
                      <SelectItem value="training">Piste d'entraînement</SelectItem>
                      <SelectItem value="grass">Piste en herbe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline">Annuler</Button>
                <Button className="bg-blue-600 hover:bg-blue-700">Créer la course</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <Card className="bg-white/70 backdrop-blur-sm border border-white/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 items-center flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher une course..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-600" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les status</SelectItem>
                      <SelectItem value="Confirmé">Confirmé</SelectItem>
                      <SelectItem value="Inscriptions">Inscriptions</SelectItem>
                      <SelectItem value="Planifié">Planifié</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Race Stats */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        {[
          { title: "Total Courses", value: races.length.toString(), icon: Trophy, color: "text-blue-600" },
          { title: "Confirmées", value: races.filter(r => r.status === "Confirmé").length.toString(), icon: Calendar, color: "text-green-600" },
          { title: "En Inscription", value: races.filter(r => r.status === "Inscriptions").length.toString(), icon: Users, color: "text-yellow-600" },
          { title: "Prix Total", value: "285,000 DT", icon: Trophy, color: "text-purple-600" }
        ].map((stat, index) => (
          <Card key={stat.title} className="bg-white/70 backdrop-blur-sm border border-white/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Race Table */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg">
          <CardHeader>
            <CardTitle>Liste des Courses</CardTitle>
            <CardDescription>
              Gérez toutes vos courses hippiques en un seul endroit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Date & Heure</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRaces.map((race, index) => (
                  <motion.tr
                    key={race.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-slate-50/50"
                  >
                    <TableCell className="font-medium">{race.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {race.date}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-slate-600">
                          <Clock className="h-3 w-3" />
                          {race.time}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {race.distance}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {race.participants}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-green-600">{race.prize}</TableCell>
                    <TableCell>
                      <Badge variant={
                        race.status === "Confirmé" ? "default" : 
                        race.status === "Inscriptions" ? "secondary" : 
                        "outline"
                      }>
                        {race.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
