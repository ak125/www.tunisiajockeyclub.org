import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import { Settings, User, Bell, Shield, Database, Globe, Palette, Smartphone, Save, RefreshCw } from 'lucide-react';
import { Button } from '~/components/ui/button';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Mock data pour les paramètres
  const settings = {
    profile: {
      firstName: "Admin",
      lastName: "Tunisia Jockey Club",
      email: "admin@tunisiajockeyclub.com",
      phone: "+216 71 123 456",
      role: "Administrateur",
      avatar: "/api/placeholder/64/64"
    },
    notifications: {
      email: true,
      sms: false,
      pushNotifications: true,
      raceResults: true,
      systemAlerts: true,
      weatherUpdates: false,
      marketingEmails: false
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5
    },
    system: {
      language: "fr",
      timezone: "Africa/Tunis",
      dateFormat: "DD/MM/YYYY",
      currency: "TND",
      theme: "light"
    },
    database: {
      backupFrequency: "daily",
      lastBackup: "2025-08-22T02:00:00Z",
      storage: {
        used: "2.3 GB",
        total: "10 GB",
        percentage: 23
      }
    }
  };

  return json({ settings });
};

export default function SettingsPage() {
  const { settings } = useLoaderData<typeof loader>();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">⚙️ Paramètres</h1>
          <p className="text-gray-600 mt-2">Gérez les paramètres du système et votre profil</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation des paramètres */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Catégories</h3>
            <nav className="space-y-2">
              <a
                href="#profile"
                className="flex items-center space-x-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg font-medium"
              >
                <User className="w-4 h-4" />
                <span>Profil</span>
              </a>
              <a
                href="#notifications"
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </a>
              <a
                href="#security"
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span>Sécurité</span>
              </a>
              <a
                href="#system"
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Système</span>
              </a>
              <a
                href="#database"
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                <Database className="w-4 h-4" />
                <span>Base de données</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Contenu des paramètres */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section Profil */}
          <div id="profile" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Informations du profil</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <div className="flex-1">
                  <Button variant="outline" size="sm">
                    Changer la photo
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">JPG, PNG. Max 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    defaultValue={settings.profile.firstName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de famille
                  </label>
                  <input
                    type="text"
                    defaultValue={settings.profile.lastName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={settings.profile.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    defaultValue={settings.profile.phone}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section Notifications */}
          <div id="notifications" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Préférences de notification</h3>
            </div>

            <div className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      {key === 'email' ? 'Notifications email' :
                       key === 'sms' ? 'Notifications SMS' :
                       key === 'pushNotifications' ? 'Notifications push' :
                       key === 'raceResults' ? 'Résultats de course' :
                       key === 'systemAlerts' ? 'Alertes système' :
                       key === 'weatherUpdates' ? 'Bulletins météo' :
                       key === 'marketingEmails' ? 'Emails marketing' : key}
                    </p>
                    <p className="text-sm text-gray-500">
                      {key === 'email' ? 'Recevoir les notifications par email' :
                       key === 'sms' ? 'Recevoir les notifications par SMS' :
                       key === 'pushNotifications' ? 'Notifications sur l\'appareil' :
                       key === 'raceResults' ? 'Alertes de résultats en temps réel' :
                       key === 'systemAlerts' ? 'Notifications importantes du système' :
                       key === 'weatherUpdates' ? 'Conditions météo pour les courses' :
                       key === 'marketingEmails' ? 'Promotions et actualités' : ''}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={value}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Section Sécurité */}
          <div id="security" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Paramètres de sécurité</h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">Authentification à deux facteurs</p>
                  <p className="text-sm text-green-700">Sécurité renforcée activée</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Activé
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeout de session (minutes)
                  </label>
                  <input
                    type="number"
                    defaultValue={settings.security.sessionTimeout}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiration mot de passe (jours)
                  </label>
                  <input
                    type="number"
                    defaultValue={settings.security.passwordExpiry}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section Système */}
          <div id="system" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Paramètres système</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Langue
                </label>
                <select 
                  defaultValue={settings.system.language}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuseau horaire
                </label>
                <select 
                  defaultValue={settings.system.timezone}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Africa/Tunis">Africa/Tunis</option>
                  <option value="Europe/Paris">Europe/Paris</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format de date
                </label>
                <select 
                  defaultValue={settings.system.dateFormat}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Palette className="w-4 h-4 inline mr-2" />
                  Thème
                </label>
                <select 
                  defaultValue={settings.system.theme}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                  <option value="auto">Automatique</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section Base de données */}
          <div id="database" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Database className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Gestion de la base de données</h3>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-900">Espace de stockage utilisé</span>
                  <span className="text-sm text-gray-600">
                    {settings.database.storage.used} / {settings.database.storage.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${settings.database.storage.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {settings.database.storage.percentage}% utilisé
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fréquence de sauvegarde
                  </label>
                  <select 
                    defaultValue={settings.database.backupFrequency}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="daily">Quotidienne</option>
                    <option value="weekly">Hebdomadaire</option>
                    <option value="monthly">Mensuelle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dernière sauvegarde
                  </label>
                  <input
                    type="text"
                    value={new Date(settings.database.lastBackup).toLocaleString('fr-FR')}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline">
                  <Database className="w-4 h-4 mr-2" />
                  Sauvegarder maintenant
                </Button>
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Optimiser la base
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
