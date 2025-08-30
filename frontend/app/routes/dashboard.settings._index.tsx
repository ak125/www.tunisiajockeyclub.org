import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, useOutletContext, Link, Form, useNavigation } from '@remix-run/react';
import { 
  Settings, User, Shield, Bell, Palette, Database, 
  Globe, Save, AlertTriangle, Check, Eye, EyeOff,
  Key, Mail, Phone, MapPin, Languages, Clock
} from 'lucide-react';
import { useState } from 'react';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Récupérer les paramètres utilisateur depuis le backend
    const userResponse = await fetch('http://localhost:3000/api/user/profile', {
      headers: { 
        'Authorization': `Bearer ${request.headers.get('Authorization')}` 
      }
    });
    
    const systemResponse = await fetch('http://localhost:3000/api/settings/system');

    const userProfile = userResponse.ok ? await userResponse.json() : {};
    const systemSettings = systemResponse.ok ? await systemResponse.json() : {};

    return json({
      userProfile,
      systemSettings,
      canManageSystem: true, // À déterminer selon les permissions
    });
  } catch (error) {
    console.error('Erreur chargement paramètres:', error);
    return json({
      userProfile: {},
      systemSettings: {},
      canManageSystem: false,
    });
  }
}

export default function DashboardSettings() {
  const { userProfile, systemSettings, canManageSystem } = useLoaderData<typeof loader>();
  const { user, permissions } = useOutletContext<{
    user: any;
    permissions: any;
  }>();
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'system'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || 'Admin',
    lastName: user?.lastName || 'TJC',
    email: user?.email || 'admin@tjc.tn',
    phone: '+216 00 000 000',
    address: 'Tunis, Tunisie',
    language: 'fr',
    timezone: 'Africa/Tunis'
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    sessionTimeout: '4', // heures
    loginNotifications: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    raceUpdates: true,
    systemAlerts: true,
    weeklyReports: false,
    mobileNotifications: true,
    browserNotifications: true
  });

  const [systemConfig, setSystemConfig] = useState({
    maintenanceMode: false,
    registrationOpen: true,
    maxUsersPerSession: '50',
    backupFrequency: 'daily',
    logLevel: 'info',
    cacheEnabled: true
  });

  const isLoading = navigation.state === 'submitting';

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    ...(canManageSystem ? [{ id: 'system', label: 'Système', icon: Database }] : [])
  ] as const;

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de sauvegarde du profil
    console.log('Sauvegarde profil:', profileData);
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de changement de mot de passe
    console.log('Changement sécurité:', securitySettings);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Settings className="h-6 w-6 text-gray-600 mr-2" />
            Paramètres et Configuration
          </h1>
          <p className="text-gray-600">
            Gestion de votre profil et des paramètres système
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>Sauvegarder tout</span>
          </button>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white rounded-lg border">
        <div className="border-b">
          <nav className="flex space-x-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Onglet Profil */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom
                      </label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData(prev => ({...prev, firstName: e.target.value}))}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom
                      </label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData(prev => ({...prev, lastName: e.target.value}))}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({...prev, email: e.target.value}))}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({...prev, phone: e.target.value}))}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Adresse
                    </label>
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData(prev => ({...prev, address: e.target.value}))}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Languages className="h-4 w-4 mr-1" />
                        Langue
                      </label>
                      <select
                        value={profileData.language}
                        onChange={(e) => setProfileData(prev => ({...prev, language: e.target.value}))}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="fr">Français</option>
                        <option value="ar">العربية</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Fuseau horaire
                      </label>
                      <select
                        value={profileData.timezone}
                        onChange={(e) => setProfileData(prev => ({...prev, timezone: e.target.value}))}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Africa/Tunis">Tunis (GMT+1)</option>
                        <option value="Europe/Paris">Paris (GMT+1)</option>
                        <option value="UTC">UTC (GMT+0)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>{isLoading ? 'Sauvegarde...' : 'Sauvegarder'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Onglet Sécurité */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sécurité du compte</h3>
                
                <form onSubmit={handleSecuritySubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mot de passe actuel
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={securitySettings.currentPassword}
                        onChange={(e) => setSecuritySettings(prev => ({...prev, currentPassword: e.target.value}))}
                        className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2 text-gray-500"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nouveau mot de passe
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={securitySettings.newPassword}
                        onChange={(e) => setSecuritySettings(prev => ({...prev, newPassword: e.target.value}))}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmer le nouveau mot de passe
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={securitySettings.confirmPassword}
                        onChange={(e) => setSecuritySettings(prev => ({...prev, confirmPassword: e.target.value}))}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <h4 className="font-medium text-gray-900">Options de sécurité avancées</h4>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium text-gray-700">Authentification à deux facteurs</label>
                        <p className="text-sm text-gray-600">Sécurité supplémentaire avec code SMS/Email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.twoFactorEnabled}
                          onChange={(e) => setSecuritySettings(prev => ({...prev, twoFactorEnabled: e.target.checked}))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiration de session (heures)
                      </label>
                      <select
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings(prev => ({...prev, sessionTimeout: e.target.value}))}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="1">1 heure</option>
                        <option value="4">4 heures</option>
                        <option value="8">8 heures</option>
                        <option value="24">24 heures</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                    >
                      <Key className="h-4 w-4" />
                      <span>Changer le mot de passe</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Onglet Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Préférences de notification</h3>
                
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Notifications par email', description: 'Recevoir des notifications importantes par email' },
                    { key: 'raceUpdates', label: 'Mises à jour des courses', description: 'Alertes sur les changements de programme' },
                    { key: 'systemAlerts', label: 'Alertes système', description: 'Notifications de maintenance et problèmes techniques' },
                    { key: 'weeklyReports', label: 'Rapports hebdomadaires', description: 'Résumé des activités de la semaine' },
                    { key: 'mobileNotifications', label: 'Notifications mobiles', description: 'Push notifications sur mobile' },
                    { key: 'browserNotifications', label: 'Notifications navigateur', description: 'Notifications dans le navigateur web' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <h4 className="font-medium text-gray-900">{setting.label}</h4>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                          onChange={(e) => setNotificationSettings(prev => ({
                            ...prev,
                            [setting.key]: e.target.checked
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-6">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Sauvegarder les préférences</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Système (Admin uniquement) */}
          {activeTab === 'system' && canManageSystem && (
            <div className="space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                  <div>
                    <h4 className="font-medium text-orange-800">Configuration Système</h4>
                    <p className="text-sm text-orange-700">Ces paramètres affectent l'ensemble de l'application</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Paramètres généraux</h4>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <label className="font-medium text-gray-700">Mode maintenance</label>
                      <p className="text-sm text-gray-600">Désactiver l'accès public</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemConfig.maintenanceMode}
                        onChange={(e) => setSystemConfig(prev => ({...prev, maintenanceMode: e.target.checked}))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre max d'utilisateurs par session
                    </label>
                    <input
                      type="number"
                      value={systemConfig.maxUsersPerSession}
                      onChange={(e) => setSystemConfig(prev => ({...prev, maxUsersPerSession: e.target.value}))}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Niveau de log
                    </label>
                    <select
                      value={systemConfig.logLevel}
                      onChange={(e) => setSystemConfig(prev => ({...prev, logLevel: e.target.value}))}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="error">Erreur seulement</option>
                      <option value="warn">Avertissement</option>
                      <option value="info">Information</option>
                      <option value="debug">Debug</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Performance et sauvegarde</h4>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <label className="font-medium text-gray-700">Cache activé</label>
                      <p className="text-sm text-gray-600">Améliore les performances</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemConfig.cacheEnabled}
                        onChange={(e) => setSystemConfig(prev => ({...prev, cacheEnabled: e.target.checked}))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fréquence de sauvegarde
                    </label>
                    <select
                      value={systemConfig.backupFrequency}
                      onChange={(e) => setSystemConfig(prev => ({...prev, backupFrequency: e.target.value}))}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="hourly">Toutes les heures</option>
                      <option value="daily">Quotidienne</option>
                      <option value="weekly">Hebdomadaire</option>
                      <option value="monthly">Mensuelle</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Link
                  to="/dashboard/settings/system/logs"
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Voir les logs
                </Link>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  Sauvegarder système
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
