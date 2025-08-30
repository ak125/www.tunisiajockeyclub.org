import { json, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useActionData, useFetcher } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createRatingSecureLoader } from "../utils/auth.server";

type ActionData = 
  | { success: true; conversion: string; message: string }
  | { error: string };

type FetcherData = ActionData | undefined;

export const loader = createRatingSecureLoader(async ({ context }) => {
  // En production, récupérer les données depuis l'API backend
  const mockHorses = [
    {
      id: "1",
      name: "OUARABI AL WALJD",
      currentRating: 92,
      confidence: 85,
      lastRace: "2024-03-15",
      races: 12,
      conversions: {
        france: 82.8,
        uk: 182.2,
        uae: 82.8,
        ifha: 78.2
      }
    },
    {
      id: "2", 
      name: "EMIR DE TUNISIE",
      currentRating: 88,
      confidence: 78,
      lastRace: "2024-03-10",
      races: 8,
      conversions: {
        france: 79.2,
        uk: 174.4,
        uae: 79.2,
        ifha: 75.1
      }
    },
    {
      id: "3",
      name: "ROI DE CARTHAGE",
      currentRating: 85,
      confidence: 82,
      lastRace: "2024-03-20",
      races: 15,
      conversions: {
        france: 76.5,
        uk: 168.3,
        uae: 76.5,
        ifha: 72.3
      }
    }
  ];

  return json({ 
    user: context.user,
    horses: mockHorses 
  });
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const actionType = formData.get("actionType") as string;
  
  if (actionType === "calculateRating") {
    const tunisianRating = Number(formData.get("tunisianRating"));
    const conversionScale = formData.get("conversionScale") as string;
    
    // Logique de conversion IFHA simplifiée
    let convertedRating = tunisianRating;
    switch (conversionScale) {
      case "france":
        convertedRating = tunisianRating * 0.9;
        break;
      case "uk":
        convertedRating = (tunisianRating + 40) * 2.2;
        break;
      case "uae":
        convertedRating = tunisianRating * 0.9;
        break;
      case "ifha":
        convertedRating = tunisianRating * 0.85;
        break;
    }
    
    return json({ 
      success: true,
      conversion: convertedRating.toFixed(1),
      message: `Rating converti: ${convertedRating.toFixed(1)} (${conversionScale.toUpperCase()})`
    });
  }
  
  return json({ error: "Action non reconnue" });
}

export default function AdminRatingDashboard() {
  const { horses } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const fetcher = useFetcher<ActionData>();

  const [selectedHorse, setSelectedHorse] = useState<string>("")
  const [conversionScale, setConversionScale] = useState<string>("france")
  const [tunisianRating, setTunisianRating] = useState<string>("70")
  const [calculating, setCalculating] = useState(false)
  const [conversionResult, setConversionResult] = useState<string>("")
  
  // Échelles de conversion IFHA
  const conversionScales = [
    { value: "france", label: "France (Handicap)", factor: 0.9 },
    { value: "uk", label: "UK (BHA)", factor: 2.2, offset: 40 },
    { value: "uae", label: "UAE", factor: 0.9 },
    { value: "ifha", label: "IFHA International", factor: 0.85 }
  ];

  const handleConversion = async () => {
    setCalculating(true);
    
    const formData = new FormData();
    formData.append("actionType", "calculateRating");
    formData.append("tunisianRating", tunisianRating);
    formData.append("conversionScale", conversionScale);
    
    fetcher.submit(formData, { method: "post" });
    
    setTimeout(() => {
      setCalculating(false);
    }, 1500);
  };

  // Utiliser le résultat du fetcher si disponible
  useEffect(() => {
    if (fetcher.data && 'conversion' in fetcher.data && !conversionResult) {
      setConversionResult(fetcher.data.conversion);
    }
  }, [fetcher.data, conversionResult]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🏆 Système de Rating IFHA
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Gestion et conversion des ratings internationaux des chevaux de course selon les standards IFHA.
        </p>
      </motion.div>

      {/* Banner de sécurité */}
      <motion.div
        className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-amber-700">
              <strong>Accès restreint :</strong> Cette interface est réservée aux Super Administrateurs et aux Handicapeurs agréés uniquement.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Calculateur de Conversion */}
        <motion.div 
          className="xl:col-span-1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              🧮 Calculateur IFHA
            </h2>
            
            <div className="space-y-6">
              {/* Rating Tunisien */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating Tunisien
                </label>
                <input
                  type="number"
                  value={tunisianRating}
                  onChange={(e) => setTunisianRating(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ex: 75"
                  min="40"
                  max="120"
                />
              </div>

              {/* Échelle de Conversion */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Échelle de Conversion
                </label>
                <select
                  value={conversionScale}
                  onChange={(e) => setConversionScale(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {conversionScales.map((scale) => (
                    <option key={scale.value} value={scale.value}>
                      {scale.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bouton Conversion */}
              <button
                onClick={handleConversion}
                disabled={calculating || !tunisianRating}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {calculating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Calcul en cours...
                  </div>
                ) : (
                  "Convertir Rating"
                )}
              </button>

              {/* Résultat */}
              <AnimatePresence>
                {(conversionResult || (actionData && 'conversion' in actionData)) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {conversionResult || (actionData && 'conversion' in actionData ? actionData.conversion : '')}
                      </div>
                      <div className="text-sm text-green-700">
                        {conversionScales.find(s => s.value === conversionScale)?.label}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Messages d'état */}
              {actionData && 'success' in actionData && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">{actionData.message}</p>
                </div>
              )}

              {actionData && 'error' in actionData && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">{actionData.error}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Liste des Chevaux */}
        <motion.div 
          className="xl:col-span-2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              🏇 Chevaux avec Ratings IFHA
            </h2>
            
            <div className="grid gap-6">
              {horses.map((horse, index) => (
                <motion.div
                  key={horse.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedHorse === horse.id 
                      ? 'border-blue-500 bg-blue-50 shadow-lg' 
                      : 'border-gray-200 bg-gray-50 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedHorse(selectedHorse === horse.id ? "" : horse.id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{horse.name}</h3>
                      <p className="text-gray-600">{horse.races} courses • Dernière: {horse.lastRace}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">{horse.currentRating}</div>
                      <div className="text-sm text-gray-500">Rating TN</div>
                      <div className="flex items-center mt-1">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{width: `${horse.confidence}%`}}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{horse.confidence}%</span>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedHorse === horse.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="border-t border-gray-300 pt-4 mt-4">
                          <h4 className="font-semibold text-gray-800 mb-3">Conversions IFHA:</h4>
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(horse.conversions).map(([scale, rating]) => (
                              <div key={scale} className="bg-white p-3 rounded-lg border border-gray-200">
                                <div className="text-sm font-medium text-gray-600 uppercase">{scale}</div>
                                <div className="text-lg font-bold text-gray-800">{rating}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Information Footer */}
      <motion.div 
        className="mt-8 p-6 bg-white rounded-lg shadow-md border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📊 Standards IFHA
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
          <div>
            <strong>France (Handicap):</strong> Système français traditionnel avec facteur de conversion 0.9
          </div>
          <div>
            <strong>UK (BHA):</strong> British Horseracing Authority, conversion: (Rating + 40) × 2.2
          </div>
          <div>
            <strong>UAE:</strong> Émirats Arabes Unis, même échelle que la France
          </div>
          <div>
            <strong>IFHA International:</strong> Standard mondial unifié, facteur 0.85
          </div>
        </div>
      </motion.div>
    </div>
  );
}
