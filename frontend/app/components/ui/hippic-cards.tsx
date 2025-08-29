import { motion } from "framer-motion"
import * as React from "react"

import { cn } from "../../lib/utils"
import { Card, CardContent, CardHeader } from "./card"
import { HippicBadge, StatusBadge } from "./hippic-badge"
import { HippicButton } from "./hippic-button"

// Types
interface BaseEntity {
  id: string
  name: string
  status: 'active' | 'inactive' | 'veteran' | 'rookie'
  photo?: string
}

interface Horse extends BaseEntity {
  age: number
  victories: number
  totalRaces: number
  winRate: number
  form: string[]
  jockey: string
  nextRace?: string
  earnings: string
  rating: number
}

interface Jockey extends BaseEntity {
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
}

interface Race {
  id: string
  name: string
  date: string
  time: string
  location: string
  participants: number
  maxParticipants: number
  status: 'upcoming' | 'ongoing' | 'completed'
  prize: string
  distance: string
  winner?: string
}

// Composants de cartes spécialisées
interface HorseCardProps {
  horse: Horse
  compact?: boolean
  animate?: boolean
  onView?: () => void
  onEdit?: () => void
}

export const HorseCard = React.forwardRef<HTMLDivElement, HorseCardProps>(
  ({ horse, compact = false, animate = true, onView, onEdit, ...props }, ref) => {
    
    const getFormIndicator = (form: string[]) => (
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 mr-2">Forme:</span>
        {form.slice(-5).map((result, idx) => (
          <span
            key={idx}
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
              result === "1" ? "bg-racing-gold-400 text-turf-green-900" :
              result === "2" ? "bg-gray-300 text-gray-700" :
              result === "3" ? "bg-amber-200 text-amber-800" :
              "bg-gray-100 text-gray-500"
            )}
          >
            {result}
          </span>
        ))}
      </div>
    )

    const getRatingColor = (rating: number) => {
      if (rating >= 90) return "text-racing-gold-600 font-bold"
      if (rating >= 80) return "text-green-600 font-semibold"
      if (rating >= 70) return "text-blue-600"
      return "text-gray-600"
    }

    const CardComponent = () => (
      <Card 
        ref={ref}
        className={cn(
          "overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-turf-green-300 group",
          compact ? "p-4" : ""
        )}
        {...props}
      >
        {/* Header avec photo et infos principales */}
        <CardHeader className={compact ? "pb-2" : "pb-4"}>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-turf-green-100 to-turf-green-200 rounded-xl flex items-center justify-center overflow-hidden">
                  {horse.photo ? (
                    <img 
                      src={horse.photo} 
                      alt={`${horse.name}, rating ${horse.rating}`} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span 
                      className="text-2xl"
                      role="img" 
                      aria-label={`Avatar du cheval ${horse.name}`}
                    >
                      🐎
                    </span>
                  )}
                </div>
                {/* Rating badge */}
                <div className="absolute -bottom-2 -right-2">
                  <HippicBadge variant="default" size="sm" className="bg-white shadow-sm">
                    {horse.rating}
                  </HippicBadge>
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-turf-green-700 transition-colors">
                  {horse.name}
                </h3>
                <StatusBadge status={horse.status} size="sm" />
              </div>
              
              <p className="text-sm text-gray-500 mb-2">
                {horse.age} ans • Jockey: {horse.jockey}
              </p>
              
              {!compact && getFormIndicator(horse.form)}
            </div>
          </div>
        </CardHeader>

        {/* Stats */}
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-xl font-bold text-racing-gold-600">{horse.victories}</p>
              <p className="text-xs text-gray-500">Victoires</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">{horse.totalRaces}</p>
              <p className="text-xs text-gray-500">Courses</p>
            </div>
            <div className="text-center">
              <p className={cn("text-xl font-bold", getRatingColor(horse.rating))}>
                {horse.winRate}%
              </p>
              <p className="text-xs text-gray-500">Taux</p>
            </div>
          </div>

          {/* Prochaine course */}
          {horse.nextRace && (
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-blue-600">📅 Prochaine course:</span>
                <span className="text-blue-900 font-medium">{horse.nextRace}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <span className="text-green-600 font-bold text-sm">
              💰 {horse.earnings}
            </span>
            <div className="flex space-x-2">
              {onView && (
                <HippicButton
                  size="sm"
                  variant="outline"
                  onClick={onView}
                  icon="👁"
                  animate
                >
                  Voir
                </HippicButton>
              )}
              {onEdit && (
                <HippicButton
                  size="sm"
                  variant="ghost"
                  onClick={onEdit}
                  icon="✏️"
                  animate
                >
                  Modifier
                </HippicButton>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )

    if (animate) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <CardComponent />
        </motion.div>
      )
    }

    return <CardComponent />
  }
)

