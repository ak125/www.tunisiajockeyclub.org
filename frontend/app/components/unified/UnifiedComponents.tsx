import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

// Composants unifiés pour la recherche
function UnifiedSearchBar({ onSearch, placeholder = "Rechercher..." }: { 
  onSearch: (term: string) => void;
  placeholder?: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="relative">
      <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onSearch(e.target.value);
        }}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
      />
    </div>
  );
}

// Composant de filtre unifié
function UnifiedFilterBar({ 
  filters, 
  activeFilter, 
  onFilterChange 
}: {
  filters: { id: string; label: string; count?: number }[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeFilter === filter.id
              ? "bg-green-100 text-green-700 border-2 border-green-300"
              : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
          }`}
        >
          <Icons.Filter className="h-4 w-4" />
          {filter.label}
          {filter.count && (
            <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
              {filter.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// Composant de carte unifié
function UnifiedCard({ 
  title, 
  subtitle, 
  description, 
  stats, 
  actions, 
  icon: Icon,
  image,
  badges = [],
  className = ""
}: {
  title: string;
  subtitle?: string;
  description?: string;
  stats?: { label: string; value: string | number; trend?: 'up' | 'down' | 'stable' }[];
  actions?: { label: string; onClick: () => void; variant?: 'primary' | 'secondary' | 'danger' }[];
  icon?: any;
  image?: string;
  badges?: { label: string; color: 'green' | 'blue' | 'yellow' | 'red' | 'gray' }[];
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
    >
      {/* En-tête de carte */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {image ? (
            <img 
              src={image} 
              alt={title}
              className="w-12 h-12 rounded-lg object-cover border border-gray-200"
            />
          ) : Icon ? (
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon className="h-6 w-6 text-green-600" />
            </div>
          ) : null}
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
        </div>

        {badges.length > 0 && (
          <div className="flex gap-1">
            {badges.map((badge, idx) => (
              <span
                key={idx}
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  badge.color === 'green' ? 'bg-green-100 text-green-700' :
                  badge.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                  badge.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                  badge.color === 'red' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {description}
        </p>
      )}

      {/* Statistiques */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                {stat.trend === 'up' && <Icons.TrendingUp className="h-4 w-4 text-green-500" />}
                {stat.trend === 'down' && <Icons.TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />}
              </div>
              <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {actions && actions.length > 0 && (
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                action.variant === 'primary' ? 'bg-green-600 hover:bg-green-700 text-white' :
                action.variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' :
                'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Composant de tableau unifié
function UnifiedTable({ 
  columns, 
  data, 
  actions = [],
  loading = false
}: {
  columns: { key: string; label: string; width?: string }[];
  data: Record<string, any>[];
  actions?: { label: string; onClick: (row: any) => void; icon?: any; variant?: 'primary' | 'secondary' | 'danger' }[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${column.width || ''}`}
                >
                  {column.label}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row[column.key]}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center gap-2">
                      {actions.map((action, actionIdx) => (
                        <button
                          key={actionIdx}
                          onClick={() => action.onClick(row)}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            action.variant === 'primary' ? 'text-green-600 hover:bg-green-50' :
                            action.variant === 'danger' ? 'text-red-600 hover:bg-red-50' :
                            'text-gray-600 hover:bg-gray-50'
                          }`}
                          title={action.label}
                        >
                          {action.icon && <action.icon className="h-4 w-4" />}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Icons.Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Aucune donnée disponible</p>
        </div>
      )}
    </div>
  );
}

// Composant de statistiques unifié
function UnifiedStatsGrid({ stats }: { 
  stats: { 
    label: string; 
    value: string | number; 
    change?: string; 
    trend?: 'up' | 'down' | 'stable';
    icon?: any;
  }[] 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
          className="bg-white border border-gray-200 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              {stat.change && (
                <div className="flex items-center gap-1 mt-2">
                  {stat.trend === 'up' && <Icons.TrendingUp className="h-4 w-4 text-green-500" />}
                  {stat.trend === 'down' && <Icons.TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />}
                  <span className={`text-sm ${
                    stat.trend === 'up' ? 'text-green-600' :
                    stat.trend === 'down' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              )}
            </div>
            {stat.icon && (
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-green-600" />
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Export des composants unifiés
export {
  UnifiedSearchBar,
  UnifiedFilterBar,
  UnifiedCard,
  UnifiedTable,
  UnifiedStatsGrid
};
