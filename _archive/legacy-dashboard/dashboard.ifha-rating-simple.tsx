import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

export default function IFHARatingDashboard() {
  const [selectedHorse, setSelectedHorse] = useState<string>("")
  const [conversionScale, setConversionScale] = useState<string>("france")
  const [tunisianRating, setTunisianRating] = useState<string>("70")
  const [calculating, setCalculating] = useState(false)
  
  // Données simulées pour la démonstration
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
        uk: 174.2,
        uae: 79.2,
        ifha: 74.8
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
  ]

  const conversionFactors = {
    france: 0.9,
    uk: 1.98,
    uae: 0.9,
    ifha: 0.85
  }

  const handleCalculateRating = async (horseId: string) => {
    setCalculating(true)
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log(`Calcul du rating pour cheval ${horseId}`)
    } finally {
      setCalculating(false)
    }
  }

  const convertRating = (rating: number, scale: string): number => {
    const factor = conversionFactors[scale as keyof typeof conversionFactors] || 1
    return Math.round(rating * factor * 10) / 10
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "bg-green-500"
    if (confidence >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getScaleName = (scale: string) => {
    const names = {
      france: "France Galop",
      uk: "British Horseracing Authority", 
      uae: "Emirates Racing Authority",
      ifha: "IFHA International"
    }
    return names[scale as keyof typeof names] || scale
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* En-tête */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">🏇</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-800">
              Système de Rating IFHA
            </h1>
          </div>
          <p className="text-slate-600 text-lg">
            Calcul automatisé et conversion internationale des ratings équins
          </p>
        </motion.div>

        {/* Statistiques globales */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-lg">
            <div className="text-2xl font-bold">{mockHorses.length}</div>
            <div className="text-sm opacity-90">Chevaux Ratés</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg shadow-lg">
            <div className="text-2xl font-bold">
              {Math.round(mockHorses.reduce((sum, h) => sum + h.currentRating, 0) / mockHorses.length)}
            </div>
            <div className="text-sm opacity-90">Rating Moyen</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow-lg">
            <div className="text-2xl font-bold">
              {Math.round(mockHorses.reduce((sum, h) => sum + h.confidence, 0) / mockHorses.length)}%
            </div>
            <div className="text-sm opacity-90">Confiance Moyenne</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg shadow-lg">
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm opacity-90">Mises à Jour/Mois</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Convertisseur de Rating */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="mb-4">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <span>🔄</span>
                <span>Convertisseur International</span>
              </h2>
              <p className="text-slate-600 text-sm">
                Convertit les ratings tunisiens vers les standards internationaux
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Rating Tunisien
                  </label>
                  <input
                    type="number"
                    value={tunisianRating}
                    onChange={(e) => setTunisianRating(e.target.value)}
                    min="20"
                    max="150"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-center text-xl font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Échelle Cible
                  </label>
                  <select
                    value={conversionScale}
                    onChange={(e) => setConversionScale(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="france">France Galop</option>
                    <option value="uk">BHA (Royaume-Uni)</option>
                    <option value="uae">ERA (Émirats)</option>
                    <option value="ifha">IFHA International</option>
                  </select>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <div className="text-sm text-slate-600 mb-1">
                  {getScaleName(conversionScale)}
                </div>
                <div className="text-3xl font-bold text-slate-800">
                  {convertRating(parseFloat(tunisianRating) || 0, conversionScale)}
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  Facteur: {conversionFactors[conversionScale as keyof typeof conversionFactors]}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(conversionFactors).map(([scale, factor]) => (
                  <div 
                    key={scale}
                    className={`p-2 rounded border ${
                      scale === conversionScale ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="font-medium capitalize">{scale}</div>
                    <div className="text-lg font-bold">
                      {convertRating(parseFloat(tunisianRating) || 0, scale)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Calculateur Automatique */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="mb-4">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <span>⚡</span>
                <span>Calculateur Automatique</span>
              </h2>
              <p className="text-slate-600 text-sm">
                Calcul basé sur les performances récentes et standards IFHA
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Sélectionner un Cheval
                </label>
                <select
                  value={selectedHorse}
                  onChange={(e) => setSelectedHorse(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choisir un cheval...</option>
                  {mockHorses.map((horse) => (
                    <option key={horse.id} value={horse.id}>
                      {horse.name} (Rating: {horse.currentRating})
                    </option>
                  ))}
                </select>
              </div>
              
              <AnimatePresence>
                {selectedHorse && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 overflow-hidden"
                  >
                    {(() => {
                      const horse = mockHorses.find(h => h.id === selectedHorse)
                      if (!horse) return null
                      
                      return (
                        <>
                          <div className="bg-slate-50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-bold text-xl">{horse.name}</span>
                              <span className={`px-2 py-1 rounded text-white text-xs ${getConfidenceColor(horse.confidence)}`}>
                                {horse.confidence}% confiance
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-slate-600">Rating Actuel:</span>
                                <div className="text-2xl font-bold">{horse.currentRating}</div>
                              </div>
                              <div>
                                <span className="text-slate-600">Courses Analysées:</span>
                                <div className="text-2xl font-bold">{horse.races}</div>
                              </div>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => handleCalculateRating(horse.id)}
                            disabled={calculating}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                          >
                            {calculating ? (
                              <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Calcul en cours...</span>
                              </div>
                            ) : (
                              "Recalculer Rating"
                            )}
                          </button>
                          
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-slate-600">Conversions Internationales</div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {Object.entries(horse.conversions).map(([scale, value]) => (
                                <div key={scale} className="bg-white p-2 rounded border">
                                  <div className="capitalize font-medium">{scale}</div>
                                  <div className="text-lg font-bold text-blue-600">{value}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Liste des Chevaux */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="mb-4">
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <span>📋</span>
              <span>Chevaux Ratés</span>
            </h2>
            <p className="text-slate-600 text-sm">
              Liste complète avec ratings locaux et conversions internationales
            </p>
          </div>
          
          <div className="space-y-3">
            {mockHorses.map((horse, index) => (
              <motion.div
                key={horse.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-bold text-lg">{horse.name}</h3>
                      <span className={`px-2 py-1 rounded text-white text-xs ${getConfidenceColor(horse.confidence)}`}>
                        {horse.confidence}%
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 mt-1">
                      Dernière course: {horse.lastRace} • {horse.races} courses analysées
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {horse.currentRating}
                    </div>
                    <div className="text-sm text-slate-500">TUN</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-3 mt-3 pt-3 border-t">
                  {Object.entries(horse.conversions).map(([scale, value]) => (
                    <div key={scale} className="text-center">
                      <div className="text-xs text-slate-500 uppercase font-medium">
                        {scale}
                      </div>
                      <div className="font-bold text-slate-700">{value}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
