import * as Icons from "lucide-react";
import { useState } from "react";

// Composants unifiés intégrés directement
function UnifiedSearchBar({ onSearch, placeholder = "Rechercher..." }: { 
  onSearch: (term: string) => void;
  placeholder?: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onSearch(e.target.value);
        }}
        className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
      />
    </div>
  );
}

export default function CoursesUnifiedModule() {
  const [activeFilter, setActiveFilter] = useState("upcoming");

  // Données mockées pour les courses
  const coursesStats = [
    { label: "Icons.MapPins ce Mois", value: "24", icon: Calendar },
    { label: "Participants Total", value: "189", icon: Trophy },
    { label: "Icons.MapPins Terminées", value: "18", icon: Flag },
    { label: "À Venir", value: "6", icon: Clock }
  ];

  const upcomingRaces = [
    {
      id: "1",
      name: "Prix de Tunis",
      date: "2025-09-05",
      time: "15:30",
      location: "Hippodrome du Ksar Said",
      distance: "1400m",
      surface: "Gazon",
      participants: 12,
      prize: "50,000 DT",
      category: "Groupe II",
      status: "Inscriptions ouvertes"
    },
    {
      id: "2", 
      name: "Handicap de Sousse",
      date: "2025-09-08",
      time: "16:00",
      location: "Hippodrome de Sousse",
      distance: "1600m", 
      surface: "Terre",
      participants: 14,
      prize: "30,000 DT",
      category: "Handicap",
      status: "Complet"
    },
    {
      id: "3",
      name: "Prix des Débutants",
      date: "2025-09-12",
      time: "14:45",
      location: "Hippodrome du Ksar Said",
      distance: "1200m",
      surface: "Gazon", 
      participants: 10,
      prize: "20,000 DT",
      category: "Maiden",
      status: "Inscriptions ouvertes"
    }
  ];

  const recentResults = [
    {
      id: "r1",
      name: "Prix de Monastir",
      date: "2025-08-28",
      winner: "Thunder Storm",
      jockey: "Karim Bouaziz", 
      time: "1:23.45",
      participants: 11
    },
    {
      id: "r2",
      name: "Handicap de Kasserine", 
      date: "2025-08-25",
      winner: "Desert Wind",
      jockey: "Ahmed Slimani",
      time: "1:38.12",
      participants: 13
    }
  ];

  const filters = [
    { id: "upcoming", label: "À Venir", count: 6 },
    { id: "today", label: "Aujourd'hui", count: 0 },
    { id: "week", label: "Cette Semaine", count: 3 },
    { id: "completed", label: "Terminées", count: 18 }
  ];

  const handleSearch = (term: string) => {
    console.log("Recherche courses:", term);
  };

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    console.log("Filtre actif:", filterId);
  };

  return (
    <div className="space-y-8">
      {/* En-tête de module */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <Icons.Calendar className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Gestion des Icons.MapPins</h1>
            <p className="text-purple-100 mt-2">
              Système unifié de programmation et gestion des courses hippiques
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {coursesStats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <UnifiedSearchBar 
              onSearch={handleSearch}
              placeholder="Rechercher une course par nom, lieu, catégorie..."
            />
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200">
            + Nouvelle Icons.MapPin
          </button>
        </div>
        
        {/* Filtres */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterChange(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeFilter === filter.id
                  ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {filter.label}
              <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Icons.MapPins à venir */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Icons.MapPins à Venir</h2>
          <div className="text-sm text-gray-600">
            {upcomingRaces.length} courses programmées
          </div>
        </div>

        <div className="grid gap-6">
          {upcomingRaces.map((race) => (
            <div key={race.id} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                {/* Informations principales */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{race.name}</h3>
                      <p className="text-gray-600">{race.category}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      race.status === 'Complet' ? 'bg-red-100 text-red-700' :
                      race.status === 'Inscriptions ouvertes' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {race.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Icons.Calendar className="h-4 w-4 text-gray-500" />
                      <span>{new Date(race.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icons.Clock className="h-4 w-4 text-gray-500" />
                      <span>{race.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icons.MapPin className="h-4 w-4 text-gray-500" />
                      <span>{race.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-gray-500" />
                      <span>{race.distance}</span>
                    </div>
                  </div>
                </div>

                {/* Statistiques et actions */}
                <div className="flex flex-col justify-between gap-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-lg font-bold text-purple-600">{race.participants}</p>
                      <p className="text-xs text-gray-600">Participants</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-lg font-bold text-yellow-600">{race.prize}</p>
                      <p className="text-xs text-gray-600">Prix</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200">
                      Détails
                    </button>
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200">
                      Modifier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Résultats récents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Icons.Trophy className="h-5 w-5 text-yellow-500" />
            Résultats Récents
          </h3>
          <div className="space-y-3">
            {recentResults.map((result) => (
              <div key={result.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{result.name}</h4>
                  <span className="text-xs text-gray-500">
                    {new Date(result.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Icons.Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{result.winner}</span>
                  </div>
                  <span>Icons.User: {result.jockey}</span>
                  <span>Temps: {result.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistiques des hippodromes */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Icons.MapPin className="h-5 w-5 text-purple-500" />
            Activité par Hippodrome
          </h3>
          <div className="space-y-3">
            {[
              { name: "Hippodrome du Ksar Said", races: 14, upcoming: 4 },
              { name: "Hippodrome de Sousse", races: 8, upcoming: 2 },
              { name: "Hippodrome de Monastir", races: 6, upcoming: 0 }
            ].map((venue) => (
              <div key={venue.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{venue.name}</p>
                  <p className="text-sm text-gray-600">{venue.races} courses organisées</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600">{venue.upcoming}</p>
                  <p className="text-xs text-gray-500">À venir</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
