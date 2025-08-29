import { useLoaderData } from "@remix-run/react";
import { 
  BookOpen, 
  Calculator, 
  Scale, 
  Target,
  FileText,
  Clock,
  Info
} from "lucide-react";
import { useState } from "react";

export async function loader({ request }: import("@remix-run/node").LoaderFunctionArgs) {
  return {
    title: "Méthode Officielle de Calcul du Rating",
    subtitle: "Système de handicap des chevaux de plat en Tunisie",
    lastUpdate: new Date().toISOString(),
  };
}

export default function RatingRegulation() {
  const { title, subtitle } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: BookOpen },
    { id: "criteria", label: "Critères", icon: Target },
    { id: "calculation", label: "Calcul", icon: Calculator },
    { id: "process", label: "Processus", icon: Clock },
    { id: "examples", label: "Exemples", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl font-bold mb-4">{title}</h1>
            <p className="text-xl opacity-90 mb-2">{subtitle}</p>
            <div className="flex items-center justify-center gap-2 text-sm opacity-75">
              <Info className="w-4 h-4" />
              <span>Conforme aux standards internationaux de France Galop et du BHA</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 bg-white p-2 rounded-lg shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Vue d'ensemble */}
          {activeTab === "overview" && (
            <div className="animate-fade-in space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="flex items-center gap-2 text-2xl font-bold text-blue-700 mb-4">
                  <Scale className="w-6 h-6" />
                  Contexte et Standards Internationaux
                </h2>
                
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  La Tunisie applique une méthode de handicap rating conforme aux principes internationaux. 
                  Depuis 1912, le code des courses tunisien s'inspire du modèle français, garantissant une 
                  évaluation équitable et standardisée des performances équines.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Principes fondamentaux</h4>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Valeur en kilogrammes:</strong> Note chiffrée représentant le niveau du cheval (20-55 kg)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Objectif:</strong> Égaliser les chances dans les courses à handicap</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Mise à jour continue:</strong> Ajustement après chaque performance</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Transparence:</strong> Publication officielle sous 48h</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-slate-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-4">Échelles comparatives</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Tunisie/France</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">20-55 kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">UK (BHA)</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">0-140 lbs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Conversion</span>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">1 kg ≈ 2.2 lbs</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mt-8">
                  <h5 className="font-semibold text-blue-800 mb-2">Commission des Handicapeurs</h5>
                  <p className="text-blue-700">
                    Une commission de 2-3 experts analyse chaque course pour garantir l'objectivité des évaluations. 
                    Les décisions sont collégiales et basées sur des critères techniques précis.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Critères */}
          {activeTab === "criteria" && (
            <div className="animate-fade-in space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-blue-700 mb-6">Critères Pris en Compte</h2>
                
                <div className="space-y-8">
                  {/* Critère 1 */}
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h4 className="text-lg font-semibold mb-3">1. Place et écart à l'arrivée</h4>
                    <p className="text-gray-700 mb-4">
                      La distance en longueurs séparant les chevaux est l'indicateur principal:
                    </p>
                    
                    <div className="bg-white border rounded-lg p-4">
                      <h5 className="font-semibold mb-4">Table de conversion (1 longueur = X kg)</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          { distance: "1200m", conversion: "2.0 kg" },
                          { distance: "1400m", conversion: "1.5 kg" },
                          { distance: "1600m", conversion: "1.25 kg" },
                          { distance: "1800-2000m", conversion: "1.0 kg" },
                          { distance: "2400m", conversion: "0.67 kg" },
                          { distance: "3000m+", conversion: "0.5 kg" }
                        ].map((item, index) => (
                          <div key={index} className="text-center p-3 bg-slate-50 rounded-lg">
                            <div className="text-lg font-bold text-blue-600">{item.distance}</div>
                            <div className="text-sm text-gray-600">{item.conversion}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Critère 2 */}
                  <div className="border-l-4 border-green-500 pl-6">
                    <h4 className="text-lg font-semibold mb-3">2. Poids porté en course</h4>
                    <p className="text-gray-700">
                      Le handicapeur ajuste la valeur selon le poids effectivement porté. 
                      Un cheval gagnant avec 2kg de plus qu'un rival obtient un bonus équivalent.
                    </p>
                  </div>

                  {/* Critère 3 */}
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h4 className="text-lg font-semibold mb-3">3. Niveau de la course (classe)</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h6 className="font-semibold mb-3">Catégories principales:</h6>
                        <ul className="space-y-1 text-gray-600">
                          <li>• Groupe I, II, III</li>
                          <li>• Listed</li>
                          <li>• Handicaps</li>
                          <li>• Conditions</li>
                          <li>• Maiden</li>
                          <li>• Réclamer</li>
                        </ul>
                      </div>
                      <div>
                        <h6 className="font-semibold mb-3">Ajustements types:</h6>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Groupe I</span>
                            <span className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">+3.0 kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Groupe II</span>
                            <span className="bg-orange-500 text-white px-2 py-1 rounded text-sm">+2.0 kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Groupe III</span>
                            <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">+1.0 kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Listed</span>
                            <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">+0.5 kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Handicap</span>
                            <span className="bg-gray-400 text-white px-2 py-1 rounded text-sm">0 kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Maiden</span>
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">-1.0 kg</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Calcul */}
          {activeTab === "calculation" && (
            <div className="animate-fade-in space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-blue-700 mb-6">Méthode de Calcul Détaillée</h2>
                
                <div className="space-y-8">
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Attribution du rating initial</h4>
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                      <p className="font-medium text-yellow-800">
                        <strong>Prérequis:</strong> Minimum 3 courses publiques ou 1 victoire pour obtenir un rating officiel
                      </p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-lg font-semibold mb-3">Formule de base</h5>
                    <div className="bg-gray-100 border border-gray-300 p-4 rounded-lg font-mono text-sm">
                      Rating Performance = Rating Référence + Ajustement Écart + Ajustement Poids + Ajustements Contextuels
                    </div>
                  </div>

                  <div>
                    <h5 className="text-lg font-semibold mb-3">Valeurs plancher conventionnelles</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="font-bold text-blue-700">Mâle 3 ans maiden</div>
                        <div className="text-2xl font-bold text-blue-600">30.0 kg</div>
                      </div>
                      <div className="text-center p-4 bg-pink-50 rounded-lg">
                        <div className="font-bold text-pink-700">Femelle 3 ans maiden</div>
                        <div className="text-2xl font-bold text-pink-600">28.5 kg</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="font-bold text-green-700">Mâle 4 ans maiden</div>
                        <div className="text-2xl font-bold text-green-600">32.0 kg</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="font-bold text-purple-700">Femelle 4 ans maiden</div>
                        <div className="text-2xl font-bold text-purple-600">30.5 kg</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Processus */}
          {activeTab === "process" && (
            <div className="animate-fade-in space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-blue-700 mb-6">Processus d'Attribution et de Révision</h2>
                
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-300"></div>
                  
                  <div className="space-y-8">
                    {[
                      {
                        step: "Étape 1: Course disputée",
                        description: "Enregistrement des résultats officiels: positions, écarts, poids, conditions",
                        color: "bg-blue-500"
                      },
                      {
                        step: "Étape 2: Analyse technique (24h)",
                        description: "Les handicapeurs analysent la vidéo, les écarts, le déroulement de course",
                        color: "bg-green-500"
                      },
                      {
                        step: "Étape 3: Commission d'évaluation (48h)",
                        description: "Réunion collégiale pour valider les ajustements proposés",
                        color: "bg-purple-500"
                      },
                      {
                        step: "Étape 4: Publication officielle",
                        description: "Mise à jour des ratings sur le site officiel et bulletin des courses",
                        color: "bg-orange-500"
                      },
                      {
                        step: "Étape 5: Application",
                        description: "Les nouveaux ratings s'appliquent aux prochains engagements",
                        color: "bg-red-500"
                      }
                    ].map((item, index) => (
                      <div key={index} className="relative flex items-start gap-6">
                        <div className={`relative z-10 w-4 h-4 ${item.color} rounded-full border-4 border-white shadow-lg flex-shrink-0 mt-1`}></div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-800 mb-2">{item.step}</h4>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Exemples */}
          {activeTab === "examples" && (
            <div className="animate-fade-in space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-blue-700 mb-6">Exemple Pratique de Calcul</h2>
                
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4">Situation initiale</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="text-left p-3 border">Cheval</th>
                          <th className="text-center p-3 border">Rating avant course</th>
                          <th className="text-center p-3 border">Poids porté</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-3 border font-medium">Cheval A</td>
                          <td className="text-center p-3 border">30.0 kg</td>
                          <td className="text-center p-3 border">56 kg</td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="p-3 border font-medium">Cheval B</td>
                          <td className="text-center p-3 border">28.0 kg</td>
                          <td className="text-center p-3 border">56 kg</td>
                        </tr>
                        <tr>
                          <td className="p-3 border font-medium">Cheval C</td>
                          <td className="text-center p-3 border">30.0 kg</td>
                          <td className="text-center p-3 border">56 kg</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <h4 className="text-lg font-semibold mt-6 mb-3">Résultat de la course (1600m)</h4>
                  <ol className="space-y-1">
                    <li><strong>1er - Cheval A:</strong> Gagne de 1 longueur</li>
                    <li><strong>2e - Cheval B:</strong> À 1 longueur</li>
                    <li><strong>3e - Cheval C:</strong> À 5 longueurs</li>
                  </ol>
                  
                  <h4 className="text-lg font-semibold mt-6 mb-3">Analyse du handicapeur</h4>
                  <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm space-y-3">
                    <p><strong>Cheval A:</strong> Victoire moins nette que prévu (2kg théoriques vs 1 longueur = 1.25kg sur 1600m)</p>
                    <p>→ Rating ajusté: <span className="text-green-600 font-bold">30.5 kg (+0.5)</span></p>
                    
                    <p className="mt-2"><strong>Cheval B:</strong> Surperformance (ne concède que 1.25kg au lieu de 2kg)</p>
                    <p>→ Rating ajusté: <span className="text-blue-600 font-bold">29.0 kg (+1.0)</span></p>
                    
                    <p className="mt-2"><strong>Cheval C:</strong> Contre-performance nette (5 longueurs = 6.25kg d'écart)</p>
                    <p>→ Rating ajusté: <span className="text-red-600 font-bold">28.0 kg (-2.0)</span></p>
                  </div>
                  
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-6">
                    <p className="font-medium text-green-800">
                      <strong>Résultat:</strong> Les nouveaux ratings reflètent mieux les performances réelles. 
                      Lors de la prochaine course, B recevra 1.5kg de A au lieu de 2kg.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center bg-slate-100 p-6 rounded-lg">
          <p className="text-slate-600 mb-1">© 2025 Tunisia Jockey Club - Système de Rating Officiel</p>
          <p className="text-sm text-slate-500">Conforme aux standards internationaux IFHA</p>
        </div>
      </div>
    </div>
  );
}
