import { motion } from "framer-motion";
import { useState } from "react";
import { exportUtils, type ExportData } from "../../utils/export.client";
import { ExecutiveButton, ExecutiveBadge } from "./executive-components";

interface ExportPanelProps {
  elementId?: string;
  data?: any[];
  title: string;
  user: any;
  className?: string;
  showFormats?: ('pdf' | 'excel' | 'screenshot')[];
  onExportStart?: () => void;
  onExportComplete?: (format: string) => void;
  onExportError?: (error: Error, format: string) => void;
}

export const ExportPanel = ({
  elementId,
  data = [],
  title,
  user,
  className = "",
  showFormats = ['pdf', 'excel', 'screenshot'],
  onExportStart,
  onExportComplete,
  onExportError
}: ExportPanelProps) => {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [lastExport, setLastExport] = useState<{ format: string; timestamp: string } | null>(null);

  const handleExport = async (format: 'pdf' | 'excel' | 'screenshot') => {
    try {
      setIsExporting(format);
      onExportStart?.();

      let exportData: ExportData;
      
      switch (format) {
        case 'pdf':
          if (!elementId) throw new Error('ElementId requis pour l\'export PDF');
          
          if (title.toLowerCase().includes('métrique')) {
            exportData = await exportUtils.exportDashboardMetrics(data, user);
          } else if (title.toLowerCase().includes('licence')) {
            exportData = await exportUtils.exportLicenses(data, user);
          } else {
            exportData = {
              title,
              data: Array.isArray(data) ? data : [],
              metadata: {
                generatedBy: `${user.firstName} ${user.lastName} (${user.role})`,
                generatedAt: new Date().toISOString(),
                systemInfo: { version: '2.0.0' }
              }
            };
          }
          
          await exportUtils.pdf.exportDashboard(elementId, exportData);
          break;

        case 'excel':
          if (title.toLowerCase().includes('métrique')) {
            exportData = await exportUtils.exportDashboardMetrics(data, user);
          } else if (title.toLowerCase().includes('licence')) {
            exportData = await exportUtils.exportLicenses(data, user);
          } else {
            exportData = {
              title,
              data: Array.isArray(data) ? data : [],
              headers: data.length > 0 ? Object.keys(data[0]) : [],
              metadata: {
                generatedBy: `${user.firstName} ${user.lastName} (${user.role})`,
                generatedAt: new Date().toISOString(),
                systemInfo: { version: '2.0.0' }
              }
            };
          }
          
          await exportUtils.excel.exportData(exportData);
          break;

        case 'screenshot':
          if (!elementId) throw new Error('ElementId requis pour la capture d\'écran');
          
          const element = document.getElementById(elementId);
          if (!element) throw new Error(`Element ${elementId} non trouvé`);
          
          const { default: html2canvas } = await import('html2canvas');
          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
          });
          
          // Télécharger l'image
          const link = document.createElement('a');
          link.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.png`;
          link.href = canvas.toDataURL();
          link.click();
          break;

        default:
          throw new Error(`Format d'export non supporté: ${format}`);
      }

      setLastExport({ format, timestamp: new Date().toISOString() });
      onExportComplete?.(format);

    } catch (error) {
      console.error(`Erreur export ${format}:`, error);
      onExportError?.(error as Error, format);
    } finally {
      setIsExporting(null);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return '📄';
      case 'excel': return '📊';
      case 'screenshot': return '📸';
      default: return '💾';
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'pdf': return 'from-red-500 to-red-600';
      case 'excel': return 'from-green-500 to-green-600';
      case 'screenshot': return 'from-blue-500 to-blue-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getFormatLabel = (format: string) => {
    switch (format) {
      case 'pdf': return 'Export PDF';
      case 'excel': return 'Export Excel';
      case 'screenshot': return 'Capture d\'écran';
      default: return format;
    }
  };

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Exporter les Données</h3>
          <p className="text-sm text-slate-600">Générer des rapports personnalisés</p>
        </div>
        <ExecutiveBadge variant="premium" size="sm">
          {data.length} éléments
        </ExecutiveBadge>
      </div>

      {/* Boutons d'export */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {showFormats.map((format, index) => (
          <motion.div
            key={format}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ExecutiveButton
              onClick={() => handleExport(format)}
              disabled={isExporting !== null}
              loading={isExporting === format}
              variant="secondary"
              className="w-full group relative overflow-hidden"
            >
              <div className="flex items-center justify-center space-x-3">
                <div className={`w-8 h-8 bg-gradient-to-r ${getFormatColor(format)} rounded-lg flex items-center justify-center text-white text-sm group-hover:scale-110 transition-transform`}>
                  {getFormatIcon(format)}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-800">{getFormatLabel(format)}</p>
                  <p className="text-xs text-slate-600">
                    {format === 'pdf' ? 'Rapport complet' : 
                     format === 'excel' ? 'Données brutes' : 
                     'Image haute qualité'}
                  </p>
                </div>
              </div>
              
              {isExporting === format && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </ExecutiveButton>
          </motion.div>
        ))}
      </div>

      {/* Informations sur le dernier export */}
      {lastExport && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold">✅</span>
            </div>
            <div>
              <p className="text-green-800 font-semibold">Export réussi !</p>
              <p className="text-green-600 text-sm">
                {getFormatLabel(lastExport.format)} généré le {new Date(lastExport.timestamp).toLocaleString('fr-FR')}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Légende */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 rounded flex items-center justify-center">
              📄
            </div>
            <span>PDF: Rapport avec graphiques et données</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 rounded flex items-center justify-center">
              📊
            </div>
            <span>Excel: Données manipulables</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
              📸
            </div>
            <span>PNG: Image pour présentation</span>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>Généré par: {user.firstName} {user.lastName}</span>
          <span>Rôle: {user.role.replace('_', ' ').toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};
