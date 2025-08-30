import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from '@remix-run/react';
import { Plus, Calendar, MapPin, Clock, Trophy, Settings, BarChart3 } from 'lucide-react';

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
        status: 'À venir',
        prize: '25,000 DT'
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
        status: 'Terminée',
        prize: '30,000 DT'
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
        status: 'Inscriptions ouvertes',
        prize: '50,000 DT'
    }
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const races = generateMockRaces();
    
    return json({
        races,
        timestamp: new Date().toISOString(),
        stats: {
            total: races.length,
            upcoming: races.filter(r => r.status === 'À venir').length,
            open: races.filter(r => r.status === 'Inscriptions ouvertes').length
        }
    });
};

export default function RacesIndex() {
    const { races, stats } = useLoaderData<typeof loader>();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'À venir':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Terminée':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'Inscriptions ouvertes':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800 mb-2">
                            Courses Hippiques
                        </h1>
                        <p className="text-slate-600">
                            Gestion et suivi des courses du Jockey Club de Tunisie
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link 
                            to="/races/advanced" 
                            className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                        >
                            <BarChart3 className="w-5 h-5" />
                            Vue Avancée
                        </Link>
                        <Link 
                            to="/race-management" 
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Settings className="w-5 h-5" />
                            Gestion
                        </Link>
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                            <Plus className="w-5 h-5" />
                            Nouvelle Course
                        </button>
                    </div>
                </div>

                {/* Stats rapides */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">Total Courses</h3>
                                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                            </div>
                            <Trophy className="w-12 h-12 text-blue-600 opacity-20" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">À Venir</h3>
                                <p className="text-3xl font-bold text-green-600">{stats.upcoming}</p>
                            </div>
                            <Calendar className="w-12 h-12 text-green-600 opacity-20" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">Inscriptions</h3>
                                <p className="text-3xl font-bold text-orange-600">{stats.open}</p>
                            </div>
                            <Clock className="w-12 h-12 text-orange-600 opacity-20" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Liste des courses */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-800">Courses Programmées</h2>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {races.map((race) => (
                            <div key={race.id} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-slate-800">{race.nom}</h3>
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(race.status)}`}>
                                                {race.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {race.date}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                {race.heure}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                {race.lieu}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Trophy className="w-4 h-4" />
                                                {race.prize}
                                            </div>
                                        </div>
                                        <div className="mt-2 text-sm">
                                            <span className="text-slate-500">{race.distance} • {race.type} • {race.participants} participants</span>
                                        </div>
                                    </div>
                                    <button className="ml-4 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        Voir Détails
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
