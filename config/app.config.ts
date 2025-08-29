// Configuration centralisée pour Tunisia Jockey Club
export const APP_CONFIG = {
  // Configuration API
  api: {
    baseUrl: process.env.VITE_API_URL || 'http://localhost:3000',
    timeout: 30000,
  },
  
  // Routes principales unifiées
  routes: {
    home: '/',
    login: '/login',
    dashboard: '/dashboard-main',  // VERSION UNIQUE - dashboard principal
    raceManagement: '/race-management',
    profile: '/profile',
    admin: '/admin',
  },
  
  // Configuration Auth
  auth: {
    sessionDuration: 24 * 60 * 60 * 1000, // 24 heures
    cookieName: 'tjc-session',
    loginPath: '/login',
    redirectAfterLogin: '/dashboard-main',
  },
  
  // Utilisateurs de test
  testUsers: {
    admin: {
      email: 'admin@tjc.tn',
      password: '1234',
      role: 'ADMIN'
    },
    user: {
      email: 'monia@gmail.com', 
      password: '1234',
      role: 'USER'
    },
    jockey: {
      email: 'jockey@tjc.tn',
      password: '1234',
      role: 'JOCKEY'
    }
  },
  
  // Configuration des services
  services: {
    frontend: {
      port: 5173,
      host: 'localhost'
    },
    backend: {
      port: 3000,
      host: 'localhost'
    },
    redis: {
      port: 6379,
      host: 'localhost'
    },
    supabase: {
      url: process.env.SUPABASE_URL,
      anonKey: process.env.SUPABASE_ANON_KEY,
    }
  },
  
  // Pages actives (VERSION UNIQUE)
  pages: {
    // Frontend pages - Une seule version de chaque
    dashboard: 'dashboard-main',  // Version officielle
    home: '_index',
    login: 'login',
    profile: 'profile',
    raceManagement: 'race-management',
  },
  
  // Configuration UI/UX
  ui: {
    theme: 'tunisia-jockey-club',
    primaryColors: {
      green: '#22c55e',
      gold: '#f59e0b',
      blue: '#3b82f6'
    },
    animations: {
      enabled: true,
      duration: 'medium'
    }
  }
};

// Export des constantes utiles
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  RACES: '/api/races',
  USERS: '/api/users',
  DASHBOARD: '/api/dashboard',
  PROFILE: '/api/profile',
};

export const DASHBOARD_TABS = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: 'BarChart3' },
  { id: 'races', label: 'Courses', icon: 'Trophy' },
  { id: 'jockeys', label: 'Jockeys', icon: 'Users' },
  { id: 'results', label: 'Résultats', icon: 'Target' },
];

export default APP_CONFIG;
