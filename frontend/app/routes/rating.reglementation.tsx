import { useState } from "react";
import { 
  BookOpen, 
  Calculator, 
  Scale, 
  Target,
  FileText,
  Clock,
  Info,
  ChevronDown,
  ChevronUp,
  Award,
  TrendingUp,
  Users,
  CheckCircle
} from "lucide-react";

export default function RatingReglementation() {
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: BookOpen },
    { id: "criteria", label: "Critères", icon: Target },
    { id: "calculation", label: "Calcul", icon: Calculator },
    { id: "process", label: "Processus", icon: Clock },
    { id: "examples", label: "Exemples", icon: FileText },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* En-tête officiel */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white rounded-lg p-8">
              <div className="flex items-start space-x-4">
                <Award className="h-10 w-10 text-yellow-300 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold mb-3">
                    Méthode Officielle de Calcul du Rating des Chevaux de Plat en Tunisie
                  </h2>
                  <p className="text-blue-100 text-lg mb-4">
                    Système harmonisé avec les standards internationaux - Approuvé par la Fédération Tunisienne des Courses de Chevaux
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-300" />
                      <span>Conforme aux normes IFHA</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-300" />
                      <span>Basé sur le système Galop français</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-300" />
                      <span>Adapté aux spécificités tunisiennes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Définition et Objectifs */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection('definition')}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Target className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Définition et Objectifs du Rating</h3>
                </div>
                {expandedSections.includes('definition') ? 
                  <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                }
              </button>
              {expandedSections.includes('definition') && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="space-y-4 mt-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Qu'est-ce que le Rating ?</h4>
                      <p className="text-blue-800">
                        Le rating est une valeur numérique qui exprime la performance d'un cheval à un moment donné. 
                        Il représente la capacité estimée du cheval à porter un certain poids sur une distance donnée 
                        dans des conditions normales de course.
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-green-900 mb-3">Objectifs Principaux</h4>
                        <ul className="space-y-2 text-green-800">
                          <li className="flex items-start space-x-2">
                            <Scale className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Égaliser les chances entre les chevaux</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <Users className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Faciliter la constitution des lots</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Suivre l'évolution des performances</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <Award className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Améliorer l'attractivité des courses</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h4 className="font-semibold text-purple-900 mb-3">Échelle de Valeurs</h4>
                        <div className="space-y-2 text-purple-800">
                          <div className="flex justify-between">
                            <span>Chevaux débutants:</span>
                            <span className="font-mono font-semibold">20-40</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Niveau moyen:</span>
                            <span className="font-mono font-semibold">40-60</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Bons chevaux:</span>
                            <span className="font-mono font-semibold">60-80</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Très bons chevaux:</span>
                            <span className="font-mono font-semibold">80-100</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Champions:</span>
                            <span className="font-mono font-semibold">100-140</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section Principes de Base */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection('principes')}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Principes de Base du Système Tunisien</h3>
                </div>
                {expandedSections.includes('principes') ? 
                  <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                }
              </button>
              {expandedSections.includes('principes') && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="space-y-4 mt-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Info className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-lg font-semibold text-yellow-800 mb-2">Adaptation du Modèle Français</h4>
                          <p className="text-yellow-700">
                            Le système tunisien s'inspire directement de la méthodologie développée par France Galop, 
                            reconnue mondialement pour sa précision et sa fiabilité. Des adaptations ont été apportées 
                            pour tenir compte des spécificités locales.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-3">Mise à Jour Continue</h4>
                        <p className="text-blue-800 text-sm mb-3">
                          Le rating évolue après chaque course en fonction de la performance réalisée 
                          par rapport à la performance attendue.
                        </p>
                        <ul className="text-blue-700 text-sm space-y-1">
                          <li>• Calcul immédiat post-course</li>
                          <li>• Validation dans les 24h</li>
                          <li>• Publication officielle</li>
                        </ul>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-green-900 mb-3">Prise en Compte Globale</h4>
                        <p className="text-green-800 text-sm mb-3">
                          Tous les facteurs influençant la performance sont intégrés 
                          dans le calcul pour assurer la justesse de l'évaluation.
                        </p>
                        <ul className="text-green-700 text-sm space-y-1">
                          <li>• Conditions de piste</li>
                          <li>• Qualité de l'opposition</li>
                          <li>• Distance et type d'épreuve</li>
                        </ul>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-4">
                        <h4 className="font-semibold text-purple-900 mb-3">Transparence Totale</h4>
                        <p className="text-purple-800 text-sm mb-3">
                          La méthode de calcul est publique et documentée pour garantir 
                          la confiance de tous les acteurs des courses.
                        </p>
                        <ul className="text-purple-700 text-sm space-y-1">
                          <li>• Formules accessibles</li>
                          <li>• Historique consultable</li>
                          <li>• Explications détaillées</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section Harmonisation Internationale */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection('harmonisation')}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Scale className="h-6 w-6 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Harmonisation avec les Standards Internationaux</h3>
                </div>
                {expandedSections.includes('harmonisation') ? 
                  <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                }
              </button>
              {expandedSections.includes('harmonisation') && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="space-y-4 mt-4">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold text-indigo-900 mb-3">Reconnaissance Internationale</h4>
                      <p className="text-indigo-800 mb-4">
                        Le système tunisien est reconnu par l'International Federation of Horseracing Authorities (IFHA) 
                        et permet les comparaisons avec les ratings internationaux.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-indigo-900 mb-2">Équivalences</h5>
                          <ul className="text-indigo-700 text-sm space-y-1">
                            <li>Rating 100 TUN = Rating 100 FR</li>
                            <li>Rating 80 TUN ≈ Rating 85 AUS</li>
                            <li>Rating 90 TUN ≈ Rating 105 USA</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-indigo-900 mb-2">Avantages</h5>
                          <ul className="text-indigo-700 text-sm space-y-1">
                            <li>• Échanges facilités</li>
                            <li>• Comparaisons fiables</li>
                            <li>• Crédibilité renforcée</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "criteria":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-2">Critères d'Évaluation Officiels</h2>
              <p className="text-green-100">
                Facteurs pris en compte dans le calcul du rating selon la méthode officielle tunisienne
              </p>
            </div>

            {/* Critères de Performance */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection('performance')}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">1. Critères de Performance en Course</h3>
                </div>
                {expandedSections.includes('performance') ? 
                  <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                }
              </button>
              {expandedSections.includes('performance') && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="space-y-4 mt-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-3">Classement Final</h4>
                        <p className="text-blue-800 text-sm mb-3">
                          Position d'arrivée du cheval, facteur principal du calcul du rating.
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>1ère place:</span>
                            <span className="font-mono text-green-600">+5 à +10 points</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>2ème place:</span>
                            <span className="font-mono text-blue-600">+2 à +5 points</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>3ème place:</span>
                            <span className="font-mono text-yellow-600">0 à +2 points</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Hors podium:</span>
                            <span className="font-mono text-red-600">-1 à -5 points</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-green-900 mb-3">Marge de Victoire/Défaite</h4>
                        <p className="text-green-800 text-sm mb-3">
                          Distance qui sépare le cheval du vainqueur ou du suivant, mesurée en longueurs.
                        </p>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Victoire large (3+ longueurs):</span>
                            <span className="text-green-600 ml-2">Bonus supplémentaire</span>
                          </div>
                          <div>
                            <span className="font-medium">Victoire courte (1 longueur):</span>
                            <span className="text-blue-600 ml-2">Bonus standard</span>
                          </div>
                          <div>
                            <span className="font-medium">Défaite de peu:</span>
                            <span className="text-yellow-600 ml-2">Pénalité réduite</span>
                          </div>
                          <div>
                            <span className="font-medium">Défaite importante:</span>
                            <span className="text-red-600 ml-2">Pénalité majeure</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-900 mb-3">Temps de Course et Allures</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <h5 className="font-medium text-purple-800 mb-2">Temps Absolu</h5>
                          <p className="text-purple-700 text-sm">
                            Comparaison avec le record de la piste et les temps de référence historiques.
                          </p>
                        </div>
                        <div>
                          <h5 className="font-medium text-purple-800 mb-2">Temps Relatif</h5>
                          <p className="text-purple-700 text-sm">
                            Performance par rapport aux autres participants de la même course.
                          </p>
                        </div>
                        <div>
                          <h5 className="font-medium text-purple-800 mb-2">Allures de Course</h5>
                          <p className="text-purple-700 text-sm">
                            Régularité du rythme et capacité d'accélération dans la ligne droite.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Critères de Conditions */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection('conditions')}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Scale className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900">2. Conditions de Course</h3>
                </div>
                {expandedSections.includes('conditions') ? 
                  <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                }
              </button>
              {expandedSections.includes('conditions') && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="space-y-4 mt-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-3">Distance de Course</h4>
                        <div className="space-y-3">
                          <div className="bg-white rounded p-3">
                            <h5 className="font-medium text-blue-800">Sprint (1000-1400m)</h5>
                            <p className="text-blue-700 text-sm">Coefficient: 1.05 - Favorise l'accélération</p>
                          </div>
                          <div className="bg-white rounded p-3">
                            <h5 className="font-medium text-blue-800">Mile (1500-1800m)</h5>
                            <p className="text-blue-700 text-sm">Coefficient: 1.00 - Distance de référence</p>
                          </div>
                          <div className="bg-white rounded p-3">
                            <h5 className="font-medium text-blue-800">Moyen Fond (1900-2400m)</h5>
                            <p className="text-blue-700 text-sm">Coefficient: 0.95 - Endurance primordiale</p>
                          </div>
                          <div className="bg-white rounded p-3">
                            <h5 className="font-medium text-blue-800">Fond (2500m+)</h5>
                            <p className="text-blue-700 text-sm">Coefficient: 0.90 - Stamina essentielle</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-green-900 mb-3">État de la Piste</h4>
                        <div className="space-y-3">
                          <div className="bg-white rounded p-3">
                            <h5 className="font-medium text-green-800">Piste Bonne</h5>
                            <p className="text-green-700 text-sm">Conditions optimales - Coefficient: 1.00</p>
                          </div>
                          <div className="bg-white rounded p-3">
                            <h5 className="font-medium text-green-800">Piste Souple</h5>
                            <p className="text-green-700 text-sm">Légèrement humide - Coefficient: 0.98</p>
                          </div>
                          <div className="bg-white rounded p-3">
                            <h5 className="font-medium text-green-800">Piste Lourde</h5>
                            <p className="text-green-700 text-sm">Très détrempée - Coefficient: 0.95</p>
                          </div>
                          <div className="bg-white rounded p-3">
                            <h5 className="font-medium text-green-800">Piste Très Lourde</h5>
                            <p className="text-green-700 text-sm">Conditions extrêmes - Coefficient: 0.90</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-900 mb-3">Type et Niveau d'Épreuve</h4>
                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="bg-gradient-to-b from-yellow-400 to-yellow-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2 font-bold">
                            G1
                          </div>
                          <h5 className="font-semibold text-orange-800">Groupe I</h5>
                          <p className="text-orange-700 text-sm">Coefficient: 1.15</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-gradient-to-b from-gray-300 to-gray-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2 font-bold">
                            G2
                          </div>
                          <h5 className="font-semibold text-orange-800">Groupe II</h5>
                          <p className="text-orange-700 text-sm">Coefficient: 1.10</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-gradient-to-b from-amber-600 to-amber-800 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2 font-bold">
                            G3
                          </div>
                          <h5 className="font-semibold text-orange-800">Groupe III</h5>
                          <p className="text-orange-700 text-sm">Coefficient: 1.05</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-gradient-to-b from-blue-400 to-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2 font-bold">
                            L
                          </div>
                          <h5 className="font-semibold text-orange-800">Listed</h5>
                          <p className="text-orange-700 text-sm">Coefficient: 1.03</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Critères Individuels */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection('individuels')}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-900">3. Facteurs Individuels du Cheval</h3>
                </div>
                {expandedSections.includes('individuels') ? 
                  <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                }
              </button>
              {expandedSections.includes('individuels') && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="space-y-4 mt-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h4 className="font-semibold text-purple-900 mb-3">Âge du Cheval</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>2 ans:</span>
                            <span className="font-mono text-green-600">+10 points</span>
                          </div>
                          <div className="flex justify-between">
                            <span>3 ans:</span>
                            <span className="font-mono text-green-600">+5 points</span>
                          </div>
                          <div className="flex justify-between">
                            <span>4 ans:</span>
                            <span className="font-mono text-yellow-600">+2 points</span>
                          </div>
                          <div className="flex justify-between">
                            <span>5 ans:</span>
                            <span className="font-mono text-gray-600">0 points</span>
                          </div>
                          <div className="flex justify-between">
                            <span>6 ans+:</span>
                            <span className="font-mono text-red-600">-2 points</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-pink-50 rounded-lg p-4">
                        <h4 className="font-semibold text-pink-900 mb-3">Sexe</h4>
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-medium text-pink-800">Pouliches 3 ans</h5>
                            <p className="text-pink-700 text-sm">+3 points face aux mâles</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-pink-800">Juments 4 ans</h5>
                            <p className="text-pink-700 text-sm">+2 points face aux mâles</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-pink-800">Juments 5 ans+</h5>
                            <p className="text-pink-700 text-sm">+1 point face aux mâles</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-indigo-50 rounded-lg p-4">
                        <h4 className="font-semibold text-indigo-900 mb-3">Poids Porté</h4>
                        <div className="space-y-2">
                          <p className="text-indigo-800 text-sm mb-2">
                            Ajustement selon l'écart au poids de référence (56 kg):
                          </p>
                          <div className="space-y-1 text-sm">
                            <div>Pour chaque kg au-dessus: <span className="font-mono text-green-600">+1 point</span></div>
                            <div>Pour chaque kg en dessous: <span className="font-mono text-red-600">-1 point</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "calculation":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-2">Méthode de Calcul Officielle</h2>
              <p className="text-purple-100">
                Formules mathématiques et procédures utilisées par le système tunisien
              </p>
            </div>

            {/* Formule Principale */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection('formule-base')}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Calculator className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Formule de Base du Rating</h3>
                </div>
                {expandedSections.includes('formule-base') ? 
                  <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                }
              </button>
              {expandedSections.includes('formule-base') && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="space-y-6 mt-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                      <h4 className="text-lg font-semibold text-blue-900 mb-4">Formule Générale</h4>
                      <div className="bg-white rounded-lg p-6 mb-4 border border-blue-100">
                        <div className="text-center">
                          <code className="text-xl font-mono text-gray-800 block mb-2">
                            Rating<sub>nouveau</sub> = Rating<sub>ancien</sub> + K × (P<sub>réalisée</sub> - P<sub>attendue</sub>)
                          </code>
                          <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm text-blue-800">
                            <div className="text-center">
                              <strong>K</strong> = Coefficient d'ajustement (0.3 à 0.7)
                            </div>
                            <div className="text-center">
                              <strong>P<sub>réalisée</sub></strong> = Performance en course
                            </div>
                            <div className="text-center">
                              <strong>P<sub>attendue</sub></strong> = Performance prévue
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h5 className="font-semibold text-blue-900 mb-3">Coefficient K Variable</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Jeunes chevaux (2-3 ans):</span>
                              <span className="font-mono">K = 0.6-0.7</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Chevaux confirmés (4-6 ans):</span>
                              <span className="font-mono">K = 0.4-0.5</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Vétérans (7 ans+):</span>
                              <span className="font-mono">K = 0.3-0.4</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-indigo-50 rounded-lg p-4">
                          <h5 className="font-semibold text-indigo-900 mb-3">Calcul de la Performance</h5>
                          <div className="space-y-2 text-sm text-indigo-800">
                            <div>
                              <strong>P<sub>réalisée</sub> =</strong> Rating de base + bonus position + ajustements
                            </div>
                            <div>
                              <strong>P<sub>attendue</sub> =</strong> Moyenne pondérée du lot
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Calcul du Rating Initial */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection('rating-initial')}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Award className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Calcul du Rating Initial</h3>
                </div>
                {expandedSections.includes('rating-initial') ? 
                  <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                }
              </button>
              {expandedSections.includes('rating-initial') && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="space-y-4 mt-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-green-900 mb-3">Chevaux sans Origines</h4>
                        <div className="bg-white rounded-lg p-4">
                          <div className="text-center">
                            <code className="text-lg font-mono text-green-700">Rating = 40</code>
                          </div>
                        </div>
                        <p className="text-green-800 text-sm mt-2">
                          Rating de base pour les chevaux sans pedigree connu ou chevaux importés sans historique.
                        </p>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-3">Avec Origines Connues</h4>
                        <div className="bg-white rounded-lg p-4 mb-3">
                          <code className="text-sm font-mono text-blue-700 block text-center">
                            Rating = (R<sub>père</sub> + R<sub>mère</sub>) / 2 + B<sub>lignée</sub>
                          </code>
                        </div>
                        <div className="space-y-2 text-sm text-blue-800">
                          <div>B<sub>lignée</sub> selon la qualité:</div>
                          <div className="ml-2">• Excellente: +5 points</div>
                          <div className="ml-2">• Bonne: +3 points</div>
                          <div className="ml-2">• Moyenne: +1 point</div>
                          <div className="ml-2">• Faible: -2 points</div>
                        </div>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-4">
                        <h4 className="font-semibold text-purple-900 mb-3">Chevaux Importés</h4>
                        <div className="bg-white rounded-lg p-4 mb-3">
                          <code className="text-sm font-mono text-purple-700 block text-center">
                            Rating = R<sub>origine</sub> × C<sub>pays</sub>
                          </code>
                        </div>
                        <div className="space-y-2 text-sm text-purple-800">
                          <div>Coefficients par pays:</div>
                          <div className="ml-2">• France: 1.00</div>
                          <div className="ml-2">• Maroc: 0.95</div>
                          <div className="ml-2">• Algérie: 0.90</div>
                          <div className="ml-2">• Autres: 0.85</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Coefficients et Ajustements */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection('coefficients')}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Scale className="h-6 w-6 text-orange-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Coefficients et Ajustements Détaillés</h3>
                </div>
                {expandedSections.includes('coefficients') ? 
                  <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                }
              </button>
              {expandedSections.includes('coefficients') && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="space-y-6 mt-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-orange-50 rounded-lg p-4">
                        <h4 className="font-semibold text-orange-900 mb-4">Coefficients de Distance</h4>
                        <div className="overflow-hidden rounded-lg border border-orange-200">
                          <table className="min-w-full bg-white">
                            <thead className="bg-orange-100">
                              <tr>
                                <th className="px-3 py-2 text-left text-sm font-medium text-orange-900">Distance</th>
                                <th className="px-3 py-2 text-right text-sm font-medium text-orange-900">Coefficient</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-orange-200">
                              <tr><td className="px-3 py-2 text-sm">1000-1200m</td><td className="px-3 py-2 text-right text-sm font-mono">1.05</td></tr>
                              <tr><td className="px-3 py-2 text-sm">1300-1400m</td><td className="px-3 py-2 text-right text-sm font-mono">1.02</td></tr>
                              <tr><td className="px-3 py-2 text-sm">1500-1600m</td><td className="px-3 py-2 text-right text-sm font-mono">1.00</td></tr>
                              <tr><td className="px-3 py-2 text-sm">1700-1800m</td><td className="px-3 py-2 text-right text-sm font-mono">0.98</td></tr>
                              <tr><td className="px-3 py-2 text-sm">1900-2100m</td><td className="px-3 py-2 text-right text-sm font-mono">0.95</td></tr>
                              <tr><td className="px-3 py-2 text-sm">2200-2400m</td><td className="px-3 py-2 text-right text-sm font-mono">0.92</td></tr>
                              <tr><td className="px-3 py-2 text-sm">2500m+</td><td className="px-3 py-2 text-right text-sm font-mono">0.88</td></tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-4">Ajustements d'Âge et Sexe</h4>
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-medium text-blue-800 mb-2">Coefficients d'Âge</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between"><span>2 ans (Jan-Juin):</span><span className="font-mono">+12 points</span></div>
                              <div className="flex justify-between"><span>2 ans (Juil-Déc):</span><span className="font-mono">+8 points</span></div>
                              <div className="flex justify-between"><span>3 ans:</span><span className="font-mono">+4 points</span></div>
                              <div className="flex justify-between"><span>4 ans:</span><span className="font-mono">+1 point</span></div>
                              <div className="flex justify-between"><span>5+ ans:</span><span className="font-mono">0 points</span></div>
                            </div>
                          </div>

                          <div>
                            <h5 className="font-medium text-blue-800 mb-2">Décharge Femelles</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between"><span>Pouliches 2 ans:</span><span className="font-mono">+2 points</span></div>
                              <div className="flex justify-between"><span>Pouliches 3 ans:</span><span className="font-mono">+3 points</span></div>
                              <div className="flex justify-between"><span>Juments 4 ans+:</span><span className="font-mono">+1.5 points</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-4">Formule Complète d'Ajustement</h4>
                      <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <code className="text-lg font-mono text-gray-800 block text-center mb-4">
                          Rating<sub>final</sub> = (Rating<sub>base</sub> + Ajust<sub>âge</sub> + Ajust<sub>sexe</sub>) × Coeff<sub>distance</sub> × Coeff<sub>piste</sub> × Coeff<sub>épreuve</sub>
                        </code>
                        <div className="text-sm text-gray-600 text-center">
                          Avec limitation des variations à ±10 points maximum par course
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "process":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Processus de Mise à Jour</h3>

            <div className="grid gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">1</div>
                  <h4 className="text-lg font-semibold text-green-900">Analyse de la Course</h4>
                </div>
                <p className="text-green-700 mb-3">
                  Immédiatement après chaque course, l'équipe technique analyse:
                </p>
                <ul className="space-y-2 text-green-600 text-sm">
                  <li>• Les temps réalisés par tous les participants</li>
                  <li>• Les conditions de piste et météorologiques</li>
                  <li>• Les incidents de course éventuels</li>
                  <li>• La qualité du lot de concurrents</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">2</div>
                  <h4 className="text-lg font-semibold text-blue-900">Calcul des Nouveaux Ratings</h4>
                </div>
                <p className="text-blue-700 mb-3">
                  Application de la formule officielle pour chaque participant:
                </p>
                <div className="bg-white rounded-lg p-4 mb-3">
                  <code className="text-sm font-mono text-gray-800">
                    Nouveau_Rating = Ancien_Rating + (Performance_réalisée - Performance_attendue) × 0.5
                  </code>
                </div>
                <p className="text-blue-600 text-sm">
                  Le coefficient 0.5 peut être ajusté selon le niveau de l'épreuve et la fiabilité des données.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">3</div>
                  <h4 className="text-lg font-semibold text-purple-900">Validation et Publication</h4>
                </div>
                <p className="text-purple-700 mb-3">
                  Contrôle qualité et mise en ligne des nouveaux ratings:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-purple-800 mb-2">Contrôles automatiques:</h5>
                    <ul className="space-y-1 text-purple-600 text-sm">
                      <li>• Variation maximum de ±10 points</li>
                      <li>• Cohérence avec l'historique</li>
                      <li>• Validation des données de course</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-purple-800 mb-2">Publication:</h5>
                    <ul className="space-y-1 text-purple-600 text-sm">
                      <li>• Mise à jour dans les 24h</li>
                      <li>• Notification aux entraîneurs</li>
                      <li>• Publication sur le site officiel</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">4</div>
                  <h4 className="text-lg font-semibold text-orange-900">Suivi et Ajustements</h4>
                </div>
                <p className="text-orange-700 mb-3">
                  Surveillance continue et ajustements si nécessaire:
                </p>
                <ul className="space-y-2 text-orange-600 text-sm">
                  <li>• Révision mensuelle des ratings généraux</li>
                  <li>• Ajustement des coefficients selon les statistiques</li>
                  <li>• Harmonisation avec les standards internationaux</li>
                  <li>• Formation continue des équipes techniques</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "examples":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-700 to-green-600 text-white rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-2">Exemples Pratiques de Calcul</h2>
              <p className="text-green-100">
                Cas concrets d'application de la méthode officielle tunisienne
              </p>
            </div>

            {/* Exemple 1: Victoire Logique */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection('exemple1')}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Award className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Exemple 1: Victoire d'un Favori Logique</h3>
                </div>
                {expandedSections.includes('exemple1') ? 
                  <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                }
              </button>
              {expandedSections.includes('exemple1') && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="space-y-4 mt-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 mb-3">Cas d'étude: "Salam Tunis"</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-green-800 mb-3">Données avant la course</h5>
                          <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                            <div className="flex justify-between"><span>Nom:</span><span className="font-semibold">Salam Tunis</span></div>
                            <div className="flex justify-between"><span>Âge:</span><span>4 ans</span></div>
                            <div className="flex justify-between"><span>Sexe:</span><span>Mâle</span></div>
                            <div className="flex justify-between"><span>Rating avant:</span><span className="font-mono font-bold text-green-600">75</span></div>
                            <div className="flex justify-between"><span>Distance:</span><span>1600m</span></div>
                            <div className="flex justify-between"><span>Poids:</span><span>57 kg (+1 kg)</span></div>
                            <div className="flex justify-between"><span>Type:</span><span>Groupe III</span></div>
                            <div className="flex justify-between"><span>Piste:</span><span>Bonne</span></div>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-green-800 mb-3">Résultat de la course</h5>
                          <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                            <div className="flex justify-between"><span>Classement:</span><span className="font-bold text-green-600">1er</span></div>
                            <div className="flex justify-between"><span>Marge:</span><span>1.5 longueurs</span></div>
                            <div className="flex justify-between"><span>Temps:</span><span>1:37.25</span></div>
                            <div className="flex justify-between"><span>Qualité du lot:</span><span>Moyenne: 72</span></div>
                            <div className="flex justify-between"><span>Performance attendue:</span><span className="font-mono">75</span></div>
                            <div className="flex justify-between"><span>Performance réalisée:</span><span className="font-mono">77</span></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <h4 className="font-semibold text-gray-900 mb-3">Calcul détaillé du nouveau rating</h4>
                      <div className="space-y-3">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-blue-50 rounded p-3">
                            <h5 className="font-medium text-blue-900 mb-2">Ajustements appliqués</h5>
                            <div className="space-y-1 text-sm text-blue-800">
                              <div>• Coefficient âge (4 ans): +1 point</div>
                              <div>• Coefficient distance (1600m): ×1.00</div>
                              <div>• Coefficient type (G3): ×1.05</div>
                              <div>• Coefficient poids (+1kg): +1 point</div>
                              <div>• Coefficient piste (bonne): ×1.00</div>
                            </div>
                          </div>
                          
                          <div className="bg-green-50 rounded p-3">
                            <h5 className="font-medium text-green-900 mb-2">Calcul final</h5>
                            <div className="space-y-1 text-sm font-mono text-green-800">
                              <div>Rating avant = 75</div>
                              <div>K = 0.4 (cheval confirmé)</div>
                              <div>Écart = 77 - 75 = +2</div>
                              <div>Ajustement = 0.4 × 2 = +0.8</div>
                              <div className="font-bold text-green-600">Nouveau rating = 75 + 0.8 = 75.8 ≈ 76</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700">
                            <strong>Conclusion:</strong> Victoire logique du favori avec une performance légèrement supérieure 
                            à l'attendu. Le rating progresse modérément (+1 point), ce qui est cohérent avec le profil 
                            d'un cheval confirmé qui gagne comme prévu.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Exemple 2: Surprise d'un Outsider */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection('exemple2')}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Exemple 2: Performance Exceptionnelle d'un Outsider</h3>
                </div>
                {expandedSections.includes('exemple2') ? 
                  <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                }
              </button>
              {expandedSections.includes('exemple2') && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="space-y-4 mt-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-3">Cas d'étude: "Nour El Ain"</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-blue-800 mb-3">Données avant la course</h5>
                          <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                            <div className="flex justify-between"><span>Nom:</span><span className="font-semibold">Nour El Ain</span></div>
                            <div className="flex justify-between"><span>Âge:</span><span>3 ans</span></div>
                            <div className="flex justify-between"><span>Sexe:</span><span>Pouliche</span></div>
                            <div className="flex justify-between"><span>Rating avant:</span><span className="font-mono font-bold text-blue-600">58</span></div>
                            <div className="flex justify-between"><span>Distance:</span><span>2000m</span></div>
                            <div className="flex justify-between"><span>Poids:</span><span>54 kg (-2 kg)</span></div>
                            <div className="flex justify-between"><span>Type:</span><span>Listed</span></div>
                            <div className="flex justify-between"><span>Piste:</span><span>Souple</span></div>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-blue-800 mb-3">Résultat de la course</h5>
                          <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                            <div className="flex justify-between"><span>Classement:</span><span className="font-bold text-green-600">1ère</span></div>
                            <div className="flex justify-between"><span>Marge:</span><span>3 longueurs</span></div>
                            <div className="flex justify-between"><span>Temps:</span><span>2:05.15 (record)</span></div>
                            <div className="flex justify-between"><span>Qualité du lot:</span><span>Moyenne: 68</span></div>
                            <div className="flex justify-between"><span>Performance attendue:</span><span className="font-mono">58</span></div>
                            <div className="flex justify-between"><span>Performance réalisée:</span><span className="font-mono">72</span></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <h4 className="font-semibold text-gray-900 mb-3">Calcul détaillé du nouveau rating</h4>
                      <div className="space-y-3">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-purple-50 rounded p-3">
                            <h5 className="font-medium text-purple-900 mb-2">Ajustements appliqués</h5>
                            <div className="space-y-1 text-sm text-purple-800">
                              <div>• Coefficient âge (3 ans): +4 points</div>
                              <div>• Coefficient sexe (pouliche): +3 points</div>
                              <div>• Coefficient distance (2000m): ×0.95</div>
                              <div>• Coefficient type (Listed): ×1.03</div>
                              <div>• Coefficient poids (-2kg): -2 points</div>
                              <div>• Coefficient piste (souple): ×0.98</div>
                              <div>• Bonus performance exceptionnelle: +2</div>
                            </div>
                          </div>
                          
                          <div className="bg-blue-50 rounded p-3">
                            <h5 className="font-medium text-blue-900 mb-2">Calcul final</h5>
                            <div className="space-y-1 text-sm font-mono text-blue-800">
                              <div>Rating avant = 58</div>
                              <div>K = 0.6 (jeune cheval)</div>
                              <div>Écart = 72 - 58 = +14</div>
                              <div>Ajustement = 0.6 × 14 = +8.4</div>
                              <div>Limité à +8 points maximum</div>
                              <div className="font-bold text-blue-600">Nouveau rating = 58 + 8 = 66</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700">
                            <strong>Conclusion:</strong> Performance exceptionnelle d'une pouliche de 3 ans qui dépasse 
                            largement les attentes. La progression importante (+8 points) reflète cette performance 
                            remarquable tout en respectant la limite de variation maximale.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Exemple 3: Contre-performance */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection('exemple3')}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-red-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Exemple 3: Contre-performance d'un Champion</h3>
                </div>
                {expandedSections.includes('exemple3') ? 
                  <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                }
              </button>
              {expandedSections.includes('exemple3') && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="space-y-4 mt-4">
                    <div className="bg-red-50 rounded-lg p-4">
                      <h4 className="font-semibold text-red-900 mb-3">Cas d'étude: "Roi de Carthage"</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-red-800 mb-3">Données avant la course</h5>
                          <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                            <div className="flex justify-between"><span>Nom:</span><span className="font-semibold">Roi de Carthage</span></div>
                            <div className="flex justify-between"><span>Âge:</span><span>6 ans</span></div>
                            <div className="flex justify-between"><span>Sexe:</span><span>Mâle</span></div>
                            <div className="flex justify-between"><span>Rating avant:</span><span className="font-mono font-bold text-red-600">92</span></div>
                            <div className="flex justify-between"><span>Distance:</span><span>1400m</span></div>
                            <div className="flex justify-between"><span>Poids:</span><span>60 kg (+4 kg)</span></div>
                            <div className="flex justify-between"><span>Type:</span><span>Groupe I</span></div>
                            <div className="flex justify-between"><span>Piste:</span><span>Lourde</span></div>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-red-800 mb-3">Résultat de la course</h5>
                          <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                            <div className="flex justify-between"><span>Classement:</span><span className="font-bold text-red-600">7ème/10</span></div>
                            <div className="flex justify-between"><span>Marge:</span><span>12 longueurs</span></div>
                            <div className="flex justify-between"><span>Temps:</span><span>1:28.90 (décevant)</span></div>
                            <div className="flex justify-between"><span>Qualité du lot:</span><span>Moyenne: 85</span></div>
                            <div className="flex justify-between"><span>Performance attendue:</span><span className="font-mono">92</span></div>
                            <div className="flex justify-between"><span>Performance réalisée:</span><span className="font-mono">78</span></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-red-200">
                      <h4 className="font-semibold text-gray-900 mb-3">Calcul détaillé du nouveau rating</h4>
                      <div className="space-y-3">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-orange-50 rounded p-3">
                            <h5 className="font-medium text-orange-900 mb-2">Ajustements appliqués</h5>
                            <div className="space-y-1 text-sm text-orange-800">
                              <div>• Coefficient âge (6 ans): -2 points</div>
                              <div>• Coefficient distance (1400m): ×1.02</div>
                              <div>• Coefficient type (G1): ×1.15</div>
                              <div>• Coefficient poids (+4kg): +4 points</div>
                              <div>• Coefficient piste (lourde): ×0.95</div>
                              <div>• Pénalité méforme: -1 point</div>
                            </div>
                          </div>
                          
                          <div className="bg-red-50 rounded p-3">
                            <h5 className="font-medium text-red-900 mb-2">Calcul final</h5>
                            <div className="space-y-1 text-sm font-mono text-red-800">
                              <div>Rating avant = 92</div>
                              <div>K = 0.3 (vétéran)</div>
                              <div>Écart = 78 - 92 = -14</div>
                              <div>Ajustement = 0.3 × (-14) = -4.2</div>
                              <div>Arrondi à -4 points</div>
                              <div className="font-bold text-red-600">Nouveau rating = 92 - 4 = 88</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700">
                            <strong>Conclusion:</strong> Contre-performance significative d'un champion confirmé. 
                            La baisse modérée (-4 points) prend en compte la difficulté des conditions (piste lourde, 
                            surpoids important) et le fait que les chevaux expérimentés ont des coefficients d'ajustement plus faibles.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Règles importantes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Info className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-lg font-semibold text-yellow-900 mb-3">Règles Importantes à Retenir</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-yellow-800 mb-2">Limitations du Système</h5>
                      <ul className="space-y-1 text-sm text-yellow-700">
                        <li>• Variation maximale: ±10 points par course</li>
                        <li>• Minimum 3 courses pour rating définitif</li>
                        <li>• Révision tous les 6 mois pour inactifs</li>
                        <li>• Rating plancher: 20 points</li>
                        <li>• Rating plafond: 140 points</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-yellow-800 mb-2">Facteurs Exceptionnels</h5>
                      <ul className="space-y-1 text-sm text-yellow-700">
                        <li>• Incidents de course: ajustement possible</li>
                        <li>• Conditions météo extrêmes: coefficient spécial</li>
                        <li>• Première sortie après arrêt: coefficient réduit</li>
                        <li>• Changement d'entraîneur: période d'adaptation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Contenu non trouvé</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Méthode Officielle de Calcul du Rating
              </h1>
              <p className="text-gray-600 mt-1">
                Système de handicap des chevaux de plat en Tunisie
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Mis à jour le {new Date().toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
}
