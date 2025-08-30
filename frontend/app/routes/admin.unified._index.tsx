import * as Icons from "lucide-react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { 
  UnifiedSearchBar, 
  UnifiedFilterBar, 
  UnifiedCard, 
  UnifiedTable, 
  UnifiedStatsGrid 
} from "~/components/unified/UnifiedComponents";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  // Données enrichies pour l'interface admin unifiée
  const adminStats = [
    { 
      label: "Courses Totales", 
      value: "127", 
      change: "+8%", 
      trend: "up" as const, 
      icon: Icons.Trophy,
      description: "Courses programmées cette saison"
    },
    { 
      label: "Chevaux Actifs", 
      value: "342", 
      change: "+12%", 
      trend: "up" as const, 
      icon: Icons.Activity,
      description: "Chevaux enregistrés et actifs"
    },
    { 
      label: "Utilisateurs", 
      value: "1,584", 
      change: "+23%", 
      trend: "up" as const, 
      icon: Icons.Users,
      description: "Utilisateurs de la plateforme"
    },
    { 
      label: "Revenus", 
      value: "125,430 TND", 
      change: "+15%", 
      trend: "up" as const, 
      icon: Icons.DollarSign,
      description: "Revenus générés ce mois"
    },
    { 
      label: "Jockeys", 
      value: "89", 
      change: "+5%", 
      trend: "up" as const, 
      icon: Icons.User,
      description: "Jockeys professionnels actifs"
    },
    { 
      label: "Hippodromes", 
      value: "12", 
      change: "0%", 
      trend: "stable" as const, 
      icon: Icons.MapPin,
      description: "Hippodromes partenaires"
    }
  ];
  
  const recentActivities = [
    {
      id: 1,
      type: "course",
      title: "Prix de Carthage",
      description: "Course programmée pour demain",
      status: "À venir",
      priority: "high",
      date: "2025-08-31",
      time: "15:30"
    },
    {
      id: 2,
      type: "horse",
      title: "Nouveau cheval enregistré",
      description: "Thunder Bolt inscrit par Écurie Al Watan",
      status: "Complété",
      priority: "medium",
      date: "2025-08-30",
      time: "10:15"
    },
    {
      id: 3,
      type: "jockey",
      title: "Licence jockey renouvelée",
      description: "Ahmed Slimani - Licence #TN-2025-045",
      status: "Validé",
      priority: "low",
      date: "2025-08-30",
      time: "09:45"
    },
    {
      id: 4,
      type: "system",
      title: "Mise à jour système",
      description: "Interface unifiée déployée avec succès",
      status: "Terminé",
      priority: "high",
      date: "2025-08-30",
      time: "08:00"
    }
  ];

  const quickActions = [
    { label: "Nouvelle Course", icon: Icons.Plus, action: "create-race", color: "blue" },
    { label: "Ajouter Cheval", icon: Icons.Plus, action: "add-horse", color: "green" },
    { label: "Gérer Jockeys", icon: Icons.Users, action: "manage-jockeys", color: "purple" },
    { label: "Rapports", icon: Icons.BarChart, action: "reports", color: "indigo" },
    { label: "Paramètres", icon: Icons.Settings, action: "settings", color: "gray" },
    { label: "Support", icon: Icons.HelpCircle, action: "support", color: "orange" }
  ];

  return json({ adminStats, recentActivities, quickActions });
};

