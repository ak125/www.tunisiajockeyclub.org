import * as Icons from "lucide-react";
import { useState } from "react";

export default function UnifiedSettingsModule() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "system", label: "Système", icon: Database },
    { id: "appearance", label: "Apparence", icon: Palette },
    { id: "general", label: "Général", icon: Globe }
  ];

  // Composant de formulaire unifié
  const FormSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {children}
    </div>
  );

  const InputField = ({ 
    label, 
    type = "text", 
    value, 
    placeholder, 
    description 
  }: { 
    label: string; 
    type?: string; 
    value?: string; 
    placeholder?: string; 
    description?: string; 
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
      />
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );

  const ToggleSwitch = ({ label, description, defaultChecked = false }: { 
    label: string; 
    description?: string; 
    defaultChecked?: boolean; 
  }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
      </label>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <FormSection title="Informations Personnelles">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Prénom" value="Ahmed" />
                <InputField label="Nom" value="Ben Ali" />
                <InputField label="Email" type="email" value="ahmed.benali@example.com" />
                <InputField label="Téléphone" value="+216 12 345 678" />
              </div>
              <InputField 
                label="Bio" 
                value="Propriétaire passionné de chevaux de course depuis 15 ans."
                description="Une courte description de votre profil"
              />
            </FormSection>

            <FormSection title="Informations Professionnelles">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Fonction" value="Propriétaire" />
                <InputField label="Licence" value="PROP-2023-001" />
                <InputField label="Date d'adhésion" value="2010-03-15" type="date" />
                <InputField label="Statut" value="Actif" />
              </div>
            </FormSection>

            <div className="flex justify-end gap-4">
              <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200">
                Annuler
              </button>
              <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200">
                Sauvegarder
              </button>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <FormSection title="Mot de Passe">
              <InputField label="Mot de passe actuel" type="password" />
              <InputField label="Nouveau mot de passe" type="password" />
              <InputField label="Confirmer le mot de passe" type="password" />
            </FormSection>

            <FormSection title="Authentification à Deux Facteurs">
              <ToggleSwitch 
                label="Activer 2FA" 
                description="Ajouter une couche de sécurité supplémentaire à votre compte"
                defaultChecked={true}
              />
              <ToggleSwitch 
                label="SMS de sécurité" 
                description="Recevoir des codes de vérification par SMS"
              />
            </FormSection>

            <FormSection title="Sessions Actives">
              <div className="space-y-3">
                {[
                  { device: "Desktop - Chrome", location: "Tunis, Tunisie", date: "Maintenant" },
                  { device: "Mobile - Safari", location: "Sousse, Tunisie", date: "Il y a 2 heures" },
                  { device: "Desktop - Firefox", location: "Monastir, Tunisie", date: "Il y a 1 jour" }
                ].map((session, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{session.device}</p>
                      <p className="text-sm text-gray-600">{session.location} • {session.date}</p>
                    </div>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                      Déconnecter
                    </button>
                  </div>
                ))}
              </div>
            </FormSection>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <FormSection title="Notifications par Email">
              <ToggleSwitch 
                label="Nouvelles courses" 
                description="Être notifié des nouvelles courses disponibles"
                defaultChecked={true}
              />
              <ToggleSwitch 
                label="Résultats des courses" 
                description="Recevoir les résultats de vos chevaux"
                defaultChecked={true}
              />
              <ToggleSwitch 
                label="Rappels d'entraînement" 
                description="Rappels pour les séances d'entraînement"
              />
              <ToggleSwitch 
                label="Newsletter mensuelle" 
                description="Résumé mensuel des activités du club"
                defaultChecked={true}
              />
            </FormSection>

            <FormSection title="Notifications Push">
              <ToggleSwitch 
                label="Notifications en temps réel" 
                description="Recevoir les notifications instantanément"
                defaultChecked={true}
              />
              <ToggleSwitch 
                label="Rappels de courses" 
                description="30 minutes avant le début d'une course"
                defaultChecked={true}
              />
              <ToggleSwitch 
                label="Alertes de sécurité" 
                description="Notifications de connexion suspecte"
                defaultChecked={true}
              />
            </FormSection>
          </div>
        );

      case "system":
        return (
          <div className="space-y-6">
            <FormSection title="Préférences Système">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Langue</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="fr">Français</option>
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Fuseau horaire</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="Africa/Tunis">GMT+1 (Tunis)</option>
                    <option value="Europe/Paris">GMT+1 (Paris)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
              <ToggleSwitch 
                label="Mode développeur" 
                description="Afficher les informations techniques avancées"
              />
            </FormSection>

            <FormSection title="Sauvegarde et Exportation">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-900">Sauvegarde automatique</p>
                    <p className="text-sm text-blue-700">Dernière sauvegarde: Il y a 2 heures</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200">
                    Sauvegarder maintenant
                  </button>
                </div>
                <div className="flex gap-4">
                  <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200">
                    Exporter mes données
                  </button>
                  <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200">
                    Importer des données
                  </button>
                </div>
              </div>
            </FormSection>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <FormSection title="Interface Utilisateur">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Thème</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "light", name: "Clair", bg: "bg-white", border: "border-gray-300" },
                      { id: "dark", name: "Sombre", bg: "bg-gray-800", border: "border-gray-600" },
                      { id: "auto", name: "Automatique", bg: "bg-gradient-to-r from-white to-gray-800", border: "border-gray-400" }
                    ].map((theme) => (
                      <label key={theme.id} className="cursor-pointer">
                        <input type="radio" name="theme" value={theme.id} className="sr-only peer" />
                        <div className={`p-4 rounded-lg border-2 ${theme.border} peer-checked:border-green-500 ${theme.bg}`}>
                          <p className="text-center font-medium">{theme.name}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <ToggleSwitch 
                  label="Animations réduites" 
                  description="Réduire les animations pour améliorer les performances"
                />
                <ToggleSwitch 
                  label="Mode haute densité" 
                  description="Afficher plus d'informations à l'écran"
                />
              </div>
            </FormSection>

            <FormSection title="Couleur d'Accent">
              <div className="grid grid-cols-6 gap-3">
                {[
                  "bg-green-500", "bg-blue-500", "bg-purple-500", 
                  "bg-red-500", "bg-yellow-500", "bg-pink-500"
                ].map((color, idx) => (
                  <label key={idx} className="cursor-pointer">
                    <input type="radio" name="accent" className="sr-only peer" />
                    <div className={`w-12 h-12 ${color} rounded-lg border-2 border-transparent peer-checked:border-gray-400`}></div>
                  </label>
                ))}
              </div>
            </FormSection>
          </div>
        );

      case "general":
        return (
          <div className="space-y-6">
            <FormSection title="Paramètres Généraux">
              <InputField 
                label="Nom de l'organisation" 
                value="Tunisia Icons.User Club"
                description="Nom affiché dans l'interface"
              />
              <InputField 
                label="Adresse email de contact" 
                type="email" 
                value="contact@tunisiajockeyclub.tn"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Devise par défaut" value="TND" />
                <InputField label="Format de date" value="DD/MM/YYYY" />
              </div>
            </FormSection>

            <FormSection title="Paramètres IFHA">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Code pays IFHA" value="TUN" />
                <InputField label="Version du système" value="2025.2" />
              </div>
              <ToggleSwitch 
                label="Synchronisation automatique" 
                description="Synchroniser avec les bases de données IFHA internationales"
                defaultChecked={true}
              />
              <ToggleSwitch 
                label="Validation stricte" 
                description="Appliquer les règles IFHA les plus strictes"
                defaultChecked={true}
              />
            </FormSection>
          </div>
        );

      default:
        return <div>Contenu non trouvé</div>;
    }
  };

  return (
    <div className="space-y-8">
      {/* En-tête de module */}
      <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <Icons.Settings className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Paramètres et Configuration</h1>
            <p className="text-gray-100 mt-2">
              Configuration complète du système et préférences personnelles
            </p>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? "border-green-500 text-green-600 bg-green-50"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu de l'onglet */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
