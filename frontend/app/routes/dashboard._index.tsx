import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Trophy, Users, Activity, TrendingUp, Zap } from 'lucide-react';

// Mock data pour le dashboard - en attendant les vraies APIs
const generateMockData = () => {
  const coursesData = [
    { mois: 'Jan', courses: 12, participants: 156 },
    { mois: 'Fév', courses: 15, participants: 198 },
    { mois: 'Mar', courses: 18, participants: 234 },
    { mois: 'Avr', courses: 22, participants: 287 },
    { mois: 'Mai', courses: 19, participants: 245 },
    { mois: 'Jun', courses: 25, participants: 312 }
  ];

  const performanceData = [
    { nom: 'Thunder Storm', victoires: 12, courses: 18 },
    { nom: 'Desert Wind', victoires: 8, courses: 15 },
    { nom: 'Golden Arrow', victoires: 10, courses: 16 },
    { nom: 'Lightning Bolt', victoires: 6, courses: 12 },
    { nom: 'Arabian Dream', victoires: 9, courses: 14 }
  ];

  const categoriesData = [
    { name: 'Galop', value: 45, color: '#0088FE' },
    { name: 'Trot', value: 30, color: '#00C49F' },
    { name: 'Obstacles', value: 25, color: '#FFBB28' }
  ];

  return { coursesData, performanceData, categoriesData };
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const mockData = generateMockData();
    
    // Statistiques générales
    const stats = {
        totalCourses: 124,
        totalChevaux: 89,
        totalJockeys: 32,
        coursesThisMonth: 25
    };
    
    return json({
        stats,
        ...mockData,
        timestamp: new Date().toISOString(),
    });
};

export default function DashboardIndex() {
    const { stats, coursesData, performanceData, categoriesData } = useLoaderData<typeof loader>();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        🏇 Dashboard Tunisia Jockey Club
                    </h1>
                    <p className="text-gray-600">
                        Vue d'ensemble des performances et statistiques
                    </p>
                </div>

                {/* KPIs Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Courses</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.totalCourses}</p>
                            </div>
                            <Trophy className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="mt-2 flex items-center text-sm">
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-500">+12%</span>
                            <span className="text-gray-500 ml-1">vs mois dernier</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Chevaux Actifs</p>
                                <p className="text-3xl font-bold text-green-600">{stats.totalChevaux}</p>
                            </div>
                            <Zap className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="mt-2 flex items-center text-sm">
                            <Activity className="h-4 w-4 text-blue-500 mr-1" />
                            <span className="text-blue-500">En activité</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Jockeys</p>
                                <p className="text-3xl font-bold text-purple-600">{stats.totalJockeys}</p>
                            </div>
                            <Users className="h-8 w-8 text-purple-600" />
                        </div>
                        <div className="mt-2 flex items-center text-sm">
                            <span className="text-gray-500">Professionnels actifs</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Ce Mois</p>
                                <p className="text-3xl font-bold text-orange-600">{stats.coursesThisMonth}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-orange-600" />
                        </div>
                        <div className="mt-2 flex items-center text-sm">
                            <span className="text-gray-500">Courses programmées</span>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Évolution des courses */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            📈 Évolution des Courses
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={coursesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mois" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="courses" 
                                    stroke="#2563eb" 
                                    strokeWidth={3}
                                    name="Nb Courses"
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="participants" 
                                    stroke="#10b981" 
                                    strokeWidth={3}
                                    name="Participants"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Répartition par catégorie */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            🎯 Répartition par Catégorie
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoriesData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoriesData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Performance des chevaux */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        🏆 Top Performers
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="nom" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="victoires" fill="#f59e0b" name="Victoires" />
                            <Bar dataKey="courses" fill="#6366f1" name="Total Courses" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Actions rapides */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        ⚡ Actions Rapides
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                            📅 Programmer une course
                        </button>
                        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                            🐎 Ajouter un cheval
                        </button>
                        <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                            📊 Générer un rapport
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
