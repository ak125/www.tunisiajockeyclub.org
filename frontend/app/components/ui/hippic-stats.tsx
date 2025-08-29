import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Trophy,
  Target,
  Clock,
  BarChart3,
  Users,
  Star,
  Crown,
  Zap
} from "lucide-react";
import { cn } from "../../lib/utils";

export interface StatCard {
  id: string;
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease" | "neutral";
    timeframe?: string;
  };
  icon?: React.ComponentType<{ className?: string }>;
  color?: "turf" | "gold" | "blue" | "purple" | "red";
  description?: string;
  trend?: number[];
}

interface HippicStatsGridProps {
  stats: StatCard[];
  columns?: 2 | 3 | 4;
  showTrends?: boolean;
}

export function HippicStatsGrid({ 
  stats, 
  columns = 4, 
  showTrends = false 
}: HippicStatsGridProps) {
  const getColorClasses = (color: StatCard["color"]) => {
    switch (color) {
      case "turf": return {
        background: "bg-gradient-to-br from-turf-green-50 to-turf-green-100",
        border: "border-turf-green-200",
        icon: "text-turf-green-600",
        accent: "text-turf-green-700"
      };
      case "gold": return {
        background: "bg-gradient-to-br from-racing-gold-50 to-yellow-100",
        border: "border-racing-gold-200",
        icon: "text-racing-gold-600",
        accent: "text-racing-gold-700"
      };
      case "blue": return {
        background: "bg-gradient-to-br from-blue-50 to-blue-100",
        border: "border-blue-200",
        icon: "text-blue-600",
        accent: "text-blue-700"
      };
      case "purple": return {
        background: "bg-gradient-to-br from-purple-50 to-purple-100",
        border: "border-purple-200",
        icon: "text-purple-600",
        accent: "text-purple-700"
      };
      case "red": return {
        background: "bg-gradient-to-br from-red-50 to-red-100",
        border: "border-red-200",
        icon: "text-red-600",
        accent: "text-red-700"
      };
      default: return {
        background: "bg-gradient-to-br from-gray-50 to-gray-100",
        border: "border-gray-200",
        icon: "text-gray-600",
        accent: "text-gray-700"
      };
    }
  };

  const getTrendIcon = (type?: "increase" | "decrease" | "neutral") => {
    switch (type) {
      case "increase": return TrendingUp;
      case "decrease": return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = (type?: "increase" | "decrease" | "neutral") => {
    switch (type) {
      case "increase": return "text-green-600 bg-green-100";
      case "decrease": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className={cn(
      "grid gap-6",
      `grid-cols-1 md:grid-cols-2 xl:grid-cols-${columns}`
    )}>
      {stats.map((stat, index) => {
        const colorClasses = getColorClasses(stat.color);
        const Icon = stat.icon || BarChart3;
        const TrendIcon = stat.change ? getTrendIcon(stat.change.type) : null;

        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2, scale: 1.02 }}
            className={cn(
              "relative rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md",
              colorClasses.background,
              colorClasses.border
            )}
          >
            {/* En-tête avec icône */}
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "rounded-xl p-3 shadow-sm",
                "bg-white/80 backdrop-blur-sm"
              )}>
                <Icon className={cn("h-6 w-6", colorClasses.icon)} />
              </div>

              {stat.change && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium",
                    getTrendColor(stat.change.type)
                  )}
                >
                  {TrendIcon && <TrendIcon className="h-3 w-3" />}
                  <span>
                    {stat.change.type === "increase" ? "+" : stat.change.type === "decrease" ? "-" : ""}
                    {Math.abs(stat.change.value)}%
                  </span>
                </motion.div>
              )}
            </div>

            {/* Valeur principale */}
            <div className="mb-2">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.1 }}
                className={cn("text-3xl font-bold", colorClasses.accent)}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm font-medium text-gray-700 mt-1">
                {stat.label}
              </div>
            </div>

            {/* Description */}
            {stat.description && (
              <p className="text-xs text-gray-600 mb-3">
                {stat.description}
              </p>
            )}

            {/* Mini graphique de tendance */}
            {showTrends && stat.trend && (
              <div className="mt-4 h-12 relative">
                <div className="absolute inset-0 flex items-end justify-between">
                  {stat.trend.map((value, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${stat.trend ? (value / Math.max(...stat.trend)) * 100 : 0}%` }}
                      transition={{ delay: index * 0.1 + i * 0.05 }}
                      className={cn(
                        "w-2 rounded-t-sm",
                        colorClasses.accent === "text-turf-green-700" 
                          ? "bg-turf-green-400" 
                          : "bg-racing-gold-400"
                      )}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Période de changement */}
            {stat.change?.timeframe && (
              <div className="mt-3 text-xs text-gray-500">
                {stat.change.timeframe}
              </div>
            )}

            {/* Effet de brillance sur hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </motion.div>
        );
      })}
    </div>
  );
}

// Stats prédéfinies pour le jockey club
export const defaultHippicStats: StatCard[] = [
  {
    id: "total-races",
    label: "Courses totales",
    value: 247,
    change: { value: 12, type: "increase", timeframe: "ce mois" },
    icon: Trophy,
    color: "turf",
    description: "Courses organisées cette saison",
    trend: [45, 52, 38, 61, 49, 72, 67, 84, 79, 91, 88, 95]
  },
  {
    id: "active-horses",
    label: "Chevaux actifs",
    value: 156,
    change: { value: 8, type: "increase", timeframe: "cette semaine" },
    icon: Crown,
    color: "gold",
    description: "Chevaux en compétition",
    trend: [120, 125, 132, 128, 145, 150, 148, 156]
  },
  {
    id: "total-prize",
    label: "Prix distribués",
    value: "€2.8M",
    change: { value: 15, type: "increase", timeframe: "vs l'an dernier" },
    icon: Star,
    color: "blue",
    description: "Montant total des gains",
    trend: [1.2, 1.5, 1.8, 2.1, 2.3, 2.5, 2.7, 2.8]
  },
  {
    id: "avg-rating",
    label: "Rating moyen",
    value: 78.5,
    change: { value: 3, type: "increase", timeframe: "ce trimestre" },
    icon: Target,
    color: "purple",
    description: "Performance moyenne des chevaux",
    trend: [74, 75, 76, 77, 78, 78.5]
  },
  {
    id: "participation",
    label: "Participation",
    value: "94%",
    change: { value: 2, type: "decrease", timeframe: "ce mois" },
    icon: Users,
    color: "red",
    description: "Taux de participation aux courses"
  },
  {
    id: "record-time",
    label: "Record du jour",
    value: "1:23.45",
    icon: Clock,
    color: "gold",
    description: "Meilleur temps sur 1400m"
  }
];

interface LiveUpdateProps {
  updates: Array<{
    id: string;
    type: "race_start" | "race_finish" | "new_record" | "weather";
    message: string;
    timestamp: string;
    severity: "info" | "success" | "warning";
  }>;
}

export function LiveUpdates({ updates }: LiveUpdateProps) {
  const getSeverityStyle = (severity: LiveUpdateProps["updates"][0]["severity"]) => {
    switch (severity) {
      case "success": return "border-l-green-500 bg-green-50";
      case "warning": return "border-l-yellow-500 bg-yellow-50";
      default: return "border-l-blue-500 bg-blue-50";
    }
  };

  const getIcon = (type: LiveUpdateProps["updates"][0]["type"]) => {
    switch (type) {
      case "race_start": return "🏁";
      case "race_finish": return "🏆";
      case "new_record": return "⚡";
      case "weather": return "🌤️";
      default: return "ℹ️";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-yellow-500" />
        <h3 className="font-semibold text-gray-900">Mises à jour en direct</h3>
      </div>

      {updates.map((update, index) => (
        <motion.div
          key={update.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            "border-l-4 p-4 rounded-r-lg shadow-sm",
            getSeverityStyle(update.severity)
          )}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg">{getIcon(update.type)}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {update.message}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {update.timestamp}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
