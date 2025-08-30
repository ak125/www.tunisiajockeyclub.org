import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import * as React from "react"

import { cn } from "../../lib/utils"

const hippicButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:shadow-lg active:scale-95",
  {
    variants: {
      variant: {
        // Variantes Standard améliorées
        primary: "bg-turf-green-600 text-white hover:bg-turf-green-700 shadow-turf",
        secondary: "bg-racing-gold-100 text-racing-gold-800 hover:bg-racing-gold-200 border border-racing-gold-300",
        outline: "border-2 border-turf-green-600 bg-transparent text-turf-green-600 hover:bg-turf-green-50",
        ghost: "text-turf-green-600 hover:bg-turf-green-50 hover:text-turf-green-700",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-lg",
        
        // Variantes Actions Hippiques
        bet: "bg-gradient-to-r from-racing-gold-400 to-racing-gold-600 text-turf-green-900 hover:from-racing-gold-500 hover:to-racing-gold-700 shadow-racing font-bold",
        register: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg",
        cancel: "bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-500 hover:to-red-600",
        
        // Variantes Statuts
        victory: "bg-gradient-to-r from-racing-gold-500 to-yellow-400 text-turf-green-900 hover:from-racing-gold-600 hover:to-yellow-500 shadow-racing animate-shimmer",
        podium: "bg-gradient-to-r from-racing-gold-300 to-racing-gold-400 text-turf-green-800 hover:from-racing-gold-400 hover:to-racing-gold-500",
        
        // Variantes Course
        upcoming: "bg-blue-50 text-blue-700 border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300",
        ongoing: "bg-orange-500 text-white hover:bg-orange-600 animate-pulse shadow-lg",
        completed: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        
        // Variantes Premium 
        premium: "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg ring-2 ring-purple-300 ring-opacity-50",
        luxury: "bg-gradient-to-r from-jockey-silk-500 to-jockey-silk-600 text-white hover:from-jockey-silk-600 hover:to-jockey-silk-700 shadow-xl"
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        default: "h-10 px-4 py-2 rounded-lg", 
        lg: "h-12 px-6 text-lg rounded-xl",
        xl: "h-14 px-8 text-xl rounded-2xl",
        icon: "h-10 w-10 rounded-lg"
      },
      loading: {
        true: "cursor-wait",
        false: ""
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      loading: false
    },
  }
)

export interface HippicButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof hippicButtonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  animate?: boolean
  pulse?: boolean
}

const HippicButton = React.forwardRef<HTMLButtonElement, HippicButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    loading = false, 
    icon, 
    iconPosition = "left",
    animate = false,
    pulse = false,
    asChild = false, 
    children,
    disabled,
    ...props 
  }, ref) => {
    
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || loading
    
    const ButtonContent = () => (
      <Comp
        className={cn(
          hippicButtonVariants({ variant, size, loading, className }),
          pulse && "animate-pulse",
          isDisabled && "cursor-not-allowed"
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Chargement...</span>
          </>
        ) : (
          <>
            {icon && iconPosition === "left" && <span className="flex-shrink-0">{icon}</span>}
            {children}
            {icon && iconPosition === "right" && <span className="flex-shrink-0">{icon}</span>}
          </>
        )}
      </Comp>
    )
    
    if (animate && !isDisabled) {
      return (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
        >
          <ButtonContent />
        </motion.div>
      )
    }
    
    return <ButtonContent />
  }
)

HippicButton.displayName = "HippicButton"

// Composants spécialisés
export const BetButton = React.forwardRef<HTMLButtonElement, Omit<HippicButtonProps, 'variant'>>(
  (props, ref) => (
    <HippicButton
      ref={ref}
      variant="bet"
      icon="💰"
      animate
      {...props}
    />
  )
)

export const RegisterButton = React.forwardRef<HTMLButtonElement, Omit<HippicButtonProps, 'variant'>>(
  (props, ref) => (
    <HippicButton
      ref={ref}
      variant="register"
      icon="📝"
      animate
      {...props}
    />
  )
)

export const VictoryButton = React.forwardRef<HTMLButtonElement, Omit<HippicButtonProps, 'variant'>>(
  (props, ref) => (
    <HippicButton
      ref={ref}
      variant="victory"
      icon="🏆"
      animate
      pulse
      {...props}
    />
  )
)

export const RaceStatusButton = React.forwardRef<HTMLButtonElement, 
  Omit<HippicButtonProps, 'variant'> & { status: 'upcoming' | 'ongoing' | 'completed' }
>(({ status, ...props }, ref) => {
  const config = {
    upcoming: { icon: "⏰", pulse: false },
    ongoing: { icon: "🏁", pulse: true },
    completed: { icon: "✅", pulse: false }
  }
  
  const { icon, pulse } = config[status]
  
  return (
    <HippicButton
      ref={ref}
      variant={status}
      icon={icon}
      pulse={pulse}
      animate
      {...props}
    />
  )
})

BetButton.displayName = "BetButton"
RegisterButton.displayName = "RegisterButton" 
VictoryButton.displayName = "VictoryButton"
RaceStatusButton.displayName = "RaceStatusButton"

export { HippicButton, hippicButtonVariants }