export default function AdminUnifiedDashboard() {
  const { adminStats, recentActivities, quickActions } = useLoaderData<typeof loader>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Configuration du header avec gradient admin
  const headerGradient = "bg-gradient-to-r from-slate-600 via-gray-700 to-slate-800";

  // Colonnes pour le tableau des activités récentes
  const activityColumns = [
    { key: "type", label: "Type" },
    { key: "title", label: "Titre" },
    { key: "description", label: "Description" },
    { key: "status", label: "Statut" },
    { key: "date", label: "Date" },
  ];

  // Actions du tableau
  const tableActions = [
    { label: "Voir Détails", onClick: (row: any) => console.log("Détails:", row.title), icon: Icons.Eye },
    { label: "Modifier", onClick: (row: any) => console.log("Modifier:", row.title), icon: Icons.Edit },
  ];

  // Filtres pour les activités
  const activityFilters = [
    { label: "Toutes", value: "all" },
    { label: "Courses", value: "course" },
    { label: "Chevaux", value: "horse" },
    { label: "Jockeys", value: "jockey" },
    { label: "Système", value: "system" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-100 to-gray-200">
      {/* Header Unifié avec gradient admin */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`${headerGradient} text-white p-6 shadow-xl`}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <Icons.Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Administration</h1>
            <p className="text-white/80">Centre de contrôle Tunisia Jockey Club</p>
          </div>
        </div>
      </motion.div>

      <div className="p-6">
        {/* Statistiques unifiées */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <UnifiedStatsGrid stats={adminStats} />
        </motion.div>

        {/* Actions rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Actions Rapides</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                onClick={() => console.log("Action:", action.action)}
                className={`
                  p-4 rounded-xl shadow-lg text-white font-medium
                  bg-gradient-to-br from-${action.color}-500 to-${action.color}-600
                  hover:from-${action.color}-600 hover:to-${action.color}-700
                  transition-all duration-300
                `}
              >
                <action.icon className="h-8 w-8 mx-auto mb-2" />
                <div className="text-sm">{action.label}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Section activités récentes avec composants unifiés */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Activités Récentes</h2>
          
          {/* Barre de recherche et filtres unifiés */}
          <div className="mb-6 space-y-4">
            <UnifiedSearchBar 
              onSearch={setSearchTerm} 
              placeholder="Rechercher dans les activités..." 
            />
            <UnifiedFilterBar 
              filters={activityFilters}
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </div>

          {/* Tableau unifié des activités */}
          <UnifiedTable 
            data={recentActivities}
            columns={activityColumns}
            actions={tableActions}
            searchTerm={searchTerm}
            selectedFilter={selectedFilter}
          />
        </motion.div>

        {/* Cartes d'information supplémentaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <UnifiedCard
            title="Système"
            subtitle="Statut opérationnel"
            description="Tous les services fonctionnent normalement"
            icon={Icons.CheckCircle}
            badges={[
              { label: "En ligne", color: "green" },
              { label: "Optimisé", color: "blue" }
            ]}
            stats={[
              { label: "Uptime", value: "99.9%" },
              { label: "Performance", value: "Excellente" }
            ]}
            actions={[
              { label: "Monitoring", onClick: () => console.log("Monitoring système") }
            ]}
            gradient="from-green-500 to-emerald-600"
          />

          <UnifiedCard
            title="Sécurité"
            subtitle="Protection avancée"
            description="Authentification et autorisation actives"
            icon={Icons.Shield}
            badges={[
              { label: "Sécurisé", color: "green" },
              { label: "SSL", color: "blue" }
            ]}
            stats={[
              { label: "Tentatives", value: "0" },
              { label: "Alertes", value: "Aucune" }
            ]}
            actions={[
              { label: "Logs Sécurité", onClick: () => console.log("Logs sécurité") }
            ]}
            gradient="from-red-500 to-pink-600"
          />

          <UnifiedCard
            title="Support"
            subtitle="Assistance utilisateur"
            description="Support technique et utilisateur disponible"
            icon={Icons.HeadphonesIcon}
            badges={[
              { label: "Disponible", color: "green" },
              { label: "24/7", color: "blue" }
            ]}
            stats={[
              { label: "Tickets", value: "3" },
              { label: "Résolus", value: "95%" }
            ]}
            actions={[
              { label: "Centre d'aide", onClick: () => console.log("Centre d'aide") }
            ]}
            gradient="from-orange-500 to-amber-600"
          />
        </motion.div>

        {/* Footer admin */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-gray-500 text-sm"
        >
          <p>Tunisia Jockey Club - Interface d'administration unifiée</p>
          <p>Version 2.0 • Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</p>
        </motion.div>
      </div>
    </div>
  );
}
