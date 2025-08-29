import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { ExecutiveBadge, ExecutiveButton, ExecutiveStatus } from "~/components/ui/executive-components";

export const loader: LoaderFunction = async () => {
  try {
    // Fetch horses data to simulate licenses
    const horsesResponse = await fetch('http://localhost:3000/api/horses');
    let licenses = [];

    if (horsesResponse.ok) {
      const horsesData = await horsesResponse.json();
      // Transform horses data to licenses format
      licenses = horsesData.map((horse: any, index: number) => ({
        id: horse.id,
        type: 'Professional Jockey',
        holderName: `Jockey ${horse.name}`,
        licenseNumber: `TJC-${String(horse.id).padStart(4, '0')}`,
        issueDate: new Date(2024, 0, index + 1).toISOString(),
        expiryDate: new Date(2025, 11, 31).toISOString(),
        status: Math.random() > 0.8 ? 'pending' : Math.random() > 0.1 ? 'active' : 'expired',
        category: horse.rating ? 'Elite' : 'Standard',
        specializations: ['Course Plate', 'Obstacles'],
        lastRenewal: new Date(2024, 0, index + 15).toISOString()
      }));
    }

    return json({ 
      licenses,
      statistics: {
        total: licenses.length,
        active: licenses.filter((l: any) => l.status === 'active').length,
        pending: licenses.filter((l: any) => l.status === 'pending').length,
        expired: licenses.filter((l: any) => l.status === 'expired').length,
        renewalsThisMonth: Math.floor(licenses.length * 0.15)
      }
    });
  } catch (error) {
    return json({ 
      licenses: [], 
      statistics: { total: 0, active: 0, pending: 0, expired: 0, renewalsThisMonth: 0 } 
    });
  }
};

export default function LicensesManagement() {
  const { licenses, statistics } = useLoaderData<typeof loader>();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter licenses
  const filteredLicenses = licenses.filter((license: any) => {
    const matchesCategory = selectedCategory === 'all' || license.category.toLowerCase() === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || license.status === selectedStatus;
    const matchesSearch = license.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'certified';
      case 'pending': return 'premium'; 
      case 'expired': return 'ministerial';
      default: return 'authority';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'pending': return 'En Attente';
      case 'expired': return 'Expiré';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">📋</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">Gestion des Licences</h1>
                  <p className="text-sm text-slate-600">Professionnels Certifiés</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ExecutiveButton>
                + Nouvelle Licence
              </ExecutiveButton>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Licences', value: statistics.total, icon: '📋', color: 'from-blue-500 to-blue-600' },
            { label: 'Licences Actives', value: statistics.active, icon: '✅', color: 'from-green-500 to-green-600' },
            { label: 'En Attente', value: statistics.pending, icon: '⏳', color: 'from-yellow-500 to-yellow-600' },
            { label: 'Renouvellements', value: statistics.renewalsThisMonth, icon: '🔄', color: 'from-purple-500 to-purple-600' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white text-lg shadow-lg`}>
                  {stat.icon}
                </div>
                <ExecutiveBadge variant="premium" size="sm">+5.2%</ExecutiveBadge>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-slate-700">Catégorie:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Toutes</option>
                  <option value="elite">Elite</option>
                  <option value="standard">Standard</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-slate-700">Statut:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Tous</option>
                  <option value="active">Actif</option>
                  <option value="pending">En Attente</option>
                  <option value="expired">Expiré</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full lg:w-auto">
              <span className="text-sm font-medium text-slate-700">🔍</span>
              <input
                type="text"
                placeholder="Rechercher une licence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 flex-1 lg:w-64"
              />
            </div>
          </div>
        </div>

        {/* Licenses Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">Licences Professionnelles</h2>
              <ExecutiveBadge variant="authority" size="sm">
                {filteredLicenses.length} licences
              </ExecutiveBadge>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Titulaire
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">
                    N° Licence
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Catégorie
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Expiration
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredLicenses.map((license: any, index: number) => (
                  <motion.tr
                    key={license.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {license.holderName.split(' ').map((n: string) => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{license.holderName}</p>
                          <p className="text-xs text-slate-600">{license.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="px-2 py-1 bg-slate-100 rounded text-sm font-mono">
                        {license.licenseNumber}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <ExecutiveBadge 
                        variant={license.category === 'Elite' ? 'premium' : 'authority'}
                        size="sm"
                      >
                        {license.category}
                      </ExecutiveBadge>
                    </td>
                    <td className="px-6 py-4">
                      <ExecutiveBadge 
                        variant={getStatusColor(license.status) as any}
                        size="sm"
                      >
                        {getStatusLabel(license.status)}
                      </ExecutiveBadge>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">
                        {new Date(license.expiryDate).toLocaleDateString('fr-FR')}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                        Voir
                      </button>
                      <button className="px-3 py-1 text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors">
                        Modifier
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {filteredLicenses.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <p className="text-lg mb-2">Aucune licence trouvée</p>
                <p className="text-sm">Modifiez vos critères de recherche</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
