import { motion } from "framer-motion"
import * as React from "react"

import { cn } from "../../lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  animate?: boolean
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, animate = true, ...props }, ref) => {
    const baseClasses = "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md"
    
    if (animate) {
      return (
        <div
          ref={ref}
          className={cn(
            baseClasses,
            "bg-[length:200%_100%] animate-shimmer",
            className
          )}
          {...props}
        />
      )
    }
    
    return (
      <div
        ref={ref}
        className={cn(baseClasses, "animate-pulse", className)}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

// Skeletons spécialisés hippiques
export const HorseCardSkeleton: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    {/* Header */}
    <div className={cn("p-6", compact && "p-4")}>
      <div className="flex items-start space-x-4">
        {/* Photo placeholder */}
        <div className="flex-shrink-0">
          <Skeleton className="w-16 h-16 rounded-xl" />
        </div>
        
        {/* Info principale */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-40" />
          {!compact && (
            <div className="flex items-center gap-2 mt-3">
              <Skeleton className="h-4 w-12" />
              {Array.from({length: 5}).map((_, i) => (
                <Skeleton key={i} className="w-6 h-6 rounded-full" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Stats */}
    <div className="px-6 pb-4">
      <div className="grid grid-cols-3 gap-4 mb-4">
        {Array.from({length: 3}).map((_, i) => (
          <div key={i} className="text-center space-y-2">
            <Skeleton className="h-6 w-8 mx-auto" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>

      {/* Course suivante */}
      <Skeleton className="h-12 w-full rounded-lg mb-4" />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-20" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
)

export const JockeyCardSkeleton: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    {/* Header */}
    <div className="p-6 pb-4">
      <div className="flex items-start space-x-4">
        <Skeleton className="w-16 h-16 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>

    {/* Stats et détails */}
    <div className="px-6 pb-4">
      <div className="grid grid-cols-3 gap-4 mb-4">
        {Array.from({length: 3}).map((_, i) => (
          <div key={i} className="text-center space-y-2">
            <Skeleton className="h-6 w-8 mx-auto" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>

      {!compact && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  </div>
)

export const RaceCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      {Array.from({length: 4}).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      ))}
    </div>

    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-32" />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  </div>
)

export const StatCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div className="flex items-center">
      <Skeleton className="w-12 h-12 rounded-lg mr-4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  </div>
)

// Skeleton pour tableau
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ 
  rows = 5, 
  cols = 4 
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    {/* Header */}
    <div className="border-b border-gray-200 p-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({length: cols}).map((_, i) => (
          <Skeleton key={i} className="h-5 w-20" />
        ))}
      </div>
    </div>
    
    {/* Rows */}
    {Array.from({length: rows}).map((_, rowIndex) => (
      <div key={rowIndex} className="border-b border-gray-100 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({length: cols}).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 w-full" />
          ))}
        </div>
      </div>
    ))}
  </div>
)

// Skeleton pour dashboard complet
export const DashboardSkeleton: React.FC = () => (
  <div className="p-6 space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex space-x-3">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({length: 4}).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>

    {/* Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <TableSkeleton rows={8} cols={5} />
      </div>
      <div className="space-y-6">
        {Array.from({length: 3}).map((_, i) => (
          <HorseCardSkeleton key={i} compact />
        ))}
      </div>
    </div>
  </div>
)

// Composant de loading avec animation hippique
export const HippicLoader: React.FC<{ message?: string }> = ({ 
  message = "Chargement..." 
}) => (
  <div className="flex flex-col items-center justify-center p-8 space-y-4">
    <motion.div
      animate={{ 
        rotate: 360,
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
        scale: { duration: 1, repeat: Infinity }
      }}
      className="text-6xl"
    >
      🏇
    </motion.div>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="text-lg font-medium text-turf-green-700"
    >
      {message}
    </motion.p>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ duration: 2, repeat: Infinity }}
      className="h-1 bg-gradient-to-r from-racing-gold-400 to-racing-gold-600 rounded-full max-w-xs"
    />
  </div>
)

export { Skeleton }
