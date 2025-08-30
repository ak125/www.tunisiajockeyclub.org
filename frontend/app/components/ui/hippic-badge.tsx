import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import * as React from "react"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Variantes Standard
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        
        // Variantes Hippiques - Performance
        victory: "border-transparent bg-gradient-to-r from-racing-gold-400 to-racing-gold-500 text-turf-green-900 hover:from-racing-gold-500 hover:to-racing-gold-600 shadow-racing font-bold",
        podium: "border-transparent bg-gradient-to-r from-racing-gold-200 to-racing-gold-300 text-turf-green-800 hover:from-racing-gold-300 hover:to-racing-gold-400",
        participation: "border-transparent bg-turf-green-100 text-turf-green-700 hover:bg-turf-green-200",
        
        // Variantes Statuts
        active: "border-transparent bg-green-100 text-green-800 hover:bg-green-200 animate-pulse-slow",
        inactive: "border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200",
        veteran: "border-transparent bg-purple-100 text-purple-800 hover:bg-purple-200",
        rookie: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
        
        // Variantes Courses
        upcoming: "border-transparent bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 border animate-shimmer",
        ongoing: "border-transparent bg-orange-100 text-orange-800 hover:bg-orange-200 animate-bounce-subtle",
        completed: "border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200",
        
        // Variantes Performance
        excellent: "border-transparent bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600 shadow-turf",
        good: "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        average: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        poor: "border-transparent bg-red-100 text-red-800 hover:bg-red-200"
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm"
      },
      animation: {
        none: "",
        pulse: "animate-pulse-slow",
        shimmer: "animate-shimmer", 
        bounce: "animate-bounce-subtle",
        float: "animate-float"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none"
    },
  }
)

export interface HippicBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
  animate?: boolean
  position?: number // Pour badges de position (1er, 2e, 3e)
}

function HippicBadge({ 
  className, 
  variant, 
  size, 
  animation, 
  icon, 
  animate = false,
  position,
  children,
  ...props 
}: HippicBadgeProps) {
  
  // Auto-détection variant basé sur position
  const getPositionVariant = (pos: number) => {
    if (pos === 1) return "victory"
    if (pos <= 3) return "podium" 
    return "participation"
  }
  
  // Icons contextuels
  const getPositionIcon = (pos: number) => {
    if (pos === 1) return "🥇"
    if (pos === 2) return "🥈"
    if (pos === 3) return "🥉"
    return null
  }
  
  const finalVariant = position ? getPositionVariant(position) : variant
  const finalIcon = position ? getPositionIcon(position) : icon
  
  const BadgeContent = () => (
    <div className={cn(badgeVariants({ variant: finalVariant, size, animation }), className)} {...props}>
      {finalIcon && <span className="mr-1">{finalIcon}</span>}
      {children}
      {position && <span className="ml-1 text-xs opacity-75">#{position}</span>}
    </div>
  )
  
  if (animate) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <BadgeContent />
      </motion.div>
    )
  }
  
  return <BadgeContent />
}

// Composants spécialisés
export const VictoryBadge = ({ children, ...props }: Omit<HippicBadgeProps, 'variant'>) => (
  <HippicBadge variant="victory" icon="🏆" animate {...props}>
    {children}
  </HippicBadge>
)

export const StatusBadge = ({ 
  status, 
  ...props 
}: Omit<HippicBadgeProps, 'variant'> & { status: 'active' | 'inactive' | 'veteran' | 'rookie' }) => {
  const icons = {
    active: "🟢",
    inactive: "⭕",
    veteran: "⭐",
    rookie: "🆕"
  }
  
  return (
    <HippicBadge variant={status} icon={icons[status]} {...props}>
      {status === 'active' && 'Actif'}
      {status === 'inactive' && 'Inactif'}
      {status === 'veteran' && 'Vétéran'}
      {status === 'rookie' && 'Débutant'}
    </HippicBadge>
  )
}

export const RaceBadge = ({ 
  status, 
  ...props 
}: Omit<HippicBadgeProps, 'variant'> & { status: 'upcoming' | 'ongoing' | 'completed' }) => {
  const config = {
    upcoming: { icon: "⏰", text: "À venir", animation: "shimmer" as const },
    ongoing: { icon: "🏁", text: "En cours", animation: "bounce" as const },
    completed: { icon: "✅", text: "Terminée", animation: "none" as const }
  }
  
  const { icon, text, animation } = config[status]
  
  return (
    <HippicBadge 
      variant={status} 
      icon={icon} 
      animation={animation}
      {...props}
    >
      {text}
    </HippicBadge>
  )
}

export { HippicBadge, badgeVariants }
