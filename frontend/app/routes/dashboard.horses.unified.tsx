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

export default function UnifiedHorsesModule() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Données mockées pour les chevaux
  const horsesStats = [
    { label: "Chevaux Actifs", value: "127", change: "+12%", trend: "up" as const, icon: Icons.Activity },
    { label: "Performances Moyennes", value: "85.4", change: "+3.2%", trend: "up" as const, icon: Trophy },
    { label: "En Entraînement", value: "98", change: "-2%", trend: "down" as const, icon: TrendingUp },
    { label: "Prochaines Icons.MapPins", value: "24", change: "+5", trend: "up" as const, icon: Calendar }
  ];

  const filters = [
    { id: "all", label: "Tous", count: 127 },
    { id: "active", label: "Actifs", count: 98 },
    { id: "retired", label: "Retraités", count: 29 },
    { id: "training", label: "Entraînement", count: 85 },
    { id: "competition", label: "Compétition", count: 42 }
  ];

  const horsesData = [
    {
      id: "1",
      name: "Thunder Storm",
      breed: "Pur-sang Arabe",
      age: "5 ans",
      owner: "Ahmed Ben Ali",
      trainer: "Mohamed Trabelsi",
      rating: "92.5",
      lastRace: "2025-08-15",
      status: "Actif",
      wins: 8,
      races: 15
    },
    {
      id: "2", 
      name: "Desert Wind",
      breed: "Pur-sang Anglais",
      age: "4 ans",
      owner: "Société Hippique de Tunis",
      trainer: "Farid Benaissa",
      rating: "88.2",
      lastRace: "2025-08-20",
      status: "Actif",
      wins: 6,
      races: 12
    },
    {
      id: "3",
      name: "Golden Star",
      breed: "Anglo-Arabe",
      age: "6 ans", 
      owner: "Hatem Chakroun",
      trainer: "Slim Mzoughi",
      rating: "91.8",
      lastRace: "2025-07-28",
      status: "Repos",
      wins: 12,
      races: 20
    }
  ];

  const tableColumns = [
    { key: "name", label: "Nom du Cheval" },
    { key: "breed", label: "Race" },
    { key: "age", label: "Âge" },
    { key: "owner", label: "Propriétaire" },
    { key: "trainer", label: "Entraîneur" },
    { key: "rating", label: "Rating IFHA" },
    { key: "status", label: "Statut" }
  ];

  const tableActions = [
    { label: "Voir Détails", onClick: (row: any) => console.log("Détails:", row.name), icon: Icons.Eye },
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
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <Icons.Activity className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Gestion des Chevaux</h1>
            <p className="text-green-100 mt-2">
              Système unifié de gestion et suivi des chevaux avec rating IFHA intégré
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <UnifiedStatsGrid stats={horsesStats} />

      {/* Barre de recherche et filtres */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <UnifiedSearchBar 
              onSearch={handleSearch}
              placeholder="Rechercher un cheval par nom, propriétaire, entraîneur..."
            />
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200">
            + Nouveau Cheval
          </button>
        </div>
        
        <UnifiedFilterBar 
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Cartes de chevaux vedettes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {horsesData.slice(0, 3).map((horse) => (
          <UnifiedCard
            key={horse.id}
            title={horse.name}
            subtitle={`${horse.breed} • ${horse.age}`}
            description={`Propriétaire: ${horse.owner} | Entraîneur: ${horse.trainer}`}
            icon={Icons.Activity}
            badges={[
              { label: horse.status, color: horse.status === 'Actif' ? 'green' : 'gray' },
              { label: `Rating: ${horse.rating}`, color: 'blue' }
            ]}
            stats={[
              { label: "Victoires", value: horse.wins },
              { label: "Icons.MapPins", value: horse.races }
            ]}
            actions={[
              { label: "Voir Détails", onClick: () => console.log("Détails", horse.name) },
              { label: "Modifier", onClick: () => console.log("Modifier", horse.name), variant: "secondary" }
            ]}
          />
        ))}
      </div>

      {/* Tableau complet */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Liste Complète des Chevaux</h2>
          <div className="text-sm text-gray-600">
            {horsesData.length} chevaux • Mise à jour: {new Date().toLocaleDateString('fr-FR')}
          </div>
        </div>
        
        <UnifiedTable
          columns={tableColumns}
          data={horsesData}
          actions={tableActions}
        />
      </div>

      {/* Section des performances récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-3">
            {horsesData
              .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
              .slice(0, 5)
              .map((horse, idx) => (
                <div key={horse.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{horse.name}</p>
                      <p className="text-sm text-gray-600">{horse.breed}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{horse.rating}</p>
                    <p className="text-xs text-gray-500">Rating IFHA</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Activité Récente</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Icons.Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Icons.MapPin à Kasserine</p>
                <p className="text-sm text-gray-600">Desert Wind - 2e place</p>
              </div>
              <span className="text-xs text-gray-500 ml-auto">Il y a 2 jours</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Icons.Trophy className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Victoire à Sousse</p>
                <p className="text-sm text-gray-600">Thunder Storm - 1ère place</p>
              </div>
              <span className="text-xs text-gray-500 ml-auto">Il y a 1 semaine</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <Icons.Star className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-gray-900">Nouveau record</p>
                <p className="text-sm text-gray-600">Golden Star - Rating 91.8</p>
              </div>
              <span className="text-xs text-gray-500 ml-auto">Il y a 2 semaines</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
