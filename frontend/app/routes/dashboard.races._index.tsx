import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import { Plus, Calendar, MapPin, Clock, Trophy } from 'lucide-react';

// Mock data pour les courses
const generateMockRaces = () => [
    {
        id: '1',
        nom: 'Prix de Tunis',
        date: '2025-08-25',
        heure: '15:30',
        lieu: 'Hippodrome de Kassar Said',
        distance: '2000m',
        type: 'Galop',
        participants: 12,
        status: 'À venir'
    },
    {
        id: '2',
        nom: 'Course des Champions',
        date: '2025-08-22',
        heure: '16:00',
        lieu: 'Hippodrome de Carthage',
        distance: '1800m',
        type: 'Trot',
        participants: 8,
        status: 'Terminée'
    },
    {
        id: '3',
        nom: 'Derby Tunisien',
        date: '2025-08-28',
        heure: '17:00',
        lieu: 'Hippodrome de Kassar Said',
        distance: '2400m',
        type: 'Galop',
        participants: 15,
        status: 'Inscriptions ouvertes'
    }
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const races = generateMockRaces();
    
    return json({
        races,
        timestamp: new Date().toISOString(),
    });
};

export default function DashboardRaces() {
    const { races } = useLoaderData<typeof loader>();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'À venir':
                return 'bg-blue-100 text-blue-800';
            case 'Terminée':
                return 'bg-gray-100 text-gray-800';
            case 'Inscriptions ouvertes':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="px-6 py-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        🏇 Gestion des Courses
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Planifiez et gérez les courses hippiques
                    </p>
                </div>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Nouvelle Course
                </button>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center">
                        <Trophy className="h-8 w-8 text-yellow-500" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Courses ce mois</p>
                            <p className="text-2xl font-semibold text-gray-900">12</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center">
                        <Calendar className="h-8 w-8 text-blue-500" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">À venir</p>
                            <p className="text-2xl font-semibold text-gray-900">8</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center">
                        <Clock className="h-8 w-8 text-green-500" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Aujourd'hui</p>
                            <p className="text-2xl font-semibold text-gray-900">3</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center">
                        <MapPin className="h-8 w-8 text-purple-500" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Hippodromes</p>
                            <p className="text-2xl font-semibold text-gray-900">3</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Liste des courses */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Courses programmées
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Liste complète des courses avec leurs détails
                    </p>
                </div>
                
                <div className="border-t border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Course
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date & Heure
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Lieu
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Détails
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Participants
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {races.map((race) => (
                                    <tr key={race.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {race.nom}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {race.type}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(race.date).toLocaleDateString('fr-FR')}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {race.heure}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {race.lieu}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div>{race.distance}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {race.participants} inscrits
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(race.status)}`}>
                                                {race.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                                                Voir
                                            </button>
                                            <button className="text-indigo-600 hover:text-indigo-900">
                                                Modifier
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
