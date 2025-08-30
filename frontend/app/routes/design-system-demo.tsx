import { json, type LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { motion } from "framer-motion"
import { Calendar, Plus, TrendingUp, Trophy, Users } from "lucide-react"

import { HippicButton, BetButton, RegisterButton, VictoryButton } from "~/components/ui/hippic-button"
import { HippicBadge, StatusBadge, RaceBadge, VictoryBadge } from "~/components/ui/hippic-badge"
import { HorseCard, JockeyCard } from "~/components/ui/hippic-cards"
import { HorseCardSkeleton, StatCardSkeleton, HippicLoader } from "~/components/ui/hippic-skeletons"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

// Types pour la démo
interface DemoHorse {
  id: string
  name: string
  age: number
  victories: number
  totalRaces: number
  winRate: number
  form: string[]
  jockey: string
  nextRace?: string
  earnings: string
  rating: number
  status: 'active' | 'inactive' | 'veteran' | 'rookie'
  photo?: string
}

interface DemoJockey {
  id: string
  firstName: string
  lastName: string
  age: number
  victories: number
  totalRaces: number
  winRate: number
  weight: string
  height: string
  experience: number
  license: string
  club: string
  status: 'active' | 'inactive' | 'veteran' | 'rookie'
  photo?: string
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Simuler un délai de chargement
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const demoHorses: DemoHorse[] = [
    {
      id: "1",
      name: "Thunder Bolt",
      age: 4,
      victories: 12,
      totalRaces: 20,
      winRate: 60,
      form: ["1", "2", "1", "3", "1"],
      jockey: "Ahmed Ben Salem",
      nextRace: "Grand Prix d'Été - 25 Août",
      earnings: "125,000 TND",
      rating: 92,
      status: "active",
      photo: "/api/placeholder/64/64"
    },
    {
      id: "2", 
      name: "Desert Wind",
      age: 5,
      victories: 8,
      totalRaces: 15,
      winRate: 53,
      form: ["2", "1", "3", "1", "2"],
      jockey: "Mohamed Khalil",
      earnings: "89,000 TND",
      rating: 87,
      status: "veteran",
      photo: "/api/placeholder/64/64"
    },
    {
      id: "3",
      name: "Golden Star", 
      age: 3,
      victories: 3,
      totalRaces: 8,
      winRate: 38,
      form: ["3", "4", "1", "5", "2"],
      jockey: "Karim Souissi",
      nextRace: "Course des Rookies - 28 Août",
      earnings: "24,000 TND",
      rating: 74,
      status: "rookie",
      photo: "/api/placeholder/64/64"
    }
  ]

  const demoJockeys: DemoJockey[] = [
    {
      id: "1",
      firstName: "Ahmed",
      lastName: "Ben Salem", 
      age: 28,
      victories: 45,
      totalRaces: 120,
      winRate: 37.5,
      weight: "52kg",
      height: "1.65m",
      experience: 8,
      license: "TJC-J-2024-001",
      club: "Tunisia Jockey Club",
      status: "active",
      photo: "/api/placeholder/64/64"
    },
    {
      id: "2",
      firstName: "Mohamed", 
      lastName: "Khalil",
      age: 35,
      victories: 89,
      totalRaces: 200,
      winRate: 44.5,
      weight: "54kg", 
      height: "1.68m",
      experience: 15,
      license: "TJC-J-2020-003",
      club: "Tunisia Jockey Club",
      status: "veteran",
      photo: "/api/placeholder/64/64"
    }
  ]

  const stats = {
    totalHorses: demoHorses.length,
    activeHorses: demoHorses.filter(h => h.status === 'active').length,
    upcomingRaces: 3,
    totalEarnings: demoHorses.reduce((sum, h) => 
      sum + parseInt(h.earnings.replace(/[^\d]/g, '')), 0
    )
  }

  return json({ horses: demoHorses, jockeys: demoJockeys, stats })
}

export default function DesignSystemDemo() {
  const { horses, jockeys, stats } = useLoaderData<typeof loader>()

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Header avec animations */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold text-turf-green-800">
          🏇 Design System Hippique
        </h1>
        <p className="text-lg text-gray-600">
          Démonstration des composants optimisés Tunisia Jockey Club
        </p>
      </motion.div>

      {/* Showcase des boutons */}
      <section className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">🔘 Boutons Spécialisés</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Actions Primaires */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Actions Primaires</h3>
            <div className="space-y-2">
              <HippicButton variant="primary" icon="👁">
                Voir Course
              </HippicButton>
              <HippicButton variant="secondary" icon="📊">
                Statistiques
              </HippicButton>
              <HippicButton variant="outline" icon="✏️">
                Modifier
              </HippicButton>
            </div>
          </div>

          {/* Actions Hippiques */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Actions Hippiques</h3>
            <div className="space-y-2">
              <BetButton>Parier 50 TND</BetButton>
              <RegisterButton>Inscrire</RegisterButton>
              <VictoryButton>Victoire!</VictoryButton>
            </div>
          </div>

          {/* États & Tailles */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Tailles & États</h3>
            <div className="space-y-2">
              <HippicButton size="sm" variant="primary">
                Petit
              </HippicButton>
              <HippicButton size="default" variant="primary">
                Normal
              </HippicButton>
              <HippicButton size="lg" variant="primary">
                Grand
              </HippicButton>
              <HippicButton loading variant="primary">
                Chargement
              </HippicButton>
            </div>
          </div>

          {/* Premium & Luxury */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Premium</h3>
            <div className="space-y-2">
              <HippicButton variant="premium" icon="💎">
                Premium
              </HippicButton>
              <HippicButton variant="luxury" icon="👑">
                Luxury
              </HippicButton>
              <HippicButton variant="bet" animate pulse>
                Pari VIP
              </HippicButton>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase des badges */}
      <section className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">🏷️ Badges Contextuels</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Performance */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Performance</h3>
            <div className="flex flex-wrap gap-2">
              <HippicBadge position={1}>Thunder Bolt</HippicBadge>
              <HippicBadge position={2}>Desert Wind</HippicBadge>
              <HippicBadge position={3}>Golden Star</HippicBadge>
              <VictoryBadge animate>Champion</VictoryBadge>
            </div>
          </div>

          {/* Statuts */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Statuts</h3>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="active" />
              <StatusBadge status="veteran" />
              <StatusBadge status="rookie" />
              <StatusBadge status="inactive" />
            </div>
          </div>

          {/* Courses */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Courses</h3>
            <div className="flex flex-wrap gap-2">
              <RaceBadge status="upcoming" />
              <RaceBadge status="ongoing" />
              <RaceBadge status="completed" />
              <HippicBadge variant="excellent" animate>Excellent</HippicBadge>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: "🐎", label: "Chevaux", value: stats.totalHorses, color: "turf-green" },
          { icon: "🟢", label: "Actifs", value: stats.activeHorses, color: "green" },
          { icon: "🏁", label: "Courses", value: stats.upcomingRaces, color: "blue" },
          { icon: "💰", label: "Gains", value: `${(stats.totalEarnings / 1000).toFixed(0)}k TND`, color: "racing-gold" }
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{stat.icon}</div>
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Cartes Chevaux */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">🐎 Chevaux Premium</h2>
          <HippicButton variant="primary" icon={<Plus className="w-4 h-4" />}>
            Nouveau Cheval
          </HippicButton>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {horses.map((horse, idx) => (
            <motion.div
              key={horse.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.2 }}
            >
              <HorseCard 
                horse={horse}
                animate
                onView={() => console.log(`Voir cheval ${horse.name}`)}
                onEdit={() => console.log(`Modifier cheval ${horse.name}`)}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cartes Jockeys */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">🏇 Jockeys Elite</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jockeys.map((jockey, idx) => (
            <motion.div
              key={jockey.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.3 }}
            >
              <JockeyCard 
                jockey={jockey}
                animate
                onView={() => console.log(`Voir jockey ${jockey.firstName} ${jockey.lastName}`)}
                onEdit={() => console.log(`Modifier jockey ${jockey.firstName} ${jockey.lastName}`)}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* États de chargement */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">⏳ États de Chargement</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <HorseCardSkeleton />
          <HorseCardSkeleton compact />
          <div className="space-y-4">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        </div>

        {/* Loader hippique */}
        <div className="bg-white rounded-xl p-8">
          <HippicLoader message="Chargement des données hippiques..." />
        </div>
      </section>

      {/* Footer avec actions */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center space-y-4 py-8"
      >
        <h3 className="text-xl font-semibold text-gray-800">
          🎯 Design System Optimisé
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Composants spécialisés pour l'univers hippique avec performances optimisées,
          accessibilité WCAG AA et animations fluides.
        </p>
        <div className="flex justify-center space-x-4">
          <HippicButton variant="primary" animate>
            Documentation
          </HippicButton>
          <HippicButton variant="outline" animate>
            Storybook
          </HippicButton>
        </div>
      </motion.div>
    </div>
  )
}
