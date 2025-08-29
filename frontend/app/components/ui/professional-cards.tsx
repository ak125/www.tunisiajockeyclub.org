import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
    period?: string;
  };
  icon?: React.ReactNode;
  description?: string;
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  trend, 
  icon, 
  description, 
  className 
}: MetricCardProps) {
  const getTrendColor = (direction: "up" | "down" | "neutral") => {
    switch (direction) {
      case "up": return "text-emerald-600 bg-emerald-50";
      case "down": return "text-red-600 bg-red-50";
      default: return "text-slate-600 bg-slate-50";
    }
  };

  const getTrendIcon = (direction: "up" | "down" | "neutral") => {
    switch (direction) {
      case "up": return "↗";
      case "down": return "↘";
      default: return "→";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={cn(
        "bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60",
        "hover:shadow-xl transition-all duration-300",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        {icon && (
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
            {icon}
          </div>
        )}
        {trend && (
          <div className={cn(
            "px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1",
            getTrendColor(trend.direction)
          )}>
            <span>{getTrendIcon(trend.direction)}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      <div className="mb-2">
        <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
        <div className="text-sm font-medium text-slate-600">{title}</div>
      </div>

      {description && (
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      )}

      {trend?.period && (
        <p className="text-xs text-slate-400 mt-2">vs {trend.period}</p>
      )}
    </motion.div>
  );
}

export interface DataTableProps {
  columns: Array<{
    key: string;
    label: string;
    align?: "left" | "center" | "right";
    width?: string;
  }>;
  data: Array<Record<string, any>>;
  onRowClick?: (row: any) => void;
  className?: string;
}

export function DataTable({ columns, data, onRowClick, className }: DataTableProps) {
  return (
    <div className={cn("bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50/80 border-b border-slate-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider",
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right"
                  )}
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIndex * 0.05 }}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "hover:bg-slate-50/50 transition-colors",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "px-6 py-4",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right"
                    )}
                  >
                    {row[column.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export interface AnnouncementCardProps {
  title: string;
  date: string;
  priority: "high" | "medium" | "low";
  excerpt: string;
  onClick?: () => void;
  className?: string;
}

export function AnnouncementCard({ 
  title, 
  date, 
  priority, 
  excerpt, 
  onClick, 
  className 
}: AnnouncementCardProps) {
  const getPriorityColor = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      default: return "bg-slate-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 2 }}
      onClick={onClick}
      className={cn(
        "p-4 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-all duration-200",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-slate-900 text-sm leading-tight pr-2">
          {title}
        </h4>
        <div className={cn("w-2 h-2 rounded-full flex-shrink-0 mt-1", getPriorityColor(priority))} />
      </div>
      
      <p className="text-xs text-slate-600 leading-relaxed mb-3">{excerpt}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">{date}</span>
        {onClick && (
          <span className="text-xs text-slate-600 font-medium hover:text-slate-900">
            Lire →
          </span>
        )}
      </div>
    </motion.div>
  );
}

export interface ProgressIndicatorProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: "emerald" | "blue" | "yellow" | "red" | "slate";
  showPercentage?: boolean;
  className?: string;
}

export function ProgressIndicator({ 
  label, 
  value, 
  maxValue = 100, 
  color = "emerald", 
  showPercentage = true, 
  className 
}: ProgressIndicatorProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  const colorVariants = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500", 
    yellow: "bg-yellow-500",
    red: "bg-red-500",
    slate: "bg-slate-500"
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        {showPercentage && (
          <span className="text-sm font-bold text-slate-900">{percentage.toFixed(1)}%</span>
        )}
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("h-2.5 rounded-full", colorVariants[color])}
        />
      </div>
    </div>
  );
}
