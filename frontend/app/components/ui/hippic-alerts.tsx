import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Info, 
  X,
  Trophy,
  Clock,
  TrendingUp
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useEffect, useState } from "react";

export type AlertType = "success" | "error" | "warning" | "info" | "hippic-win" | "hippic-race" | "hippic-stats";

export interface AlertProps {
  type: AlertType;
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  hippicData?: {
    horse?: string;
    position?: number;
    time?: string;
    gain?: string;
  };
}

const alertConfig = {
  success: {
    icon: CheckCircle,
    className: "bg-green-50 border-green-200 text-green-800",
    iconColor: "text-green-600"
  },
  error: {
    icon: XCircle,
    className: "bg-red-50 border-red-200 text-red-800",
    iconColor: "text-red-600"
  },
  warning: {
    icon: AlertCircle,
    className: "bg-yellow-50 border-yellow-200 text-yellow-800",
    iconColor: "text-yellow-600"
  },
  info: {
    icon: Info,
    className: "bg-blue-50 border-blue-200 text-blue-800",
    iconColor: "text-blue-600"
  },
  "hippic-win": {
    icon: Trophy,
    className: "bg-gradient-to-r from-racing-gold-50 to-yellow-50 border-racing-gold-200 text-racing-gold-800",
    iconColor: "text-racing-gold-600"
  },
  "hippic-race": {
    icon: Clock,
    className: "bg-gradient-to-r from-turf-green-50 to-green-50 border-turf-green-200 text-turf-green-800",
    iconColor: "text-turf-green-600"
  },
  "hippic-stats": {
    icon: TrendingUp,
    className: "bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 text-purple-800",
    iconColor: "text-purple-600"
  }
};

export function HippicAlert({ 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose, 
  action,
  hippicData 
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const config = alertConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={cn(
            "relative rounded-xl border p-4 shadow-lg backdrop-blur-sm",
            config.className
          )}
        >
          <div className="flex items-start gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Icon className={cn("h-5 w-5 flex-shrink-0", config.iconColor)} />
            </motion.div>

            <div className="flex-1 min-w-0">
              <motion.h4 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="font-semibold text-sm"
              >
                {title}
              </motion.h4>
              
              {message && (
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-1 text-sm opacity-90"
                >
                  {message}
                </motion.p>
              )}

              {/* Données hippiques spéciales */}
              {hippicData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="mt-3 grid grid-cols-2 gap-2 text-xs"
                >
                  {hippicData.horse && (
                    <div className="font-medium">
                      🐎 {hippicData.horse}
                    </div>
                  )}
                  {hippicData.position && (
                    <div className="flex items-center gap-1">
                      {hippicData.position === 1 && "🥇"}
                      {hippicData.position === 2 && "🥈"}
                      {hippicData.position === 3 && "🥉"}
                      {hippicData.position > 3 && `#${hippicData.position}`}
                    </div>
                  )}
                  {hippicData.time && (
                    <div>⏱️ {hippicData.time}</div>
                  )}
                  {hippicData.gain && (
                    <div className="font-semibold text-racing-gold-700">
                      💰 {hippicData.gain}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Action button */}
              {action && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={action.onClick}
                  className="mt-3 rounded-lg bg-white/80 px-3 py-1 text-xs font-medium shadow-sm hover:bg-white/90 transition-colors"
                >
                  {action.label}
                </motion.button>
              )}
            </div>

            <motion.button
              onClick={handleClose}
              className="flex-shrink-0 rounded-full p-1 hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Barre de progression pour le timer */}
          {duration > 0 && (
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-xl overflow-hidden"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AlertManagerProps {
  alerts: (AlertProps & { id: string })[];
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center";
}

export function AlertManager({ 
  alerts, 
  position = "top-right" 
}: AlertManagerProps) {
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2"
  };

  return (
    <div className={cn(
      "fixed z-50 max-w-md w-full space-y-3 pointer-events-none",
      positionClasses[position]
    )}>
      <AnimatePresence>
        {alerts.map((alert) => (
          <div key={alert.id} className="pointer-events-auto">
            <HippicAlert {...alert} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook pour gérer les alertes
export function useHippicAlerts() {
  const [alerts, setAlerts] = useState<(AlertProps & { id: string })[]>([]);

  const addAlert = (alert: Omit<AlertProps, "onClose">) => {
    const id = Date.now().toString();
    const newAlert = {
      ...alert,
      id,
      onClose: () => removeAlert(id)
    };
    setAlerts(prev => [...prev, newAlert]);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const clearAll = () => {
    setAlerts([]);
  };

  // Fonctions de commodité
  const success = (title: string, message?: string) => 
    addAlert({ type: "success", title, message });

  const error = (title: string, message?: string) => 
    addAlert({ type: "error", title, message });

  const warning = (title: string, message?: string) => 
    addAlert({ type: "warning", title, message });

  const info = (title: string, message?: string) => 
    addAlert({ type: "info", title, message });

  const hippicWin = (title: string, hippicData: AlertProps["hippicData"]) => 
    addAlert({ type: "hippic-win", title, hippicData });

  const hippicRace = (title: string, hippicData: AlertProps["hippicData"]) => 
    addAlert({ type: "hippic-race", title, hippicData });

  const hippicStats = (title: string, message?: string, hippicData?: AlertProps["hippicData"]) => 
    addAlert({ type: "hippic-stats", title, message, hippicData });

  return {
    alerts,
    addAlert,
    removeAlert,
    clearAll,
    success,
    error,
    warning,
    info,
    hippicWin,
    hippicRace,
    hippicStats
  };
}
