import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Calendar,
  Edit,
  Trash2,
  Eye,
  Search,
  Download,
  MoreHorizontal,
  User
} from "lucide-react";
import { useState } from "react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'member' | 'guest';
  status: 'active' | 'inactive' | 'suspended';
  membershipNumber?: string;
  joinDate: string;
  lastActivity: string;
  totalRaces: number;
}

export async function loader({ request }: LoaderFunctionArgs) {
  // Simuler des données utilisateurs pour la démonstration
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@tunisia-jockey-club.tn',
      firstName: 'Ahmed',
      lastName: 'Bennour',
      role: 'admin',
      status: 'active',
      membershipNumber: 'TJC-ADMIN-001',
      joinDate: '2020-01-15',
      lastActivity: '2025-08-31T10:30:00Z',
      totalRaces: 0
    },
    {
      id: '2',
      email: 'monia.benali@tunisia-jockey-club.tn',
      firstName: 'Monia',
      lastName: 'Ben Ali',
      role: 'member',
      status: 'active',
      membershipNumber: 'TJC-2020-001',
      joinDate: '2020-03-20',
      lastActivity: '2025-08-31T09:15:00Z',
      totalRaces: 145
    },
    {
      id: '3',
      email: 'karim.sfaxi@email.tn',
      firstName: 'Karim',
      lastName: 'Sfaxi',
      role: 'member',
      status: 'active',
      membershipNumber: 'TJC-2021-045',
      joinDate: '2021-06-10',
      lastActivity: '2025-08-30T16:45:00Z',
      totalRaces: 89
    },
    {
      id: '4',
      email: 'sara.mahmoud@email.tn',
      firstName: 'Sara',
      lastName: 'Mahmoud',
      role: 'member',
      status: 'inactive',
      membershipNumber: 'TJC-2022-078',
      joinDate: '2022-01-15',
      lastActivity: '2025-07-20T14:20:00Z',
      totalRaces: 23
    },
    {
      id: '5',
      email: 'guest@example.com',
      firstName: 'Invité',
      lastName: 'Test',
      role: 'guest',
      status: 'active',
      joinDate: '2025-08-31',
      lastActivity: '2025-08-31T12:00:00Z',
      totalRaces: 0
    }
  ];

  const stats = {
    totalUsers: mockUsers.length,
    activeUsers: mockUsers.filter(u => u.status === 'active').length,
    admins: mockUsers.filter(u => u.role === 'admin').length,
    members: mockUsers.filter(u => u.role === 'member').length,
    guests: mockUsers.filter(u => u.role === 'guest').length
  };

  return json({
    users: mockUsers,
    stats
  });
}

export default function AdminUsersPage() {
  const { users, stats } = useLoaderData<typeof loader>();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = (
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'member': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'guest': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="h-8 w-8 mr-3 text-blue-600" />
              Gestion des Utilisateurs
            </h1>
            <p className="text-gray-600 mt-2">
              Administrez les comptes utilisateurs du Tunisia Jockey Club
            </p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <UserPlus className="h-4 w-4 mr-2" />
            Nouvel Utilisateur
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow border text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border text-center">
            <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
            <div className="text-sm text-gray-600">Actifs</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border text-center">
            <div className="text-2xl font-bold text-red-600">{stats.admins}</div>
            <div className="text-sm text-gray-600">Admins</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.members}</div>
            <div className="text-sm text-gray-600">Membres</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.guests}</div>
            <div className="text-sm text-gray-600">Invités</div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les rôles</option>
                <option value="admin">Administrateurs</option>
                <option value="member">Membres</option>
                <option value="guest">Invités</option>
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="suspended">Suspendu</option>
              </select>
            </div>

            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </button>
          </div>
        </div>

        {/* Tableau des utilisateurs */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière activité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.membershipNumber && (
                            <div className="text-xs text-gray-400">#{user.membershipNumber}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role === 'admin' ? 'Admin' : user.role === 'member' ? 'Membre' : 'Invité'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                        {user.status === 'active' ? 'Actif' : 
                         user.status === 'inactive' ? 'Inactif' : 'Suspendu'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(user.joinDate).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(user.lastActivity).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="font-medium">{user.totalRaces}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900" title="Voir">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900" title="Modifier">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900" title="Supprimer">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" title="Plus">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Aucun utilisateur trouvé
              </h3>
              <p className="text-gray-600">
                Modifiez vos critères de recherche ou ajoutez de nouveaux utilisateurs.
              </p>
            </div>
          )}
        </div>

        {/* Pagination (simulée) */}
        {filteredUsers.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-8">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Précédent
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Suivant
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredUsers.length}</span> sur{' '}
                  <span className="font-medium">{users.length}</span> résultats
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Précédent
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Suivant
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
