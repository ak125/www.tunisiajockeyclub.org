import * as Icons from "lucide-react";
import { useState } from "react";

// Composant graphique simple (remplace Chart.js pour l'exemple)
function SimpleChart({ data, type = "bar", title }: { 
  data: { label: string; value: number }[];
  type?: "bar" | "line" | "pie";
  title: string;
}) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{item.label}</span>
            <div className="flex items-center gap-3 flex-1 max-w-xs">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function UnifiedAnalyticsModule() {
  const [timeRange, setTimeRange] = useState("month");

  // Données mockées pour l'analytics
  const analyticsStats = [
    { label: "Performances Analysées", value: "1,247", change: "+18%", trend: "up" as const, icon: Icons.BarChart },
    { label: "Chevaux Suivis", value: "127", change: "+5%", trend: "up" as const, icon: Activity },
    { label: "Amélioration Moyenne", value: "12.3%", change: "+2.1%", trend: "up" as const, icon: TrendingUp },
    { label: "Rapports Générés", value: "89", change: "+15", trend: "up" as const, icon: Target }
  ];

  const performanceData = [
    { label: "Janvier", value: 87 },
    { label: "Février", value: 92 },
    { label: "Mars", value: 88 },
    { label: "Avril", value: 94 },
    { label: "Mai", value: 91 },
    { label: "Juin", value: 96 },
    { label: "Juillet", value: 89 },
    { label: "Août", value: 98 }
  ];

  const breedAnalysis = [
    { label: "Pur-sang Arabe", value: 45 },
    { label: "Pur-sang Anglais", value: 38 },
    { label: "Anglo-Arabe", value: 28 },
    { label: "Autre", value: 16 }
  ];

  const jockeyPerformance = [
    { label: "Karim Bouaziz", value: 94 },
    { label: "Ahmed Slimani", value: 91 },
    { label: "Amine Ben Salem", value: 96 },
    { label: "Youssef Gharbi", value: 88 },
    { label: "Moez Karray", value: 85 }
  ];

  const raceTypeAnalysis = [
    { label: "Sprint", value: 156 },
    { label: "Mile", value: 124 },
    { label: "Distance", value: 89 },
    { label: "Handicap", value: 178 }
  ];

  return (
    <div className="space-y-8">
      {/* En-tête de module */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <Icons.BarChart className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Analytics et Rapports</h1>
            <p className="text-indigo-100 mt-2">
              Analyse avancée des performances avec intelligence artificielle intégrée
            </p>
          </div>
        </div>
      </div>

      {/* Contrôles de période */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">Période d'Analyse</h2>
          <div className="flex gap-2">
            {[
              { id: "week", label: "7 Jours" },
              { id: "month", label: "30 Jours" },
              { id: "quarter", label: "3 Mois" },
              { id: "year", label: "1 An" }
            ].map((period) => (
              <button
                key={period.id}
                onClick={() => setTimeRange(period.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  timeRange === period.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsStats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Icons.TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">{stat.change}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart 
          data={performanceData}
          title="Évolution des Performances Mensuelles"
          type="line"
        />
        <SimpleChart 
          data={breedAnalysis}
          title="Analyse par Race de Chevaux"
          type="pie"
        />
      </div>

      {/* Analyses détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart 
          data={jockeyPerformance}
          title="Performance des Icons.Users (Rating Moyen)"
          type="bar"
        />
        <SimpleChart 
          data={raceTypeAnalysis}
          title="Nombre de Icons.MapPins par Type"
          type="bar"
        />
      </div>

      {/* Insights et recommandations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Insights */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-500" />
            Insights Clés
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-green-800">Performance en Hausse</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Les performances moyennes ont augmenté de 12.3% ce mois, principalement 
                    grâce aux améliorations en entraînement.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-blue-800">Tendance Saisonnière</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Les mois d'été montrent généralement de meilleures performances,
                    avec un pic en août (98 points moyens).
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-yellow-800">Opportunité d'Amélioration</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Les courses de distance offrent encore un potentiel d'amélioration
                    avec seulement 89 performances analysées.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommandations */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Icons.PieChart className="h-5 w-5 text-purple-500" />
            Recommandations IA
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-purple-800">Optimisation Entraînement</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    Augmenter l'intensité d'entraînement pour les chevaux de 4-5 ans
                    pourrait améliorer les performances de 8-12%.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-indigo-800">Spécialisation Icons.Users</h4>
                  <p className="text-sm text-indigo-700 mt-1">
                    Certains jockeys excellent dans des types spécifiques de courses.
                    Une meilleure allocation pourrait augmenter les victoires de 15%.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-teal-800">Planification Icons.MapPins</h4>
                  <p className="text-sm text-teal-700 mt-1">
                    Programmer plus de courses handicap pourrait maximiser
                    la participation et les revenus (+23% estimé).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200">
            <Icons.BarChart className="h-5 w-5" />
            Générer Rapport Complet
          </button>
          <button className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200">
            <Icons.TrendingUp className="h-5 w-5" />
            Analyser Tendances
          </button>
          <button className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200">
            <Icons.Users className="h-5 w-5" />
            Comparer Performances
          </button>
        </div>
      </div>
    </div>
  );
}
