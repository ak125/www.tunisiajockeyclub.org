import { motion } from "framer-motion";
import { 
  Clock, 
  MapPin, 
  Users, 
  Trophy, 
  TrendingUp,
  Star,
  Timer,
  Target
} from "lucide-react";
import { cn } from "../../lib/utils";

export interface RaceData {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  distance: string;
  surface: "turf" | "dirt" | "synthetic";
  category: string;
  prize: string;
  participants: number;
  status: "upcoming" | "live" | "finished";
  weather?: string;
  temperature?: string;
}

export interface HorsePerformance {
  id: string;
  name: string;
  jockey: string;
  trainer: string;
  age: number;
  weight: string;
  odds: string;
  position?: number;
  time?: string;
  rating: number;
  recentForm: string[];
  silkColors: string[];
}

interface RaceCardProps {
  race: RaceData;
  horses?: HorsePerformance[];
  variant?: "compact" | "detailed";
  showWeather?: boolean;
}

export function RaceCard({ 
  race, 
  horses = [], 
  variant = "detailed", 
  showWeather = true 
}: RaceCardProps) {
  const getSurfaceColor = (surface: RaceData["surface"]) => {
    switch (surface) {
      case "turf": return "text-turf-green-600 bg-turf-green-100";
      case "dirt": return "text-amber-600 bg-amber-100";
      case "synthetic": return "text-purple-600 bg-purple-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status: RaceData["status"]) => {
    switch (status) {
      case "live": return "text-red-600 bg-red-100 animate-pulse";
      case "finished": return "text-gray-600 bg-gray-100";
      default: return "text-turf-green-600 bg-turf-green-100";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg"
    >
      {/* En-tête de course */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{race.name}</h3>
            <span className={cn(
              "rounded-full px-2 py-1 text-xs font-medium",
              getStatusColor(race.status)
            )}>
              {race.status === "live" ? "🔴 EN DIRECT" : 
               race.status === "finished" ? "✅ TERMINÉ" : "⏳ À VENIR"}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{race.date} • {race.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{race.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>{race.distance}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-racing-gold-600">
            {race.prize}
          </div>
          <div className="text-sm text-gray-600">{race.category}</div>
        </div>
      </div>

      {/* Informations détaillées */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className={cn(
          "rounded-lg px-3 py-1 text-sm font-medium",
          getSurfaceColor(race.surface)
        )}>
          🏁 {race.surface === "turf" ? "Gazon" : 
               race.surface === "dirt" ? "Terre" : "Synthétique"}
        </span>
        
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{race.participants} partants</span>
        </div>

        {showWeather && race.weather && (
          <div className="text-sm text-gray-600">
            🌤️ {race.weather} • {race.temperature}
          </div>
        )}
      </div>

      {/* Liste des chevaux */}
      {variant === "detailed" && horses.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Partants ({horses.length})
          </h4>
          
          <div className="grid gap-2 max-h-64 overflow-y-auto">
            {horses.slice(0, 8).map((horse, index) => (
              <motion.div
                key={horse.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-700">#{index + 1}</span>
                      {horse.position && horse.position <= 3 && (
                        <span className="text-lg">
                          {horse.position === 1 ? "🥇" : 
                           horse.position === 2 ? "🥈" : "🥉"}
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <div className="font-semibold text-gray-900">{horse.name}</div>
                      <div className="text-sm text-gray-600">
                        👤 {horse.jockey} • 🎯 {horse.trainer}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-racing-gold-600">
                        {horse.odds}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-sm font-medium">{horse.rating}</span>
                      </div>
                    </div>
                    {horse.time && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Timer className="h-3 w-3" />
                        {horse.time}
                      </div>
                    )}
                  </div>
                </div>

                {/* Forme récente */}
                {horse.recentForm.length > 0 && (
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-xs text-gray-500">Forme:</span>
                    <div className="flex gap-1">
                      {horse.recentForm.slice(0, 5).map((result, i) => (
                        <span
                          key={i}
                          className={cn(
                            "text-xs font-bold px-1 rounded",
                            result === "1" ? "bg-green-100 text-green-800" :
                            result === "2" ? "bg-yellow-100 text-yellow-800" :
                            result === "3" ? "bg-orange-100 text-orange-800" :
                            "bg-gray-100 text-gray-600"
                          )}
                        >
                          {result}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
            
            {horses.length > 8 && (
              <div className="text-center py-2">
                <button className="text-sm text-turf-green-600 hover:text-turf-green-700 font-medium">
                  Voir tous les {horses.length} partants
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {race.status === "upcoming" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-lg bg-turf-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-turf-green-700 transition-colors"
            >
              📊 Analyser
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            📋 Détails
          </motion.button>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-500">
          <TrendingUp className="h-4 w-4" />
          <span>Mise à jour il y a 2 min</span>
        </div>
      </div>
    </motion.div>
  );
}
