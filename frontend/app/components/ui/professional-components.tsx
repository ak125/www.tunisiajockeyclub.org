import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export type ProfessionalBadgeVariant = 
  | "official" 
  | "certified" 
  | "priority-high" 
  | "priority-medium" 
  | "priority-low"
  | "status-active"
  | "status-pending"
  | "status-completed"
  | "quality-excellent"
  | "quality-good"
  | "quality-standard";

export interface ProfessionalBadgeProps {
  variant: ProfessionalBadgeVariant;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const badgeVariants = {
  official: "bg-slate-900 text-white border-slate-900",
  certified: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "priority-high": "bg-red-50 text-red-700 border-red-200",
  "priority-medium": "bg-yellow-50 text-yellow-700 border-yellow-200", 
  "priority-low": "bg-slate-50 text-slate-600 border-slate-200",
  "status-active": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "status-pending": "bg-blue-50 text-blue-700 border-blue-200",
  "status-completed": "bg-slate-50 text-slate-700 border-slate-200",
  "quality-excellent": "bg-emerald-50 text-emerald-800 border-emerald-200",
  "quality-good": "bg-blue-50 text-blue-700 border-blue-200",
  "quality-standard": "bg-slate-50 text-slate-600 border-slate-200"
};

const sizeVariants = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2 text-base"
};

export function ProfessionalBadge({ 
  variant, 
  children, 
  size = "md", 
  className 
}: ProfessionalBadgeProps) {
  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "inline-flex items-center gap-1 font-semibold rounded-full border transition-all duration-200",
        badgeVariants[variant],
        sizeVariants[size],
        className
      )}
    >
      {children}
    </motion.span>
  );
}

export type ProfessionalButtonVariant = 
  | "primary" 
  | "secondary" 
  | "outline" 
  | "ghost" 
  | "danger"
  | "success";

export interface ProfessionalButtonProps {
  variant?: ProfessionalButtonVariant;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const buttonVariants = {
  primary: "bg-slate-900 text-white hover:bg-slate-800 border-slate-900",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 border-slate-200",
  outline: "bg-transparent text-slate-900 hover:bg-slate-50 border-slate-300",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-50 border-transparent",
  danger: "bg-red-600 text-white hover:bg-red-700 border-red-600",
  success: "bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600"
};

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base"
};

export function ProfessionalButton({ 
  variant = "primary", 
  size = "md", 
  children, 
  onClick, 
  className, 
  disabled = false 
}: ProfessionalButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-lg border transition-all duration-200 shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1",
        disabled 
          ? "opacity-50 cursor-not-allowed" 
          : "hover:shadow-md",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
    >
      {children}
    </motion.button>
  );
}
