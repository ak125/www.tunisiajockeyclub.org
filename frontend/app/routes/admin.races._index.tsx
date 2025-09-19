import { useState } from "react";
import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Edit, Trash, Calendar, MapPin, Trophy, Users, Clock, Eye, Save, X } from "lucide-react";

type RaceFormData = {
  name: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  distance: string;
  prize: string;
  maxParticipants: string;
  surface: string;
  description: string;
};

type ActionData =
  | { success: true; message: string }
  | { error: string; fieldErrors?: Record<string, string> };

export async function loader({ request }: LoaderFunctionArgs) {
  // En production, vérifier l'authentification admin
  // En production, récupérer les courses depuis l'API
  const races = [
    {
      id: '1',
      name: 'Prix de Carthage',
      date: '2025-08-30',
      time: '15:30',
      venue: 'Hippodrome de Tunis',
      category: 'Groupe I',
      distance: '2400m',
      prize: '50,000 TND',
      maxParticipants: 12,
      currentParticipants: 8,
      surface: 'Turf',
      description: 'Course prestigieuse ouverte aux chevaux de 4 ans et plus.',
      status: 'open',
      createdAt: '2025-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Prix de Tunis',
      date: '2025-09-02',
      time: '16:00',
      venue: 'Hippodrome de Tunis',
      category: 'Groupe II',
      distance: '1600m',
      prize: '35,000 TND',
      maxParticipants: 15,
      currentParticipants: 12,
      surface: 'Turf',
      description: 'Course de vitesse pour chevaux de 3 ans.',
      status: 'open',
      createdAt: '2025-01-14T14:30:00Z'
    }
  ];

  return json({ races });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  try {
    switch (intent) {
      case "create": {
        const raceData: RaceFormData = {
          name: formData.get("name") as string,
          date: formData.get("date") as string,
          time: formData.get("time") as string,
          venue: formData.get("venue") as string,
          category: formData.get("category") as string,
          distance: formData.get("distance") as string,
          prize: formData.get("prize") as string,
          maxParticipants: formData.get("maxParticipants") as string,
          surface: formData.get("surface") as string,
          description: formData.get("description") as string,
        };

        // Validation
        const fieldErrors: Record<string, string> = {};
        if (!raceData.name) fieldErrors.name = "Le nom est requis";
        if (!raceData.date) fieldErrors.date = "La date est requise";
        if (!raceData.time) fieldErrors.time = "L'heure est requise";
        if (!raceData.venue) fieldErrors.venue = "Le lieu est requis";

        if (Object.keys(fieldErrors).length > 0) {
          return json({ error: "Erreurs de validation", fieldErrors }, { status: 400 });
        }

        // En production, créer la course via API
        console.log("Création course:", raceData);

        return json({ success: true, message: "Course créée avec succès" });
      }

      case "delete": {
        const raceId = formData.get("raceId") as string;
        // En production, supprimer via API
        console.log("Suppression course:", raceId);
        
        return json({ success: true, message: "Course supprimée avec succès" });
      }

      default:
        return json({ error: "Action non reconnue" }, { status: 400 });
    }
  } catch (error) {
    console.error("Erreur action admin courses:", error);
    return json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export default function AdminRaces() {
  const { races } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<ActionData>();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRace, setEditingRace] = useState<string | null>(null);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Groupe I': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Groupe II': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Groupe III': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Listed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const RaceForm = ({ race, onClose }: { race?: any; onClose: () => void }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {race ? 'Modifier la Course' : 'Nouvelle Course'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <fetcher.Form method="post" className="space-y-6">
            <input type="hidden" name="intent" value={race ? "update" : "create"} />
            {race && <input type="hidden" name="raceId" value={race.id} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la Course
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={race?.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  name="category"
                  defaultValue={race?.category}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner</option>
                  <option value="Groupe I">Groupe I</option>
                  <option value="Groupe II">Groupe II</option>
                  <option value="Groupe III">Groupe III</option>
                  <option value="Listed">Listed</option>
                  <option value="Handicap">Handicap</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  defaultValue={race?.date}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure
                </label>
                <input
                  type="time"
                  name="time"
                  defaultValue={race?.time}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lieu
                </label>
                <select
                  name="venue"
                  defaultValue={race?.venue}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner</option>
                  <option value="Hippodrome de Tunis">Hippodrome de Tunis</option>
                  <option value="Hippodrome de Sousse">Hippodrome de Sousse</option>
                  <option value="Hippodrome de Sfax">Hippodrome de Sfax</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance
                </label>
                <input
                  type="text"
                  name="distance"
                  defaultValue={race?.distance}
                  placeholder="ex: 2400m"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dotation
                </label>
                <input
                  type="text"
                  name="prize"
                  defaultValue={race?.prize}
                  placeholder="ex: 50,000 TND"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Participants Max
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  defaultValue={race?.maxParticipants}
                  min="1"
                  max="20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surface
                </label>
                <select
                  name="surface"
                  defaultValue={race?.surface}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Turf">Turf</option>
                  <option value="Dirt">Dirt</option>
                  <option value="Synthetic">Synthetic</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                defaultValue={race?.description}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Description de la course..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {race ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </fetcher.Form>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🏇 Gestion des Courses</h1>
          <p className="text-gray-600 mt-1">Organisez et gérez le programme hippique</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouvelle Course
        </button>
      </div>

      {/* Message de retour */}
      {fetcher.data && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            'success' in fetcher.data ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {'success' in fetcher.data ? fetcher.data.message : fetcher.data.error}
        </motion.div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Courses Totales</p>
              <p className="text-2xl font-bold">{races.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Participants Total</p>
              <p className="text-2xl font-bold">
                {races.reduce((sum, race) => sum + race.currentParticipants, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <Trophy className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Dotations Totales</p>
              <p className="text-2xl font-bold">85K TND</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <MapPin className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Hippodromes</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des courses */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Courses Programmées</h2>
          
          <div className="space-y-4">
            {races.map((race) => (
              <div key={race.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{race.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(race.category)}`}>
                        {race.category}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(race.status)}`}>
                        {race.status === 'open' ? 'Ouvert' : race.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{race.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <div>
                          <div className="font-medium text-gray-900">{new Date(race.date).toLocaleDateString('fr-FR')}</div>
                          <div>{race.time}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <div className="font-medium text-gray-900">{race.venue}</div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {race.currentParticipants}/{race.maxParticipants}
                          </div>
                          <div>{race.distance}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Trophy className="w-4 h-4 mr-2" />
                        <div className="font-medium text-gray-900">{race.prize}</div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <div className="font-medium text-gray-900">{race.surface}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-md">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setEditingRace(race.id)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <fetcher.Form method="post" className="inline">
                      <input type="hidden" name="intent" value="delete" />
                      <input type="hidden" name="raceId" value={race.id} />
                      <button
                        type="submit"
                        className="p-2 text-red-600 hover:bg-red-100 rounded-md"
                        onClick={(e) => {
                          if (!confirm('Êtes-vous sûr de vouloir supprimer cette course ?')) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </fetcher.Form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modales */}
      <AnimatePresence>
        {showCreateForm && (
          <RaceForm onClose={() => setShowCreateForm(false)} />
        )}
        {editingRace && (
          <RaceForm 
            race={races.find(r => r.id === editingRace)}
            onClose={() => setEditingRace(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