HorseCard.displayName = "HorseCard"

// Jockey Card similaire
interface JockeyCardProps {
  jockey: Jockey
  compact?: boolean
  animate?: boolean
  onView?: () => void
  onEdit?: () => void
}

export const JockeyCard = React.forwardRef<HTMLDivElement, JockeyCardProps>(
  ({ jockey, compact = false, animate = true, onView, onEdit, ...props }, ref) => {
    
    const getWinRateColor = (winRate: number) => {
      if (winRate >= 25) return 'text-racing-gold-600 font-bold'
      if (winRate >= 20) return 'text-green-600 font-semibold'
      if (winRate >= 15) return 'text-blue-600'
      return 'text-gray-600'
    }

    const CardComponent = () => (
      <Card 
        ref={ref}
        className="overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-turf-green-300 group"
        {...props}
      >
        {/* Header */}
        <CardHeader className="pb-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                {jockey.photo ? (
                  <img 
                    src={jockey.photo} 
                    alt={`${jockey.firstName} ${jockey.lastName}, jockey professionnel`} 
                    className="w-full h-full object-cover rounded-xl"
                    loading="lazy"
                  />
                ) : (
                  <span 
                    className="text-2xl"
                    role="img" 
                    aria-label={`Avatar du jockey ${jockey.firstName} ${jockey.lastName}`}
                  >
                    🏇
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-turf-green-700">
                  {jockey.firstName} {jockey.lastName}
                </h3>
                <StatusBadge status={jockey.status} size="sm" />
              </div>
              
              <p className="text-sm text-gray-500 mb-1">{jockey.club}</p>
              <p className="text-xs text-gray-400">#{jockey.license}</p>
            </div>
          </div>
        </CardHeader>

        {/* Stats */}
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-xl font-bold text-racing-gold-600">{jockey.victories}</p>
              <p className="text-xs text-gray-500">Victoires</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">{jockey.totalRaces}</p>
              <p className="text-xs text-gray-500">Courses</p>
            </div>
            <div className="text-center">
              <p className={cn("text-xl font-bold", getWinRateColor(jockey.winRate))}>
                {jockey.winRate}%
              </p>
              <p className="text-xs text-gray-500">Taux</p>
            </div>
          </div>

          {/* Détails physiques */}
          {!compact && (
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="text-gray-500">Âge:</span>
                <span className="ml-2 font-medium">{jockey.age} ans ({jockey.experience} exp.)</span>
              </div>
              <div>
                <span className="text-gray-500">Poids:</span>
                <span className="ml-2 font-medium">{jockey.weight} • {jockey.height}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2">
            {onView && (
              <HippicButton
                size="sm"
                variant="outline"
                onClick={onView}
                icon="👁"
                animate
              >
                Profil
              </HippicButton>
            )}
            {onEdit && (
              <HippicButton
                size="sm"
                variant="ghost"
                onClick={onEdit}
                icon="✏️"
                animate
              >
                Modifier
              </HippicButton>
            )}
          </div>
        </CardContent>
      </Card>
    )

    if (animate) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <CardComponent />
        </motion.div>
      )
    }

    return <CardComponent />
  }
)

JockeyCard.displayName = "JockeyCard"

export type { Horse, Jockey, Race }
