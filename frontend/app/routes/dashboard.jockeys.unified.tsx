import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { 
  UnifiedSearchBar, 
  UnifiedFilterBar, 
  UnifiedCard, 
  UnifiedTable, 
  UnifiedStatsGrid 
} from "~/components/unified/UnifiedComponents";

export default function JockeysUnifiedModule() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Données mockées pour les jockeys
  const jockeysStats = [
    { label: "Icons.Users Licenciés", value: "45", change: "+3", trend: "up" as const, icon: Users },
    { label: "Victoires ce Mois", value: "127", change: "+18%", trend: "up" as const, icon: Trophy },
    { label: "Taux de Réussite", value: "67.8%", change: "+2.1%", trend: "up" as const, icon: TrendingUp },
    { label: "Icons.MapPins à Venir", value: "32", change: "+8", trend: "up" as const, icon: Calendar }
  ];

  const filters = [
    { id: "all", label: "Tous", count: 45 },
    { id: "active", label: "Actifs", count: 38 },
    { id: "apprentice", label: "Apprentis", count: 12 },
    { id: "senior", label: "Seniors", count: 26 },
    { id: "champion", label: "Champions", count: 7 }
  ];

  const jockeysData = [
    {
      id: "1",
      name: "Karim Bouaziz",
      age: 28,
      experience: "8 ans",
      weight: "52 kg",
      victories: 156,
      races: 342,
      winRate: "45.6%",
      currentRating: "94.2",
      lastRace: "2025-08-25",
      status: "Actif",
      specialty: "Sprint",
      license: "PRO-001"
    },
    {
      id: "2",
      name: "Ahmed Slimani", 
      age: 31,
      experience: "12 ans",
      weight: "54 kg",
      victories: 203,
      races: 467,
      winRate: "43.5%",
      currentRating: "91.8",
      lastRace: "2025-08-23",
      status: "Actif",
      specialty: "Distance",
      license: "PRO-005"
    },
    {
      id: "3",
      name: "Youssef Gharbi",
      age: 24,
      experience: "4 ans", 
      weight: "51 kg",
      victories: 87,
      races: 198,
      winRate: "44.0%",
      currentRating: "88.5",
      lastRace: "2025-08-20",
      status: "Actif",
      specialty: "Polyvalent",
      license: "PRO-012"
    },
    {
      id: "4",
      name: "Amine Ben Salem",
      age: 35,
      experience: "16 ans",
      weight: "55 kg", 
      victories: 312,
      races: 689,
      winRate: "45.3%",
      currentRating: "96.1",
      lastRace: "2025-08-27",
      status: "Champion",
      specialty: "Handicap",
      license: "PRO-002"
    }
  ];

  const tableColumns = [
    { key: "name", label: "Nom" },
    { key: "age", label: "Âge" },
    { key: "experience", label: "Expérience" },
    { key: "weight", label: "Poids" },
    { key: "victories", label: "Victoires" },
    { key: "winRate", label: "Taux Succès" },
    { key: "currentRating", label: "Rating" },
    { key: "status", label: "Statut" }
  ];

  const tableActions = [
    { label: "Profil Complet", onClick: (row: any) => console.log("Profil:", row.name), icon: Users },
    { label: "Historique", onClick: (row: any) => console.log("Historique:", row.name), icon: Calendar }
  ];

  // Fonction de recherche
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    console.log("Recherche:", term);
  };

  // Fonction de filtrage
  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    console.log("Filtre actif:", filterId);
  };

  return (
    <div className="space-y-8">
      {/* En-tête de module */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <Icons.Users className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Gestion des Icons.Users</h1>
            <p className="text-blue-100 mt-2">
              Système unifié de gestion des jockeys avec suivi des performances et licences
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <UnifiedStatsGrid stats={jockeysStats} />

      {/* Barre de recherche et filtres */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <UnifiedSearchBar 
              onSearch={handleSearch}
              placeholder="Rechercher un jockey par nom, licence, spécialité..."
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200">
            + Nouveau Icons.User
          </button>
        </div>
        
        <UnifiedFilterBar 
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Cartes de jockeys vedettes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jockeysData.slice(0, 3).map((jockey) => (
          <UnifiedCard
            key={jockey.id}
            title={jockey.name}
            subtitle={`${jockey.experience} d'expérience • ${jockey.weight}`}
            description={`Spécialité: ${jockey.specialty} | Licence: ${jockey.license}`}
            icon={Users}
            badges={[
              { label: jockey.status, color: jockey.status === 'Champion' ? 'yellow' : jockey.status === 'Actif' ? 'green' : 'gray' },
              { label: `Rating: ${jockey.currentRating}`, color: 'blue' }
            ]}
            stats={[
              { label: "Victoires", value: jockey.victories },
              { label: "Taux Succès", value: jockey.winRate }
            ]}
            actions={[
              { label: "Voir Profil", onClick: () => console.log("Profil", jockey.name) },
              { label: "Modifier", onClick: () => console.log("Modifier", jockey.name), variant: "secondary" }
            ]}
          />
        ))}
      </div>

      {/* Tableau complet */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Registre des Icons.Users</h2>
          <div className="text-sm text-gray-600">
            {jockeysData.length} jockeys licenciés • Mise à jour: {new Date().toLocaleDateString('fr-FR')}
          </div>
        </div>
        
        <UnifiedTable
          columns={tableColumns}
          data={jockeysData}
          actions={tableActions}
        />
      </div>

      {/* Sections spécialisées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classement des Champions */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Icons.Trophy className="h-5 w-5 text-yellow-500" />
            Classement des Champions
          </h3>
          <div className="space-y-3">
            {jockeysData
              .sort((a, b) => parseFloat(b.currentRating) - parseFloat(a.currentRating))
              .slice(0, 5)
              .map((jockey, idx) => (
                <div key={jockey.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-400' : 'bg-blue-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{jockey.name}</p>
                      <p className="text-sm text-gray-600">{jockey.experience} • {jockey.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{jockey.currentRating}</p>
                    <p className="text-xs text-gray-500">{jockey.victories} victoires</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Activité Récente */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Icons.Calendar className="h-5 w-5 text-green-500" />
            Activité Récente
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Icons.Trophy className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Victoire spectaculaire</p>
                <p className="text-sm text-gray-600">Amine Ben Salem à Monastir</p>
              </div>
              <span className="text-xs text-gray-500 ml-auto">Hier</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Award className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Nouvelle licence</p>
                <p className="text-sm text-gray-600">Apprenti promu jockey senior</p>
              </div>
              <span className="text-xs text-gray-500 ml-auto">Il y a 3 jours</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <Icons.Star className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-gray-900">Record personnel</p>
                <p className="text-sm text-gray-600">Karim Bouaziz - Nouveau PB</p>
              </div>
              <span className="text-xs text-gray-500 ml-auto">Il y a 1 semaine</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Icons.Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Formation complétée</p>
                <p className="text-sm text-gray-600">Stage sécurité équestre</p>
              </div>
              <span className="text-xs text-gray-500 ml-auto">Il y a 2 semaines</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques par spécialité */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Performance par Spécialité</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { specialty: "Sprint", count: 12, avgRating: "91.2", color: "bg-red-100 text-red-700" },
            { specialty: "Distance", count: 8, avgRating: "89.8", color: "bg-blue-100 text-blue-700" },
            { specialty: "Handicap", count: 15, avgRating: "92.1", color: "bg-green-100 text-green-700" },
            { specialty: "Polyvalent", count: 10, avgRating: "88.9", color: "bg-purple-100 text-purple-700" }
          ].map((spec) => (
            <div key={spec.specialty} className={`p-4 rounded-lg ${spec.color}`}>
              <h4 className="font-semibold">{spec.specialty}</h4>
              <p className="text-2xl font-bold mt-2">{spec.count}</p>
              <p className="text-sm mt-1">Icons.Users actifs</p>
              <p className="text-sm mt-2">Rating moyen: {spec.avgRating}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
