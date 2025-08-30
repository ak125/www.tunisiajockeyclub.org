import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Trophy, Calendar, MapPin, Users, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface Race {
  id: string;
  name: string;
  date: string;
  status: 'upcoming' | 'live' | 'finished';
}

interface RecentRacesProps {
  races: Race[];
}

export function RecentRaces({ races }: RecentRacesProps) {
  const getStatusColor = (status: Race['status']) => {
    switch (status) {
      case 'live':
        return 'bg-red-500 text-white';
      case 'upcoming':
        return 'bg-blue-500 text-white';
      case 'finished':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: Race['status']) => {
    switch (status) {
      case 'live':
        return 'En Direct';
      case 'upcoming':
        return 'À venir';
      case 'finished':
        return 'Terminée';
      default:
        return 'Inconnu';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Courses Récentes</CardTitle>
        <Trophy className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        {races.map((race, index) => (
          <motion.div
            key={race.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 rounded-lg border bg-card"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{race.name}</h3>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(race.date).toLocaleDateString('fr-FR')}</span>
                  <MapPin className="w-3 h-3 ml-2" />
                  <span>Kassar Saïd</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">12 participants</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Badge className={getStatusColor(race.status)}>
                {getStatusLabel(race.status)}
              </Badge>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Voir
              </Button>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
