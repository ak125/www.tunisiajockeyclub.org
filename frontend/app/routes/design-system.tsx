import { type MetaFunction } from "@remix-run/node";
import { motion } from "framer-motion";

export const meta: MetaFunction = () => {
  return [
    { title: "Design System Executive - Tunisia Jockey Club" },
    { name: "description", content: "Catalogue complet des composants UI Executive" },
  ];
};

export default function DesignSystemDemo() {
  const tableData = [
    { id: 1, name: 'Mohammed Ben Salah', license: 'PRO-2024-001', status: 'Actif', category: 'Jockey Elite' },
    { id: 2, name: 'Aïcha Trabelsi', license: 'PRO-2024-002', status: 'Actif', category: 'Entraîneur' },
    { id: 3, name: 'Omar Kassemi', license: 'PRO-2024-003', status: 'Suspendu', category: 'Propriétaire' }
  ];

  const tableColumns = [
    { key: 'name', label: 'Nom', sortable: true },
    { key: 'license', label: 'Licence', sortable: true },
    { key: 'status', label: 'Statut', render: (value: string) => (
      <ExecutiveBadge variant={value === 'Actif' ? 'certified' : 'authority'} size="sm">
        {value}
      </ExecutiveBadge>
    )},
    { key: 'category', label: 'Catégorie' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-8xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Design System Executive</h1>
              <p className="text-lg text-slate-600 mt-2">Catalogue des composants UI - Tunisia Jockey Club</p>
            </div>
            <ExecutiveButton variant="primary">
              Retour Interface Principale
            </ExecutiveButton>
          </div>
        </div>
      </header>

      <div className="max-w-8xl mx-auto px-8 py-12">
        
        {/* Badges Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-black text-slate-900 mb-8">Executive Badges</h2>
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
              <div className="grid md:grid-cols-3 gap-8">
                
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Variants</h3>
                  <div className="space-y-4">
                    <div>
                      <ExecutiveBadge variant="authority">Autorité Officielle</ExecutiveBadge>
                    </div>
                    <div>
                      <ExecutiveBadge variant="certified">Certifié</ExecutiveBadge>
                    </div>
                    <div>
                      <ExecutiveBadge variant="premium">Premium</ExecutiveBadge>
                    </div>
                    <div>
                      <ExecutiveBadge variant="exclusive">Exclusif</ExecutiveBadge>
                    </div>
                    <div>
                      <ExecutiveBadge variant="ministerial">Ministériel</ExecutiveBadge>
                    </div>
                    <div>
                      <ExecutiveBadge variant="international">International</ExecutiveBadge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Tailles</h3>
                  <div className="space-y-4">
                    <div>
                      <ExecutiveBadge size="sm">Small</ExecutiveBadge>
                    </div>
                    <div>
                      <ExecutiveBadge size="md">Medium</ExecutiveBadge>
                    </div>
                    <div>
                      <ExecutiveBadge size="lg">Large</ExecutiveBadge>
                    </div>
                    <div>
                      <ExecutiveBadge size="xl">Extra Large</ExecutiveBadge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Status Indicators</h3>
                  <div className="space-y-4">
                    <ExecutiveStatus status="operational" label="Système Opérationnel" />
                    <ExecutiveStatus status="warning" label="Attention Requise" />
                    <ExecutiveStatus status="critical" label="Situation Critique" />
                    <ExecutiveStatus status="maintenance" label="Maintenance" />
                    <ExecutiveStatus status="optimal" label="Performance Optimale" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Buttons Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-black text-slate-900 mb-8">Executive Buttons</h2>
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
              <div className="grid md:grid-cols-2 gap-12">
                
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Variants</h3>
                  <div className="space-y-6">
                    <div>
                      <ExecutiveButton variant="primary">Bouton Primary</ExecutiveButton>
                    </div>
                    <div>
                      <ExecutiveButton variant="secondary">Bouton Secondary</ExecutiveButton>
                    </div>
                    <div>
                      <ExecutiveButton variant="ministerial">Bouton Ministériel</ExecutiveButton>
                    </div>
                    <div>
                      <ExecutiveButton variant="diplomatic">Bouton Diplomatique</ExecutiveButton>
                    </div>
                    <div>
                      <ExecutiveButton variant="emergency">Bouton Urgence</ExecutiveButton>
                    </div>
                    <div>
                      <ExecutiveButton variant="ghost">Bouton Ghost</ExecutiveButton>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Tailles & États</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <ExecutiveButton size="sm">Small</ExecutiveButton>
                      <ExecutiveButton size="md">Medium</ExecutiveButton>
                      <ExecutiveButton size="lg">Large</ExecutiveButton>
                      <ExecutiveButton size="xl">Extra Large</ExecutiveButton>
                    </div>
                    <div>
                      <ExecutiveButton loading>Chargement...</ExecutiveButton>
                    </div>
                    <div>
                      <ExecutiveButton disabled>Désactivé</ExecutiveButton>
                    </div>
                    <div>
                      <ExecutiveButton icon={<span>🏆</span>} iconPosition="left">Avec Icône</ExecutiveButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Progress Indicators */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-black text-slate-900 mb-8">Progress Indicators</h2>
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <ExecutiveProgress value={85} label="Conformité" color="emerald" />
                <ExecutiveProgress value={92} label="Performance" color="indigo" />
                <ExecutiveProgress value={76} label="Qualité" color="yellow" />
                <ExecutiveProgress value={98} label="Sécurité" color="emerald" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Metric Cards */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-black text-slate-900 mb-8">Executive Metric Cards</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              <ExecutiveMetricCard
                title="Licences Professionnelles"
                value="1,247"
                change="+12.5%"
                changeType="positive"
                description="Certifications actives"
                icon="🏅"
                trend={[45, 52, 48, 61, 55, 67, 73, 69, 82, 78, 85, 91]}
                color="emerald"
              />
              
              <ExecutiveMetricCard
                title="Compétitions Elite"
                value="89"
                change="+18.2%"
                changeType="positive"
                description="Événements supervisés"
                icon="🏆"
                trend={[32, 41, 38, 45, 49, 53, 58, 62, 67, 71, 76, 82]}
                color="indigo"
              />
              
              <ExecutiveMetricCard
                title="Conformité Standards"
                value="98.9%"
                change="+2.1%"
                changeType="positive"
                description="Réglementation respectée"
                icon="✓"
                trend={[88, 89, 91, 93, 94, 95, 96, 97, 97.5, 98, 98.5, 98.9]}
                color="purple"
              />
            </div>
          </motion.div>
        </section>

        {/* Alerts */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-black text-slate-900 mb-8">Executive Alerts</h2>
            <div className="space-y-6">
              <ExecutiveAlert
                variant="ministerial"
                title="Directive Ministérielle 2025-12"
                message="Nouvelles réglementations sur les standards de certification des professionnels. Application effective dès le 1er septembre 2025."
                action={{
                  label: "Consulter la directive",
                  onClick: () => console.log("Directive consultée")
                }}
                dismissible
              />
              
              <ExecutiveAlert
                variant="success"
                title="Certification ISO Renouvelée"
                message="La Tunisia Jockey Club a obtenu le renouvellement de sa certification ISO 9001:2015 pour 3 années supplémentaires."
                dismissible
              />
              
              <ExecutiveAlert
                variant="warning"
                title="Maintenance Programmée"
                message="Maintenance système programmée ce weekend de 02h00 à 06h00. Services potentiellement indisponibles."
              />
              
              <ExecutiveAlert
                variant="critical"
                title="Incident Sécuritaire Résolu"
                message="Tentative d'accès non autorisé détectée et bloquée automatiquement à 14h32. Système sécurisé."
              />
            </div>
          </motion.div>
        </section>

        {/* Data Table */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-black text-slate-900 mb-8">Executive Data Table</h2>
            <ExecutiveTable
              title="Registre des Professionnels"
              subtitle="Liste des licences actives et leur statut de certification"
              columns={tableColumns}
              data={tableData}
              actions={
                <div className="flex items-center gap-3">
                  <ExecutiveButton variant="ghost" size="sm">
                    Exporter
                  </ExecutiveButton>
                  <ExecutiveButton variant="primary" size="sm">
                    Ajouter
                  </ExecutiveButton>
                </div>
              }
            />
          </motion.div>
        </section>

        {/* Announcements */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-black text-slate-900 mb-8">Executive Announcements</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              <ExecutiveAnnouncement
                title="Assemblée Générale Extraordinaire"
                content="Convocation de tous les membres pour l'assemblée générale extraordinaire du 15 septembre 2025 à 14h00 au siège social de Tunis."
                priority="ministerial"
                timestamp="Aujourd'hui 10:30"
                author="Secrétariat Général"
                category="GOUVERNANCE"
                attachments={3}
                actions={[
                  {
                    label: "Consulter",
                    onClick: () => console.log("Consulté"),
                    variant: "primary"
                  },
                  {
                    label: "Partager",
                    onClick: () => console.log("Partagé"),
                    variant: "secondary"
                  }
                ]}
              />
              
              <ExecutiveAnnouncement
                title="Mise à jour Réglementaire"
                content="Publication du nouveau règlement des courses pour la saison 2025-2026. Consultation publique ouverte jusqu'au 30 août."
                priority="high"
                timestamp="Hier 16:45"
                author="Commission Technique"
                category="RÉGLEMENTATION"
                attachments={1}
                actions={[
                  {
                    label: "Télécharger",
                    onClick: () => console.log("Téléchargé"),
                    variant: "primary"
                  }
                ]}
              />
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  );
}
