import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Trophy, Horse, Users, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardsProps {
  stats: {
    totalRaces: number;
    activeHorses: number;
    totalUsers: number;
    revenue: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Courses Totales",
      value: stats.totalRaces.toLocaleString(),
      change: "+12%",
      trend: "up" as const,
      icon: Trophy,
      color: "text-blue-600"
    },
    {
      title: "Chevaux Actifs",
      value: stats.activeHorses.toLocaleString(),
      change: "+5%",
      trend: "up" as const,
      icon: Horse,
      color: "text-purple-600"
    },
    {
      title: "Utilisateurs",
      value: stats.totalUsers.toLocaleString(),
      change: "+18%",
      trend: "up" as const,
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Revenus (TND)",
      value: stats.revenue.toLocaleString(),
      change: "+23%",
      trend: "up" as const,
      icon: DollarSign,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="flex items-center space-x-1 text-sm">
                {card.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <Badge variant={card.trend === "up" ? "default" : "destructive"}>
                  {card.change}
                </Badge>
                <span className="text-muted-foreground">par rapport au mois dernier</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
