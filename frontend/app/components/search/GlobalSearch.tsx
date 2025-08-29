import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, User, Trophy, Calendar, MapPin, Star, Filter } from 'lucide-react';
import Fuse from 'fuse.js';
import toast from 'react-hot-toast';

interface SearchResult {
  id: string;
  type: 'horse' | 'jockey' | 'trainer' | 'owner' | 'race';
  title: string;
  subtitle: string;
  description: string;
  metadata?: {
    age?: number;
    wins?: number;
    races?: number;
    prize?: number;
    date?: string;
    location?: string;
  };
  image?: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onResultSelect: (result: SearchResult) => void;
}

export function GlobalSearch({ isOpen, onClose, onResultSelect }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  // Données mockées pour la recherche
  const mockData: SearchResult[] = [
    // Chevaux
    {
      id: '1',
      type: 'horse',
      title: 'NOUR EL HOUDA',
      subtitle: 'Jument Pur-sang Arabe',
      description: 'Fille de MASSOUD AL ARAB et SABRINA',
      metadata: { age: 4, wins: 3, races: 8 },
      image: '/api/placeholder/64/64'
    },
    {
      id: '2',
      type: 'horse',
      title: 'SAHARA DU GOLFE',
      subtitle: 'Étalon Pur-sang Arabe',
      description: 'Fils de AL MARMOUM et SAHARA DU SUD',
      metadata: { age: 5, wins: 5, races: 12 },
      image: '/api/placeholder/64/64'
    },
    {
      id: '3',
      type: 'horse',
      title: 'FAROUK',
      subtitle: 'Étalon Pur-sang Arabe',
      description: 'Fils de PRINCE AL MAURY et FARIDA',
      metadata: { age: 6, wins: 8, races: 18 },
      image: '/api/placeholder/64/64'
    },
    
    // Jockeys
    {
      id: '4',
      type: 'jockey',
      title: 'Ahmed Ben Ali',
      subtitle: 'Jockey professionnel',
      description: 'Spécialiste des courses de plat',
      metadata: { wins: 42, races: 128 },
      image: '/api/placeholder/64/64'
    },
    {
      id: '5',
      type: 'jockey',
      title: 'Mohamed Trabelsi',
      subtitle: 'Jockey expérimenté',
      description: '15 ans d\'expérience sur les hippodromes tunisiens',
      metadata: { wins: 38, races: 95 },
      image: '/api/placeholder/64/64'
    },
    
    // Entraîneurs
    {
      id: '6',
      type: 'trainer',
      title: 'Habib Bouazizi',
      subtitle: 'Entraîneur principal',
      description: 'Écurie Bouazizi - Spécialiste Pur-sang Arabe',
      metadata: { wins: 65, races: 210 },
      image: '/api/placeholder/64/64'
    },
    
    // Propriétaires
    {
      id: '7',
      type: 'owner',
      title: 'Élevage Al Waha',
      subtitle: 'Propriétaire-éleveur',
      description: 'Élevage spécialisé en Pur-sang Arabes tunisiens',
      metadata: { wins: 28, races: 95 },
      image: '/api/placeholder/64/64'
    },
    
    // Courses
    {
      id: '8',
      type: 'race',
      title: 'Prix DE BEN GUERDANE',
      subtitle: 'Course principale',
      description: 'Distance: 2000m - Dotation: 3825 DT',
      metadata: { prize: 3825, date: '2025-08-02', location: 'Ben Guerdane' },
      image: '/api/placeholder/64/64'
    },
    {
      id: '9',
      type: 'race',
      title: 'Prix DE JEKITIS',
      subtitle: 'Course d\'ouverture',
      description: 'Distance: 1400m - Dotation: 4250 DT',
      metadata: { prize: 4250, date: '2025-08-02', location: 'Ben Guerdane' },
      image: '/api/placeholder/64/64'
    }
  ];

  // Configuration de Fuse.js pour la recherche floue
  const fuse = useMemo(() => {
    const options = {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'subtitle', weight: 0.3 },
        { name: 'description', weight: 0.3 }
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true,
    };
    
    const filteredData = selectedFilter === 'all' 
      ? mockData 
      : mockData.filter(item => item.type === selectedFilter);
      
    return new Fuse(filteredData, options);
  }, [selectedFilter]);

  // Recherche avec debouncing
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    
    const searchTimer = setTimeout(() => {
      const searchResults = fuse.search(query);
      const formattedResults = searchResults
        .map(result => result.item)
        .slice(0, 8); // Limiter à 8 résultats
      
      setResults(formattedResults);
      setLoading(false);
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [query, fuse]);

  // Réinitialiser lors de l'ouverture/fermeture
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setSelectedFilter('all');
    }
  }, [isOpen]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'horse': return '🐎';
      case 'jockey': return '🏇';
      case 'trainer': return '👨‍🏫';
      case 'owner': return '👑';
      case 'race': return '🏆';
      default: return '📄';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'horse': return 'Cheval';
      case 'jockey': return 'Jockey';
      case 'trainer': return 'Entraîneur';
      case 'owner': return 'Propriétaire';
      case 'race': return 'Course';
      default: return 'Autre';
    }
  };

  const handleResultClick = (result: SearchResult) => {
    onResultSelect(result);
    onClose();
    toast.success(`Ouverture du profil de ${result.title}`);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-96 overflow-hidden"
        initial={{ scale: 0.9, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: -20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête de recherche */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher chevaux, jockeys, courses..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-lg"
                autoFocus
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Filtres */}
          <div className="flex items-center space-x-2 mt-3">
            <Filter className="w-4 h-4 text-gray-500" />
            {[
              { value: 'all', label: 'Tout' },
              { value: 'horse', label: 'Chevaux' },
              { value: 'jockey', label: 'Jockeys' },
              { value: 'trainer', label: 'Entraîneurs' },
              { value: 'race', label: 'Courses' }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedFilter === filter.value
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Résultats */}
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-600">Recherche en cours...</span>
            </div>
          ) : results.length > 0 ? (
            <AnimatePresence>
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleResultClick(result)}
                >
                  <div className="p-4 flex items-center space-x-4">
                    {/* Icône du type */}
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-xl">
                      {getTypeIcon(result.type)}
                    </div>

                    {/* Informations principales */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{result.title}</h3>
                        <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded-full">
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{result.subtitle}</p>
                      <p className="text-xs text-gray-500">{result.description}</p>
                    </div>

                    {/* Métadonnées */}
                    {result.metadata && (
                      <div className="text-right text-sm text-gray-500">
                        {result.type === 'horse' && result.metadata.wins !== undefined && (
                          <p>{result.metadata.wins} victoires</p>
                        )}
                        {result.type === 'jockey' && result.metadata.wins !== undefined && (
                          <p>{result.metadata.wins} victoires</p>
                        )}
                        {result.type === 'race' && result.metadata.prize !== undefined && (
                          <p>{result.metadata.prize} DT</p>
                        )}
                        {result.metadata.date && (
                          <p className="text-xs">{new Date(result.metadata.date).toLocaleDateString('fr-FR')}</p>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : query.trim() ? (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Aucun résultat pour "{query}"</p>
              <p className="text-sm mt-1">Essayez avec d'autres mots-clés</p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Tapez pour rechercher</p>
              <p className="text-sm mt-1">Chevaux, jockeys, entraîneurs, courses...</p>
            </div>
          )}
        </div>

        {/* Raccourcis clavier */}
        {!query && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Raccourcis: ↑ ↓ pour naviguer, ↵ pour sélectionner</span>
              <span>ESC pour fermer</span>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default GlobalSearch;
