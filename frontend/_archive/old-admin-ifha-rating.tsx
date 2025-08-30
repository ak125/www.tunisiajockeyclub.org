import { useState, useEffect } from "react";
import { json, type LoaderFunction, type ActionFunction } from "@remix-run/node";
import { useLoaderData, useActionData, Form, useFetcher } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calculator,
  TrendingUp,
  Globe,
  Award,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  BarChart3,
  Target
} from "lucide-react";

interface RatingData {
  horses: any[];
  statistics: any;
  conversionTable: any[];
  internationalReferences: any[];
  recentAdjustments: any[];
}

export const loader: LoaderFunction = async () => {
  try {
    // Simuler les données pour le développement
    const mockData = {
      horses: [
        {
          id: '1',
          name: 'OUARABI AL WALJD',
          currentRating: {
            localRating: 92,
            franceRating: 83,
            ukRating: 183,
            uaeRating: 83,
            ifhaRating: 78,
            confidence: 85,
            isValidated: true,
            racesAnalyzed: 12,
            lastCalculation: '2025-08-25T10:30:00Z'
          }
        },
        {
          id: '2',
          name: 'EMIR DE TUNISIE',
          currentRating: {
            localRating: 90,
            franceRating: 81,
            ukRating: 178,
            uaeRating: 81,
            ifhaRating: 77,
            confidence: 88,
            isValidated: true,
            racesAnalyzed: 15,
            lastCalculation: '2025-08-24T14:20:00Z'
          }
        },
        {
          id: '3',
          name: 'ROI DE CARTHAGE',
          currentRating: {
            localRating: 88,
            franceRating: 79,
            ukRating: 174,
            uaeRating: 79,
            ifhaRating: 75,
            confidence: 76,
            isValidated: false,
            racesAnalyzed: 8,
            lastCalculation: '2025-08-23T09:15:00Z'
          }
        }
      ],
      statistics: {
        totalRatings: 45,
        validatedRatings: 32,
        averageRating: 78.5,
        recentCalculations: 8,
        distribution: {
          '90+': 3,
          '80-89': 12,
          '70-79': 18,
          '60-69': 10,
          '<60': 2
        }
      },
      conversionTable: [
        { tn: 50, fr: 44, uk: 98, uae: 44, ifha: 42, comment: "Listed régional" },
        { tn: 45, fr: 41, uk: 91, uae: 41, ifha: 39, comment: "Bon handicap France" },
        { tn: 40, fr: 37, uk: 82, uae: 37, ifha: 35, comment: "Moyen handicap France" },
        { tn: 35, fr: 33, uk: 74, uae: 33, ifha: 32, comment: "Petit handicap France" },
        { tn: 30, fr: 29, uk: 66, uae: 29, ifha: 28, comment: "Limité international" }
      ],
      internationalReferences: [
        {
          id: '1',
          horseName: 'Baaeed',
          country: 'UK',
          officialRating: 140,
          ifhaRating: 140,
          verified: true,
          category: 'Group1'
        },
        {
          id: '2',
          horseName: 'Dubai Honour',
          country: 'AE',
          officialRating: 110,
          ifhaRating: 108,
          verified: true,
          category: 'Group3'
        }
      ],
      recentAdjustments: [
        {
          id: '1',
          horseName: 'SULTAN DE KAIROUAN',
          oldRating: 85,
          newRating: 87,
          reason: 'Performance excellente dernière course',
          adjustedBy: 'admin',
          date: '2025-08-25T15:30:00Z'
        }
      ]
    };

    return json(mockData);
  } catch (error) {
    console.error('Erreur loader rating IFHA:', error);
    return json({ 
      horses: [], 
      statistics: {}, 
      conversionTable: [],
      internationalReferences: [],
      recentAdjustments: []
    });
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get("action") as string;

  switch (action) {
    case "calculate":
      const horseId = formData.get("horseId") as string;
      // Ici on appellerait l'API backend pour calculer le rating
      return json({ success: true, message: `Rating recalculé pour le cheval ${horseId}` });

    case "validate":
      const ratingId = formData.get("ratingId") as string;
      // Ici on appellerait l'API backend pour valider le rating
      return json({ success: true, message: `Rating ${ratingId} validé avec succès` });

    case "convert":
      const tunisianRating = parseFloat(formData.get("tunisianRating") as string);
      const targetScale = formData.get("targetScale") as string;
      
      // Simulation de la conversion
      let converted = 0;
      switch (targetScale) {
        case 'france':
          converted = Math.round(tunisianRating * 0.9 * 10) / 10;
          break;
        case 'uk':
          converted = Math.round(tunisianRating * 0.9 * 2.2);
          break;
        case 'uae':
          converted = Math.round(tunisianRating * 0.9 * 10) / 10;
          break;
        case 'ifha':
          converted = Math.round(tunisianRating * 0.85 * 10) / 10;
          break;
      }
      
      return json({ 
        success: true, 
        conversion: {
          original: tunisianRating,
          converted,
          scale: targetScale
        }
      });

    case "sync-ifha":
      // Simulation de la synchronisation IFHA
      await new Promise(resolve => setTimeout(resolve, 2000));
      return json({ success: true, message: 'Synchronisation IFHA terminée avec succès' });

    default:
      return json({ error: "Action non reconnue" });
  }
};

export default function IFHARatingManagement() {
  const { horses, statistics, conversionTable, internationalReferences, recentAdjustments } = 
    useLoaderData<RatingData>();
  const actionData = useActionData();
  const fetcher = useFetcher();
  
  const [selectedHorse, setSelectedHorse] = useState<any>(null);
  const [showConverter, setShowConverter] = useState(false);
  const [showReferences, setShowReferences] = useState(false);
  const [tunisianRating, setTunisianRating] = useState("");
  const [targetScale, setTargetScale] = useState("france");
  const [conversionResult, setConversionResult] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValidated, setFilterValidated] = useState<string>("all");

  // Conversion en temps réel
  const handleConversion = async () => {
    if (!tunisianRating) return;
    
    const formData = new FormData();
    formData.append("action", "convert");
    formData.append("tunisianRating", tunisianRating);
    formData.append("targetScale", targetScale);
    
    fetcher.submit(formData, { method: "post" });
  };

  useEffect(() => {
    if (fetcher.data?.conversion) {
      setConversionResult(fetcher.data.conversion);
    }
  }, [fetcher.data]);

  // Filtrage des chevaux
  const filteredHorses = horses.filter(horse => {
    const matchesSearch = horse.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filterValidated === "all" ||
      (filterValidated === "validated" && horse.currentRating?.isValidated) ||
      (filterValidated === "pending" && !horse.currentRating?.isValidated);
    return matchesSearch && matchesFilter;
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 90) return "text-purple-600 bg-purple-100";
    if (rating >= 80) return "text-blue-600 bg-blue-100";
    if (rating >= 70) return "text-green-600 bg-green-100";
    if (rating >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header avec stats */}
      <div className="bg-white shadow-xl border-b-4 border-blue-500">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">
                🌍 Système Rating IFHA
              </h1>
              <p className="text-lg text-gray-600">
                Calcul automatique et harmonisation internationale des ratings
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-black text-xl">
                  🏆
                </div>
                <p className="text-xs text-gray-500 mt-1">Standard</p>
                <p className="text-sm font-bold">IFHA 2025</p>
              </div>
            </div>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Ratings</p>
                  <p className="text-3xl font-black">{statistics.totalRatings}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-200" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Validés IFHA</p>
                  <p className="text-3xl font-black">{statistics.validatedRatings}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-200" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Moyenne</p>
                  <p className="text-3xl font-black">{statistics.averageRating}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-200" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Champions (90+)</p>
                  <p className="text-3xl font-black">{statistics.distribution['90+']}</p>
                </div>
                <Award className="w-8 h-8 text-amber-200" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-slate-500 to-slate-600 rounded-2xl p-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-100 text-sm font-medium">Calculs 7j</p>
                  <p className="text-3xl font-black">{statistics.recentCalculations}</p>
                </div>
                <Calculator className="w-8 h-8 text-slate-200" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowConverter(!showConverter)}
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200 hover:border-blue-400 transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-900">Convertisseur</h3>
                <p className="text-sm text-gray-600">Conversion internationale</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowReferences(!showReferences)}
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-200 hover:border-emerald-400 transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-900">Références</h3>
                <p className="text-sm text-gray-600">Base internationale</p>
              </div>
            </div>
          </motion.button>

          <Form method="post">
            <input type="hidden" name="action" value="sync-ifha" />
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              type="submit"
              disabled={fetcher.state === "submitting"}
              className="w-full bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 hover:border-purple-400 transition-all disabled:opacity-50"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <RefreshCw className={`w-6 h-6 text-white ${fetcher.state === "submitting" ? "animate-spin" : ""}`} />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-gray-900">Sync IFHA</h3>
                  <p className="text-sm text-gray-600">
                    {fetcher.state === "submitting" ? "Synchronisation..." : "Mise à jour auto"}
                  </p>
                </div>
              </div>
            </motion.button>
          </Form>
        </div>

        {/* Convertisseur */}
        <AnimatePresence>
          {showConverter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="bg-white rounded-2xl shadow-xl border p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calculator className="w-6 h-6 mr-3 text-blue-600" />
                  Convertisseur de Rating IFHA
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Input */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Rating Tunisie (20-100)
                      </label>
                      <input
                        type="number"
                        value={tunisianRating}
                        onChange={(e) => setTunisianRating(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-lg font-semibold focus:border-blue-500 focus:bg-white transition-all"
                        placeholder="Ex: 85"
                        min="20"
                        max="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Échelle cible
                      </label>
                      <select
                        value={targetScale}
                        onChange={(e) => setTargetScale(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold focus:border-blue-500 focus:bg-white transition-all"
                      >
                        <option value="france">🇫🇷 France Galop (kg)</option>
                        <option value="uk">🇬🇧 UK BHA (lbs)</option>
                        <option value="uae">🇦🇪 UAE ERA (kg)</option>
                        <option value="ifha">🌍 IFHA International</option>
                      </select>
                    </div>

                    <button
                      onClick={handleConversion}
                      disabled={!tunisianRating || fetcher.state === "submitting"}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all"
                    >
                      {fetcher.state === "submitting" ? "Conversion..." : "🔄 Convertir"}
                    </button>
                  </div>

                  {/* Résultat */}
                  {conversionResult && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6"
                    >
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Résultat de conversion
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                          <span className="font-medium text-gray-700">🇹🇳 Tunisie:</span>
                          <span className="text-2xl font-black text-blue-600">
                            {conversionResult.original}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-200">
                          <span className="font-medium text-gray-700">
                            {targetScale === 'france' && '🇫🇷 France:'}
                            {targetScale === 'uk' && '🇬🇧 UK:'}
                            {targetScale === 'uae' && '🇦🇪 UAE:'}
                            {targetScale === 'ifha' && '🌍 IFHA:'}
                          </span>
                          <span className="text-2xl font-black text-emerald-600">
                            {conversionResult.converted}
                            {targetScale === 'uk' && ' lbs'}
                            {targetScale !== 'uk' && ' kg'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700 font-medium">
                          💡 Cette conversion suit les standards IFHA 2025
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Table de conversion */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    📊 Table de Conversion Standard IFHA
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-left font-bold text-gray-700">🇹🇳 TN</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">🇫🇷 FR</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">🇬🇧 UK</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">🇦🇪 UAE</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">🌍 IFHA</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">Niveau</th>
                        </tr>
                      </thead>
                      <tbody>
                        {conversionTable.map((row, i) => (
                          <tr key={i} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-blue-600">{row.tn}</td>
                            <td className="px-4 py-3">{row.fr}</td>
                            <td className="px-4 py-3">{row.uk}</td>
                            <td className="px-4 py-3">{row.uae}</td>
                            <td className="px-4 py-3 font-semibold text-purple-600">{row.ifha}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{row.comment}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Références internationales */}
        <AnimatePresence>
          {showReferences && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="bg-white rounded-2xl shadow-xl border p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Globe className="w-6 h-6 mr-3 text-emerald-600" />
                    Références Internationales ({internationalReferences.length})
                  </h2>
                  <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                    <Plus className="w-4 h-4 inline mr-2" />
                    Ajouter
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {internationalReferences.map((ref) => (
                    <motion.div
                      key={ref.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-900">{ref.horseName}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                            {ref.country}
                          </span>
                          {ref.verified && (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Rating officiel:</span>
                          <span className="font-bold text-blue-600">{ref.officialRating}</span>
                        </div>
                        {ref.ifhaRating && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">IFHA:</span>
                            <span className="font-bold text-purple-600">{ref.ifhaRating}</span>
                          </div>
                        )}
                        {ref.category && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Catégorie:</span>
                            <span className="font-medium text-gray-800">{ref.category}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Liste des chevaux avec ratings */}
        <div className="bg-white rounded-2xl shadow-xl border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                🐎 Chevaux avec Ratings IFHA ({filteredHorses.length})
              </h2>
            </div>

            {/* Filtres */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher un cheval..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={filterValidated}
                  onChange={(e) => setFilterValidated(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 font-medium"
                >
                  <option value="all">Tous les ratings</option>
                  <option value="validated">✅ Validés IFHA</option>
                  <option value="pending">⏳ En attente</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {filteredHorses.map((horse) => (
                <motion.div
                  key={horse.id}
                  whileHover={{ scale: 1.01 }}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedHorse(horse)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                        {horse.name[0]}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {horse.name}
                        </h3>
                        <div className="flex items-center space-x-3 mt-2">
                          <div className={`px-3 py-1 rounded-full text-sm font-bold ${getRatingColor(horse.currentRating?.localRating || 0)}`}>
                            TN: {horse.currentRating?.localRating || 'N/A'}
                          </div>
                          {horse.currentRating?.franceRating && (
                            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                              🇫🇷 {horse.currentRating.franceRating}
                            </div>
                          )}
                          {horse.currentRating?.ifhaRating && (
                            <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                              🌍 {horse.currentRating.ifhaRating}
                            </div>
                          )}
                          {horse.currentRating?.isValidated ? (
                            <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                              ✅ Validé
                            </div>
                          ) : (
                            <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">
                              ⏳ En attente
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <div className="flex items-center space-x-4">
                        {horse.currentRating?.confidence && (
                          <div className="text-center">
                            <div className="text-xs text-gray-500">Confiance</div>
                            <div className="text-lg font-bold text-gray-700">
                              {horse.currentRating.confidence}%
                            </div>
                          </div>
                        )}
                        {horse.currentRating?.racesAnalyzed && (
                          <div className="text-center">
                            <div className="text-xs text-gray-500">Courses</div>
                            <div className="text-lg font-bold text-gray-700">
                              {horse.currentRating.racesAnalyzed}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        {!horse.currentRating?.isValidated && (
                          <Form method="post" className="inline">
                            <input type="hidden" name="action" value="validate" />
                            <input type="hidden" name="ratingId" value={horse.currentRating?.id} />
                            <button
                              type="submit"
                              className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                            >
                              ✅ Valider
                            </button>
                          </Form>
                        )}
                        
                        <Form method="post" className="inline">
                          <input type="hidden" name="action" value="calculate" />
                          <input type="hidden" name="horseId" value={horse.id} />
                          <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            🔄 Recalculer
                          </button>
                        </Form>
                      </div>
                    </div>
                  </div>

                  {horse.currentRating?.lastCalculation && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Dernière mise à jour: {new Date(horse.currentRating.lastCalculation).toLocaleDateString('fr-FR')} à {new Date(horse.currentRating.lastCalculation).toLocaleTimeString('fr-FR')}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Ajustements récents */}
        {recentAdjustments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-2xl shadow-xl border p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-blue-600" />
              Ajustements Récents
            </h2>

            <div className="space-y-3">
              {recentAdjustments.map((adj) => (
                <div
                  key={adj.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      adj.newRating > adj.oldRating 
                        ? 'bg-emerald-100 text-emerald-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {adj.newRating > adj.oldRating ? '↑' : '↓'}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{adj.horseName}</div>
                      <div className="text-sm text-gray-600">
                        {adj.oldRating} → {adj.newRating} • {adj.adjustedBy}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {new Date(adj.date).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-xs text-gray-400 max-w-xs">
                      {adj.reason}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Messages de feedback */}
      <AnimatePresence>
        {actionData?.success && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-xl shadow-xl max-w-sm"
          >
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5" />
              <p className="font-medium">{actionData.message}</p>
            </div>
          </motion.div>
        )}
        
        {actionData?.error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-xl shadow-xl max-w-sm"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">{actionData.error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
