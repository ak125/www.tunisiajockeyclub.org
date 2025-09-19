import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Download, FileText, Table, BarChart3, Calendar, Filter, CheckCircle } from "lucide-react";
import { useState } from "react";

export async function loader() {
  try {
    // Récupérer les données pour l'export
    const coursesResponse = await fetch('http://localhost:3000/api/courses');
    const coursesData = coursesResponse.ok ? await coursesResponse.json() : { courses: [] };
    
    const courses = coursesData.courses || [];
    
    // Calculer les statistiques
    const finishedCourses = courses.filter((race: any) => race.status === 'finished');
    const upcomingCourses = courses.filter((race: any) => race.status === 'scheduled');
    
    const stats = {
      totalCourses: courses.length,
      finishedCount: finishedCourses.length,
      upcomingCount: upcomingCourses.length,
      categories: [...new Set(courses.map((race: any) => race.category).filter(Boolean))],
      racecourses: [...new Set(courses.map((race: any) => race.racecourse?.name).filter(Boolean))],
      totalPrizeMoney: courses.reduce((sum: number, race: any) => sum + (race.prizeMoney || 0), 0)
    };
    
    return json({
      courses,
      stats,
      lastUpdate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur chargement données export:', error);
    return json({
      courses: [],
      stats: {
        totalCourses: 0,
        finishedCount: 0,
        upcomingCount: 0,
        categories: [],
        racecourses: [],
        totalPrizeMoney: 0
      },
      lastUpdate: new Date().toISOString()
    });
  }
}

export default function ExportsPage() {
  const { courses, stats, lastUpdate } = useLoaderData<typeof loader>();
  const [exportFormat, setExportFormat] = useState('json');
  const [exportType, setExportType] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: string, type: string) => {
    setIsExporting(true);
    
    try {
      let exportData = courses;
      let filename = 'tunisia-jockey-club-courses';
      
      // Filtrer les données selon le type
      switch (type) {
        case 'finished':
          exportData = courses.filter((race: any) => race.status === 'finished');
          filename += '-terminees';
          break;
        case 'upcoming':
          exportData = courses.filter((race: any) => race.status === 'scheduled');
          filename += '-programmees';
          break;
        case 'stats':
          exportData = stats;
          filename = 'tunisia-jockey-club-statistiques';
          break;
        default:
          filename += '-toutes';
      }
      
      // Générer le contenu selon le format
      let content = '';
      let mimeType = '';
      
      switch (format) {
        case 'json':
          content = JSON.stringify(exportData, null, 2);
          mimeType = 'application/json';
          filename += '.json';
          break;
        case 'csv':
          if (type === 'stats') {
            content = Object.entries(exportData).map(([key, value]) => `${key},${value}`).join('\\n');
          } else {
            const headers = 'ID,Nom,Date,Catégorie,Hippodrome,Statut,Prix\\n';
            const rows = exportData.map((race: any) => 
              `${race.id || ''},${race.name || ''},${race.date || ''},${race.category || ''},${race.racecourse?.name || ''},${race.status || ''},${race.prizeMoney || ''}`
            ).join('\\n');
            content = headers + rows;
          }
          mimeType = 'text/csv';
          filename += '.csv';
          break;
        case 'txt':
          content = type === 'stats' 
            ? Object.entries(exportData).map(([key, value]) => `${key}: ${value}`).join('\\n')
            : exportData.map((race: any, index: number) => 
                `Course ${index + 1}:\\n` +
                `- Nom: ${race.name || 'Non spécifié'}\\n` +
                `- Date: ${race.date ? new Date(race.date).toLocaleDateString('fr-FR') : 'Non spécifiée'}\\n` +
                `- Catégorie: ${race.category || 'Non spécifiée'}\\n` +
                `- Hippodrome: ${race.racecourse?.name || 'Non spécifié'}\\n` +
                `- Statut: ${race.status || 'Non spécifié'}\\n` +
                `- Prix: ${race.prizeMoney ? race.prizeMoney.toLocaleString() + ' TND' : 'Non spécifié'}\\n`
              ).join('\\n---\\n\\n');
          mimeType = 'text/plain';
          filename += '.txt';
          break;
      }
      
      // Créer et télécharger le fichier
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Simuler un délai pour l'UX
      setTimeout(() => {
        setIsExporting(false);
      }, 2000);
      
    } catch (error) {
      console.error('Erreur export:', error);
      setIsExporting(false);
      alert('Erreur lors de l\'export. Veuillez réessayer.');
    }
  };

  const getExportDescription = (type: string) => {
    switch (type) {
      case 'finished': return `${stats.finishedCount} courses terminées avec résultats`;
      case 'upcoming': return `${stats.upcomingCount} courses programmées`;
      case 'stats': return 'Statistiques globales et métriques de performance';
      default: return `${stats.totalCourses} courses (toutes catégories et statuts)`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Exports & Rapports
          </h1>
          <p className="text-gray-600">
            Exportez les données du Tunisia Jockey Club dans différents formats
          </p>
          <div className="text-sm text-gray-500 mt-2">
            Dernière mise à jour: {new Date(lastUpdate).toLocaleString('fr-FR')}
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow border text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalCourses}</div>
            <div className="text-sm text-gray-600">Courses totales</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border text-center">
            <div className="text-2xl font-bold text-green-600">{stats.finishedCount}</div>
            <div className="text-sm text-gray-600">Terminées</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.upcomingCount}</div>
            <div className="text-sm text-gray-600">Programmées</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.categories.length}</div>
            <div className="text-sm text-gray-600">Catégories</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border text-center">
            <div className="text-2xl font-bold text-red-600">{stats.racecourses.length}</div>
            <div className="text-sm text-gray-600">Hippodromes</div>
          </div>
        </div>

        {/* Interface d'export */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Download className="h-5 w-5 mr-2 text-blue-600" />
            Configuration de l'Export
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Type de données */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Type de données
              </h3>
              <div className="space-y-3">
                {[
                  { value: 'all', label: 'Toutes les courses', icon: Table },
                  { value: 'finished', label: 'Courses terminées', icon: CheckCircle },
                  { value: 'upcoming', label: 'Courses programmées', icon: Calendar },
                  { value: 'stats', label: 'Statistiques', icon: BarChart3 }
                ].map(({ value, label, icon: Icon }) => (
                  <label key={value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="exportType"
                      value={value}
                      checked={exportType === value}
                      onChange={(e) => setExportType(e.target.value)}
                      className="mr-3"
                    />
                    <Icon className="h-5 w-5 mr-3 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">{label}</div>
                      <div className="text-sm text-gray-500">{getExportDescription(value)}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Format d'export */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Format d'export
              </h3>
              <div className="space-y-3">
                {[
                  { value: 'json', label: 'JSON', desc: 'Format structuré pour développeurs' },
                  { value: 'csv', label: 'CSV', desc: 'Compatible Excel et tableurs' },
                  { value: 'txt', label: 'TXT', desc: 'Format texte simple lisible' }
                ].map(({ value, label, desc }) => (
                  <label key={value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="exportFormat"
                      value={value}
                      checked={exportFormat === value}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{label}</div>
                      <div className="text-sm text-gray-500">{desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Bouton d'export */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Export sélectionné: <span className="font-medium">{getExportDescription(exportType)}</span> au format <span className="font-medium uppercase">{exportFormat}</span>
              </div>
              <button
                onClick={() => handleExport(exportFormat, exportType)}
                disabled={isExporting}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Exportation...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Aperçu des données */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Table className="h-5 w-5 mr-2 text-green-600" />
            Aperçu des Données
          </h2>
          
          {exportType === 'stats' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Statistiques Générales</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total courses:</span>
                    <span className="font-medium">{stats.totalCourses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Terminées:</span>
                    <span className="font-medium text-green-600">{stats.finishedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Programmées:</span>
                    <span className="font-medium text-yellow-600">{stats.upcomingCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prize money total:</span>
                    <span className="font-medium text-blue-600">{stats.totalPrizeMoney.toLocaleString()} TND</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Répartition</h4>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-gray-600">Catégories:</span>
                    <div className="mt-1">
                      {stats.categories.map((cat: string, i: number) => (
                        <span key={i} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Hippodromes:</span>
                    <div className="mt-1">
                      {stats.racecourses.map((track: string, i: number) => (
                        <span key={i} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                          {track}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hippodrome</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.filter((race: any) => {
                    if (exportType === 'finished') return race.status === 'finished';
                    if (exportType === 'upcoming') return race.status === 'scheduled';
                    return true;
                  }).slice(0, 5).map((race: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{race.name || 'Non spécifié'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {race.date ? new Date(race.date).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{race.category || 'Non spécifiée'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{race.racecourse?.name || 'Non spécifié'}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          race.status === 'finished' ? 'bg-green-100 text-green-800' :
                          race.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {race.status === 'finished' ? 'Terminée' :
                           race.status === 'running' ? 'En cours' : 'Programmée'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {courses.length > 5 && (
                <div className="text-center text-gray-500 text-sm mt-4">
                  ... et {courses.length - 5} autres courses
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
