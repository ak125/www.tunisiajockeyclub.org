import React from 'react';
import { ThemeCustomizer } from '../components/ui/theme-customizer-simple';

/**
 * Settings Page with Theme Customization
 * Page de paramètres avec personnalisation du thème
 */
export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Paramètres & Personnalisation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Personnalisez l'apparence et les animations de votre interface Tunisia Jockey Club
          </p>
        </div>
        
        <ThemeCustomizer />
      </div>
    </div>
  );
}
