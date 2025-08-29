import React from 'react';

/**
 * Theme Management System - Tunisia Jockey Club
 * Gestion des thèmes personnalisables avec persistance localStorage
 */

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ThemeColor = 'blue' | 'emerald' | 'purple' | 'amber' | 'rose' | 'turf-green';

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: ThemeColor;
  fontSize: 'sm' | 'base' | 'lg';
  animations: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
}

export const DEFAULT_THEME: ThemeConfig = {
  mode: 'light',
  primaryColor: 'turf-green',
  fontSize: 'base',
  animations: true,
  highContrast: false,
  reducedMotion: false,
};

export const THEME_COLORS = {
  blue: {
    name: 'Bleu Classic',
    primary: 'rgb(59 130 246)',
    secondary: 'rgb(147 197 253)',
    accent: 'rgb(30 64 175)',
    light: 'rgb(239 246 255)',
    dark: 'rgb(30 58 138)',
  },
  emerald: {
    name: 'Émeraude Élégant',
    primary: 'rgb(16 185 129)',
    secondary: 'rgb(110 231 183)',
    accent: 'rgb(4 120 87)',
    light: 'rgb(236 253 245)',
    dark: 'rgb(6 95 70)',
  },
  purple: {
    name: 'Violet Royal',
    primary: 'rgb(168 85 247)',
    secondary: 'rgb(196 181 253)',
    accent: 'rgb(126 34 206)',
    light: 'rgb(250 245 255)',
    dark: 'rgb(88 28 135)',
  },
  amber: {
    name: 'Ambre Doré',
    primary: 'rgb(245 158 11)',
    secondary: 'rgb(252 211 77)',
    accent: 'rgb(180 83 9)',
    light: 'rgb(255 251 235)',
    dark: 'rgb(146 64 14)',
  },
  rose: {
    name: 'Rose Passion',
    primary: 'rgb(236 72 153)',
    secondary: 'rgb(249 168 212)',
    accent: 'rgb(190 24 93)',
    light: 'rgb(253 242 248)',
    dark: 'rgb(157 23 77)',
  },
  'turf-green': {
    name: 'Vert Hippique',
    primary: 'rgb(45 80 22)',
    secondary: 'rgb(122 171 66)',
    accent: 'rgb(37 66 21)',
    light: 'rgb(240 247 237)',
    dark: 'rgb(22 36 14)',
  },
};

class ThemeManager {
  private config: ThemeConfig = DEFAULT_THEME;
  private listeners: Set<(config: ThemeConfig) => void> = new Set();

  constructor() {
    this.loadTheme();
    this.applyTheme();
    this.setupMediaQueryListeners();
  }

  /**
   * Charge le thème depuis localStorage
   */
  private loadTheme(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('tjc-theme');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.config = { ...DEFAULT_THEME, ...parsed };
      }
    } catch (error) {
      console.warn('Erreur lors du chargement du thème:', error);
      this.config = DEFAULT_THEME;
    }

    // Détection des préférences système
    this.detectSystemPreferences();
  }

  /**
   * Détecte les préférences système
   */
  private detectSystemPreferences(): void {
    if (typeof window === 'undefined') return;

    // Préférence pour le mode sombre
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Préférence pour les animations réduites
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.config.mode === 'auto') {
      this.config.mode = prefersDark ? 'dark' : 'light';
    }

    if (prefersReducedMotion) {
      this.config.reducedMotion = true;
      this.config.animations = false;
    }
  }

  /**
   * Configure les listeners pour les changements de préférences système
   */
  private setupMediaQueryListeners(): void {
    if (typeof window === 'undefined') return;

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    darkModeQuery.addEventListener('change', (e) => {
      if (this.config.mode === 'auto') {
        this.updateConfig({ mode: e.matches ? 'dark' : 'light' });
      }
    });

    reducedMotionQuery.addEventListener('change', (e) => {
      this.updateConfig({ 
        reducedMotion: e.matches,
        animations: e.matches ? false : this.config.animations
      });
    });
  }

  /**
   * Sauvegarde le thème dans localStorage
   */
  private saveTheme(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('tjc-theme', JSON.stringify(this.config));
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde du thème:', error);
    }
  }

  /**
   * Applique le thème au DOM
   */
  private applyTheme(): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const body = document.body;

    // Mode sombre/clair
    root.classList.toggle('dark', this.config.mode === 'dark');
    
    // Couleur primaire
    root.setAttribute('data-theme-color', this.config.primaryColor);
    
    // Taille de police
    root.setAttribute('data-font-size', this.config.fontSize);
    
    // Animations
    root.classList.toggle('no-animations', !this.config.animations || this.config.reducedMotion);
    
    // Contraste élevé
    root.classList.toggle('high-contrast', this.config.highContrast);
    
    // Mouvement réduit
    root.classList.toggle('reduced-motion', this.config.reducedMotion);

    // Variables CSS personnalisées
    const colors = THEME_COLORS[this.config.primaryColor];
    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-secondary', colors.secondary);
    root.style.setProperty('--theme-accent', colors.accent);
    root.style.setProperty('--theme-light', colors.light);
    root.style.setProperty('--theme-dark', colors.dark);

    // Classes pour les animations
    body.classList.toggle('animate-enabled', this.config.animations && !this.config.reducedMotion);
  }

  /**
   * Met à jour la configuration du thème
   */
  updateConfig(updates: Partial<ThemeConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveTheme();
    this.applyTheme();
    this.notifyListeners();
  }

  /**
   * Obtient la configuration actuelle
   */
  getConfig(): ThemeConfig {
    return { ...this.config };
  }

  /**
   * Bascule entre les modes clair/sombre
   */
  toggleMode(): void {
    const newMode = this.config.mode === 'dark' ? 'light' : 'dark';
    this.updateConfig({ mode: newMode });
  }

  /**
   * Définit un thème prédéfini
   */
  setPreset(preset: 'default' | 'dark' | 'high-contrast' | 'minimal'): void {
    switch (preset) {
      case 'default':
        this.updateConfig(DEFAULT_THEME);
        break;
      case 'dark':
        this.updateConfig({
          mode: 'dark',
          primaryColor: 'emerald',
          animations: true,
          highContrast: false,
        });
        break;
      case 'high-contrast':
        this.updateConfig({
          mode: 'light',
          primaryColor: 'blue',
          highContrast: true,
          animations: false,
        });
        break;
      case 'minimal':
        this.updateConfig({
          mode: 'light',
          primaryColor: 'blue',
          fontSize: 'sm',
          animations: false,
          reducedMotion: true,
        });
        break;
    }
  }

  /**
   * Ajoute un listener pour les changements de thème
   */
  addListener(callback: (config: ThemeConfig) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notifie tous les listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.config));
  }

  /**
   * Réinitialise le thème aux valeurs par défaut
   */
  reset(): void {
    this.updateConfig(DEFAULT_THEME);
  }
}

// Instance globale
export const themeManager = new ThemeManager();

// Hook React pour utiliser le thème
export function useTheme() {
  const [config, setConfig] = React.useState(themeManager.getConfig());

  React.useEffect(() => {
    return themeManager.addListener(setConfig);
  }, []);

  return {
    config,
    updateConfig: (updates: Partial<ThemeConfig>) => themeManager.updateConfig(updates),
    toggleMode: () => themeManager.toggleMode(),
    setPreset: (preset: Parameters<typeof themeManager.setPreset>[0]) => themeManager.setPreset(preset),
    reset: () => themeManager.reset(),
    colors: THEME_COLORS[config.primaryColor],
  };
}
