import { 
  Calculator, 
  Weight,
  Target,
  TrendingUp,
  Info,
  Save,
  RotateCcw
} from "lucide-react";
import { useState } from "react";

export default function RatingCalculateur() {
  const [formData, setFormData] = useState({
    horseId: "",
    horseName: "",
    age: 3,
    sex: "male", // male, female
    weight: 55,
    distance: 1600,
    position: 1,
    totalRunners: 8,
    raceTime: "1:38.50",
    trackCondition: "good", // good, soft, heavy
    raceType: "conditions", // group1, group2, group3, listed, handicap, conditions
    previousRating: 65,
    margin: 0.5 // longueurs
  });

  const [result, setResult] = useState<{
    newRating: number;
    adjustment: number;
    breakdown: {
      baseRating: number;
      performanceAdjustment: number;
      ageAdjustment: number;
      sexAdjustment: number;
      distanceAdjustment: number;
      raceTypeBonus: number;
    };
  } | null>(null);

  const [isCalculating, setIsCalculating] = useState(false);

  // Coefficients et tables de référence
  const distanceCoefficients = {
    1000: 1.00, 1100: 1.00, 1200: 1.00,
    1300: 0.98, 1400: 0.98, 1500: 0.98,
    1600: 0.95, 1700: 0.95, 1800: 0.95,
    1900: 0.92, 2000: 0.92, 2100: 0.92,
    2200: 0.90, 2300: 0.90, 2400: 0.90,
    2500: 0.87, 2600: 0.87, 2700: 0.87, 2800: 0.87
  };

  const ageAdjustments = {
    2: 8, 3: 4, 4: 2, 5: 0, 6: -1, 7: -2, 8: -3
  };

  const raceTypeBonuses = {
    group1: 5, group2: 3, group3: 2, listed: 1, handicap: 0, conditions: 0
  };

  const calculateRating = () => {
    setIsCalculating(true);
    
    // Simulation d'un calcul avec délai
    setTimeout(() => {
      const baseRating = formData.previousRating;
      
      // Ajustement de performance basé sur la position et la marge
      const expectedPerformance = baseRating;
      let actualPerformance = baseRating;
      
      // Calcul selon la position
      if (formData.position === 1) {
        actualPerformance += 5 + (formData.margin * 2);
      } else if (formData.position === 2) {
        actualPerformance += 2 - (formData.margin * 1);
      } else if (formData.position === 3) {
        actualPerformance -= 1 - (formData.margin * 0.5);
      } else {
        actualPerformance -= (formData.position - 1) * 2;
      }
      
      const performanceAdjustment = (actualPerformance - expectedPerformance) * 0.5;
      
      // Ajustements selon l'âge
      const ageAdjustment = ageAdjustments[formData.age as keyof typeof ageAdjustments] || 0;
      
      // Ajustement sexe (décharge pour les femelles)
      const sexAdjustment = formData.sex === "female" ? 2 : 0;
      
      // Coefficient de distance
      const distanceCoeff = distanceCoefficients[formData.distance as keyof typeof distanceCoefficients] || 0.95;
      const distanceAdjustment = (1 - distanceCoeff) * 5;
      
      // Bonus type de course
      const raceTypeBonus = raceTypeBonuses[formData.raceType as keyof typeof raceTypeBonuses] || 0;
      
      const newRating = Math.round(
        baseRating + 
        performanceAdjustment + 
        ageAdjustment + 
        sexAdjustment + 
        distanceAdjustment + 
        raceTypeBonus
      );
      
      const totalAdjustment = newRating - baseRating;
      
      setResult({
        newRating,
        adjustment: totalAdjustment,
        breakdown: {
          baseRating,
          performanceAdjustment: Math.round(performanceAdjustment * 10) / 10,
          ageAdjustment,
          sexAdjustment,
          distanceAdjustment: Math.round(distanceAdjustment * 10) / 10,
          raceTypeBonus
        }
      });
      
      setIsCalculating(false);
    }, 1000);
  };

  const resetForm = () => {
    setFormData({
      horseId: "",
      horseName: "",
      age: 3,
      sex: "male",
      weight: 55,
      distance: 1600,
      position: 1,
      totalRunners: 8,
      raceTime: "1:38.50",
      trackCondition: "good",
      raceType: "conditions",
      previousRating: 65,
      margin: 0.5
    });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <Calculator className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Calculateur de Rating
              </h1>
              <p className="text-gray-600">
                Calculez le nouveau rating d'un cheval après une course
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Données de Course</h2>
            
            <div className="space-y-6">
              {/* Informations du cheval */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du cheval
                  </label>
                  <input
                    type="text"
                    value={formData.horseName}
                    onChange={(e) => setFormData({...formData, horseName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Étoile du Sud"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating précédent
                  </label>
                  <input
                    type="number"
                    value={formData.previousRating}
                    onChange={(e) => setFormData({...formData, previousRating: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    min="20"
                    max="140"
                  />
                </div>
              </div>

              {/* Âge et sexe */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Âge
                  </label>
                  <select
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[2,3,4,5,6,7,8].map(age => (
                      <option key={age} value={age}>{age} ans</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sexe
                  </label>
                  <select
                    value={formData.sex}
                    onChange={(e) => setFormData({...formData, sex: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="male">Male/Hongre</option>
                    <option value="female">Femelle</option>
                  </select>
                </div>
              </div>

              {/* Poids et distance */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Weight className="h-4 w-4 inline mr-1" />
                    Poids (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    min="45"
                    max="65"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distance (m)
                  </label>
                  <select
                    value={formData.distance}
                    onChange={(e) => setFormData({...formData, distance: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.keys(distanceCoefficients).map(dist => (
                      <option key={dist} value={dist}>{dist}m</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Résultat de course */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Target className="h-4 w-4 inline mr-1" />
                    Position
                  </label>
                  <input
                    type="number"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max="20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de partants
                  </label>
                  <input
                    type="number"
                    value={formData.totalRunners}
                    onChange={(e) => setFormData({...formData, totalRunners: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    min="2"
                    max="20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marge (longueurs)
                  </label>
                  <input
                    type="number"
                    value={formData.margin}
                    onChange={(e) => setFormData({...formData, margin: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="20"
                    step="0.1"
                  />
                </div>
              </div>

              {/* Type de course et état de piste */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de course
                  </label>
                  <select
                    value={formData.raceType}
                    onChange={(e) => setFormData({...formData, raceType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="group1">Groupe I</option>
                    <option value="group2">Groupe II</option>
                    <option value="group3">Groupe III</option>
                    <option value="listed">Listed</option>
                    <option value="handicap">Handicap</option>
                    <option value="conditions">Conditions</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    État de la piste
                  </label>
                  <select
                    value={formData.trackCondition}
                    onChange={(e) => setFormData({...formData, trackCondition: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="good">Bonne</option>
                    <option value="soft">Souple</option>
                    <option value="heavy">Lourde</option>
                  </select>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={calculateRating}
                  disabled={isCalculating}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isCalculating ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Calcul en cours...</span>
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4" />
                      <span>Calculer le Rating</span>
                    </>
                  )}
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Résultats */}
          <div className="space-y-6">
            {/* Résultat principal */}
            {result && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Résultat du Calcul</h2>
                
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">
                        {formData.previousRating}
                      </div>
                      <div className="text-sm text-gray-500">Rating précédent</div>
                    </div>
                    <TrendingUp className={`h-8 w-8 ${result.adjustment >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {result.newRating}
                      </div>
                      <div className="text-sm text-gray-500">Nouveau rating</div>
                    </div>
                  </div>
                  <div className={`text-lg font-medium mt-2 ${result.adjustment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {result.adjustment >= 0 ? '+' : ''}{result.adjustment} points
                  </div>
                </div>

                {/* Détail des ajustements */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-900">Détail des Ajustements</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Rating de base</span>
                      <span className="font-mono">{result.breakdown.baseRating}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Ajustement performance</span>
                      <span className={`font-mono ${result.breakdown.performanceAdjustment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {result.breakdown.performanceAdjustment >= 0 ? '+' : ''}{result.breakdown.performanceAdjustment}
                      </span>
                    </div>
                    
                    {result.breakdown.ageAdjustment !== 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Coefficient d'âge</span>
                        <span className={`font-mono ${result.breakdown.ageAdjustment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {result.breakdown.ageAdjustment >= 0 ? '+' : ''}{result.breakdown.ageAdjustment}
                        </span>
                      </div>
                    )}
                    
                    {result.breakdown.sexAdjustment !== 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Décharge femelle</span>
                        <span className="font-mono text-green-600">+{result.breakdown.sexAdjustment}</span>
                      </div>
                    )}
                    
                    {result.breakdown.distanceAdjustment !== 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Coefficient distance</span>
                        <span className={`font-mono ${result.breakdown.distanceAdjustment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {result.breakdown.distanceAdjustment >= 0 ? '+' : ''}{result.breakdown.distanceAdjustment}
                        </span>
                      </div>
                    )}
                    
                    {result.breakdown.raceTypeBonus !== 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Bonus type course</span>
                        <span className="font-mono text-green-600">+{result.breakdown.raceTypeBonus}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  className="w-full mt-6 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Sauvegarder le Rating</span>
                </button>
              </div>
            )}

            {/* Aide */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    Comment utiliser ce calculateur
                  </h3>
                  <ul className="space-y-2 text-blue-700 text-sm">
                    <li>• Saisissez les informations de base du cheval (nom, âge, sexe, rating précédent)</li>
                    <li>• Indiquez les conditions de la course (distance, type, état de piste)</li>
                    <li>• Renseignez le résultat (position, marge, nombre de partants)</li>
                    <li>• Le système applique automatiquement la méthode officielle tunisienne</li>
                    <li>• Le nouveau rating est calculé avec le détail des ajustements</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
