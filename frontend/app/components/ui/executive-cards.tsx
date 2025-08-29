import { motion } from 'framer-motion';
import React from 'react';

// Utility function for class names
const cn = (...classes: (string | undefined | null | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Executive Metric Card - Ultra Premium
interface ExecutiveMetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  description: string;
  icon: string;
  trend?: number[];
  color?: 'indigo' | 'emerald' | 'red' | 'yellow' | 'purple';
  size?: 'sm' | 'md' | 'lg';
}

export const ExecutiveMetricCard = ({
  title,
  value,
  change,
  changeType,
  description,
  icon,
  trend = [],
  color = 'indigo',
  size = 'md'
}: ExecutiveMetricCardProps) => {
  const changeColors = {
    positive: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    negative: 'text-red-700 bg-red-50 border-red-200',
    neutral: 'text-slate-700 bg-slate-50 border-slate-200'
  };

  const iconColors = {
    indigo: 'from-indigo-100 to-indigo-200',
    emerald: 'from-emerald-100 to-emerald-200',
    red: 'from-red-100 to-red-200',
    yellow: 'from-yellow-100 to-yellow-200',
    purple: 'from-purple-100 to-purple-200'
  };

  const sizes = {
    sm: 'p-6',
    md: 'p-8',
    lg: 'p-10'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
      }}
      className={cn(
        'group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500',
        'border border-slate-100 overflow-hidden relative',
        sizes[size]
      )}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-slate-50/30 pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className={cn(
            'w-16 h-16 rounded-2xl flex items-center justify-center',
            'group-hover:scale-110 transition-transform duration-300',
            'bg-gradient-to-br',
            iconColors[color]
          )}>
            <span className="text-3xl">{icon}</span>
          </div>
          <div className={cn(
            'px-3 py-1 rounded-full text-xs font-bold border',
            changeColors[changeType]
          )}>
            {change}
          </div>
        </div>

        {/* Value */}
        <div className="mb-4">
          <div className="text-4xl font-black text-slate-900 mb-2 group-hover:text-indigo-900 transition-colors duration-300">
            {value}
          </div>
          <div className="text-lg font-bold text-slate-800">{title}</div>
          <div className="text-sm text-slate-500 font-medium mt-1">{description}</div>
        </div>

        {/* Trend Visualization */}
        {trend.length > 0 && (
          <div className="mt-6">
            <div className="flex items-end gap-1 h-12">
              {trend.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${(point / Math.max(...trend)) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex-1 bg-gradient-to-t from-indigo-200 to-indigo-400 rounded-t-sm opacity-70 hover:opacity-100 transition-opacity"
                />
              ))}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-2 uppercase tracking-wide">
              Évolution 30 derniers jours
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Executive Data Table - Premium
interface ExecutiveTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface ExecutiveTableProps {
  columns: ExecutiveTableColumn[];
  data: any[];
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  maxHeight?: string;
}

export const ExecutiveTable = ({
  columns,
  data,
  title,
  subtitle,
  actions,
  maxHeight = '400px'
}: ExecutiveTableProps) => {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [data, sortColumn, sortDirection]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
    >
      {/* Header */}
      {(title || subtitle || actions) && (
        <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 px-8 py-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-2xl font-black text-slate-900 mb-2">{title}</h3>
              )}
              {subtitle && (
                <p className="text-slate-600 font-medium">{subtitle}</p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-3">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ maxHeight }} className="overflow-auto">
        <table className="w-full">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-6 py-4 text-left text-sm font-bold text-slate-900 uppercase tracking-wide',
                    column.sortable && 'cursor-pointer hover:bg-slate-100 transition-colors'
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <div className="text-slate-400">
                        {sortColumn === column.key ? (
                          sortDirection === 'asc' ? '↑' : '↓'
                        ) : '⇅'}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedData.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-slate-50 transition-colors group"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 text-sm text-slate-700">
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

// Executive Announcement Card
interface ExecutiveAnnouncementProps {
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'ministerial';
  timestamp: string;
  author: string;
  category: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }>;
  attachments?: number;
}

export const ExecutiveAnnouncement = ({
  title,
  content,
  priority,
  timestamp,
  author,
  category,
  actions = [],
  attachments = 0
}: ExecutiveAnnouncementProps) => {
  const priorityConfig = {
    low: { color: 'bg-slate-500', border: 'border-slate-200', bg: 'bg-slate-50' },
    medium: { color: 'bg-blue-500', border: 'border-blue-200', bg: 'bg-blue-50' },
    high: { color: 'bg-yellow-500', border: 'border-yellow-200', bg: 'bg-yellow-50' },
    urgent: { color: 'bg-red-500', border: 'border-red-200', bg: 'bg-red-50' },
    ministerial: { color: 'bg-purple-600', border: 'border-purple-200', bg: 'bg-purple-50' }
  };

  const config = priorityConfig[priority];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={cn(
        'bg-white rounded-2xl border-2 p-6 shadow-lg hover:shadow-xl transition-all duration-300',
        'relative overflow-hidden group cursor-pointer',
        config.border
      )}
    >
      {/* Priority Indicator */}
      <div className={cn('absolute top-0 left-0 w-2 h-full', config.color)} />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className={cn('px-2 py-1 rounded-full text-xs font-bold uppercase', config.bg)}>
              {category}
            </span>
            <span className={cn('w-2 h-2 rounded-full', config.color)} />
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
              {priority}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-indigo-900 transition-colors">
            {title}
          </h3>
        </div>
        
        <div className="text-right flex-shrink-0">
          <div className="text-xs text-slate-500 font-mono">{timestamp}</div>
          <div className="text-xs text-slate-600 font-medium mt-1">Par {author}</div>
        </div>
      </div>

      {/* Content */}
      <p className="text-slate-600 mb-4 leading-relaxed">
        {content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-4">
          {attachments > 0 && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>📎</span>
              <span className="font-medium">{attachments} pièce{attachments > 1 ? 's' : ''} jointe{attachments > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        
        {actions.length > 0 && (
          <div className="flex items-center gap-2">
            {actions.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.onClick}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200',
                  action.variant === 'primary'
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                )}
              >
                {action.label}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Executive Progress Indicator
interface ExecutiveProgressIndicatorProps {
  steps: Array<{
    label: string;
    description?: string;
    status: 'completed' | 'current' | 'pending' | 'blocked';
  }>;
  currentStep?: number;
  orientation?: 'horizontal' | 'vertical';
}

export const ExecutiveProgressIndicator = ({
  steps,
  currentStep = 0,
  orientation = 'horizontal'
}: ExecutiveProgressIndicatorProps) => {
  const statusConfig = {
    completed: { bg: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-200' },
    current: { bg: 'bg-indigo-500', text: 'text-indigo-700', border: 'border-indigo-200' },
    pending: { bg: 'bg-slate-300', text: 'text-slate-500', border: 'border-slate-200' },
    blocked: { bg: 'bg-red-500', text: 'text-red-700', border: 'border-red-200' }
  };

  if (orientation === 'vertical') {
    return (
      <div className="space-y-4">
        {steps.map((step, index) => {
          const config = statusConfig[step.status];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="flex flex-col items-center">
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center font-bold text-white', config.bg)}>
                  {step.status === 'completed' ? '✓' : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-8 bg-slate-200 mt-2" />
                )}
              </div>
              <div className="flex-1">
                <h4 className={cn('font-bold', config.text)}>{step.label}</h4>
                {step.description && (
                  <p className="text-sm text-slate-500 mt-1">{step.description}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const config = statusConfig[step.status];
        const isLast = index === steps.length - 1;
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center flex-1"
          >
            <div className="flex flex-col items-center">
              <div className={cn('w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg', config.bg)}>
                {step.status === 'completed' ? '✓' : index + 1}
              </div>
              <div className="mt-3 text-center">
                <h4 className={cn('text-sm font-bold', config.text)}>{step.label}</h4>
                {step.description && (
                  <p className="text-xs text-slate-500 mt-1">{step.description}</p>
                )}
              </div>
            </div>
            
            {!isLast && (
              <div className="flex-1 mx-4">
                <div className="h-0.5 bg-slate-200 relative">
                  {(step.status === 'completed' || step.status === 'current') && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: step.status === 'completed' ? '100%' : '50%' }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      className="h-0.5 bg-indigo-500 absolute top-0 left-0"
                    />
                  )}
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
