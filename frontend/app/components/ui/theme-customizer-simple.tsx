import React from 'react';

import { useAnimation } from '../../utils/animation.client';
import { useTheme, THEME_COLORS, type ThemeColor } from '../../utils/theme.client';

interface ThemeCustomizerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// Composants UI simples intégrés
/**
 * Card Component
 */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  ref?: React.RefObject<HTMLDivElement>;
}

function Card({ children, className = '', ref }: CardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 ${className}`} ref={ref}>
      {children}
    </div>
  );
}const Button = ({ children, onClick, variant = 'default', size = 'default', className = '', ...props }: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm';
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`
      inline-flex items-center justify-center rounded-md font-medium transition-colors
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
      disabled:pointer-events-none disabled:opacity-50
      ${size === 'sm' ? 'h-8 px-3 text-xs' : 'h-10 px-4 py-2 text-sm'}
      ${variant === 'outline' 
        ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' 
        : 'bg-primary text-primary-foreground hover:bg-primary/90'
      }
      ${className}
    `}
    {...props}
  >
    {children}
  </button>
);

const Badge = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary ${className}`}>
    {children}
  </span>
);

const Switch = ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={`
      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
      ${checked ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}
    `}
  >
    <span
      className={`
        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
        ${checked ? 'translate-x-6' : 'translate-x-1'}
      `}
    />
  </button>
);

export function ThemeCustomizer({ isOpen = true }: ThemeCustomizerProps) {
  const { config, updateConfig, toggleMode, setPreset, colors, reset } = useTheme();
  const { animate, isReducedMotion } = useAnimation();
  const [activeTab, setActiveTab] = React.useState<string>('appearance');
  const [selectedPreview, setSelectedPreview] = React.useState<string>('dashboard');

  const animationRef = React.useRef<HTMLDivElement>(null);

  const handleColorChange = (color: ThemeColor) => {
    updateConfig({ primaryColor: color });
    if (animationRef.current && !isReducedMotion) {
      animate(animationRef, 'pulse');
    }
  };

  const handlePresetChange = (preset: 'default' | 'dark' | 'high-contrast' | 'minimal') => {
    setPreset(preset);
    if (animationRef.current && !isReducedMotion) {
      animate(animationRef, 'bounce');
    }
  };

  const previewComponents = {
    dashboard: (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Dashboard</h3>
          <Badge>Nouveau</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <div className="text-sm text-gray-600 dark:text-gray-400">Courses</div>
            <div className="text-2xl font-bold" style={{ color: colors.primary }}>24</div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <div className="text-sm text-gray-600 dark:text-gray-400">Chevaux</div>
            <div className="text-2xl font-bold" style={{ color: colors.accent }}>156</div>
          </div>
        </div>
        <Button className="w-full">Voir les résultats</Button>
      </div>
    ),
    forms: (
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Nom du cheval</label>
          <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded border flex items-center px-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">Tornado</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Catégorie</label>
          <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded border flex items-center px-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">Galop</span>
          </div>
        </div>
        <Button size="sm" className="w-full">Enregistrer</Button>
      </div>
    ),
    cards: (
      <div className="space-y-3">
        <div className={`p-3 bg-white dark:bg-gray-800 rounded border-l-4`} style={{ borderLeftColor: colors.primary }}>
          <div className="font-semibold">Course du jour</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Prix de l'Arc de Triomphe
          </div>
        </div>
        <div className={`p-3 bg-white dark:bg-gray-800 rounded border-l-4`} style={{ borderLeftColor: colors.secondary }}>
          <div className="font-semibold">Résultats</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Dernière mise à jour il y a 5 min
          </div>
        </div>
      </div>
    ),
  };

  if (!isOpen) return null;

  return (
    <Card className="w-full max-w-4xl mx-auto p-6" ref={animationRef}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <span className="text-white text-lg">🎨</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Personnalisation de l'interface</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Adaptez l'apparence selon vos préférences
          </p>
        </div>
      </div>

      {/* Navigation des onglets */}
      <div className="flex space-x-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-1 mb-6">
        {[
          { key: 'appearance', label: '🎨 Apparence' },
          { key: 'animations', label: '⚡ Animations' },
          { key: 'accessibility', label: '♿ Accessibilité' },
          { key: 'preview', label: '👁️ Aperçu' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`
              flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-2
              text-sm font-medium transition-all
              ${activeTab === key 
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      <div className="space-y-6">
        {/* Onglet Apparence */}
        {activeTab === 'appearance' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Mode sombre/clair */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold flex items-center gap-2">
                      {config.mode === 'dark' ? '🌙' : '☀️'} Mode d'affichage
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Choisissez entre le mode clair et sombre
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleMode}
                  >
                    🔄 {config.mode === 'dark' ? 'Sombre' : 'Clair'}
                  </Button>
                </div>
              </Card>

              {/* Couleurs */}
              <Card className="p-4">
                <h3 className="text-base font-semibold flex items-center gap-2 mb-4">
                  🎨 Palette de couleurs
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(THEME_COLORS).map(([key, colorData]) => (
                    <button
                      key={key}
                      onClick={() => handleColorChange(key as ThemeColor)}
                      className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                        config.primaryColor === key
                          ? 'border-blue-500 shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full mx-auto mb-2"
                        style={{ backgroundColor: colorData.primary }}
                      />
                      <div className="text-xs font-medium">{colorData.name}</div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Taille de police */}
              <Card className="p-4">
                <h3 className="text-base font-semibold flex items-center gap-2 mb-4">
                  🔤 Taille de police
                </h3>
                <div className="flex gap-2">
                  {[
                    { key: 'sm', label: 'Petite' },
                    { key: 'base', label: 'Normale' },
                    { key: 'lg', label: 'Grande' },
                  ].map(({ key, label }) => (
                    <Button
                      key={key}
                      variant={config.fontSize === key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateConfig({ fontSize: key as any })}
                      className="flex-1"
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              {/* Thèmes prédéfinis */}
              <Card className="p-4">
                <h3 className="text-base font-semibold flex items-center gap-2 mb-4">
                  ✨ Thèmes prédéfinis
                </h3>
                <div className="space-y-2">
                  {[
                    { key: 'default', name: 'Par défaut', desc: 'Configuration standard' },
                    { key: 'dark', name: 'Sombre élégant', desc: 'Interface sombre moderne' },
                    { key: 'high-contrast', name: 'Contraste élevé', desc: 'Pour une meilleure lisibilité' },
                    { key: 'minimal', name: 'Minimal', desc: 'Interface épurée et simple' },
                  ].map(({ key, name, desc }) => (
                    <Button
                      key={key}
                      variant="outline"
                      className="w-full justify-start h-auto p-3 text-left"
                      onClick={() => handlePresetChange(key as any)}
                    >
                      <div>
                        <div className="font-medium">{name}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{desc}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </Card>

              {/* Actions */}
              <Card className="p-4">
                <Button onClick={reset} variant="outline" className="w-full">
                  🔄 Réinitialiser
                </Button>
              </Card>
            </div>
          </div>
        )}

        {/* Onglet Animations */}
        {activeTab === 'animations' && (
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">⚡ Animations</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Active ou désactive les animations de l'interface
                  </p>
                </div>
                <Switch
                  checked={config.animations}
                  onCheckedChange={(animations) => updateConfig({ animations })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">🐌 Mouvement réduit</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Respecte la préférence système pour les mouvements réduits
                  </p>
                </div>
                <Switch
                  checked={config.reducedMotion}
                  onCheckedChange={(reducedMotion) => updateConfig({ reducedMotion })}
                />
              </div>

              {config.animations && !config.reducedMotion && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-semibold mb-2">Test d'animations</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['fadeIn', 'slideUp', 'bounce', 'pulse'].map((animation) => (
                      <Button
                        key={animation}
                        variant="outline"
                        size="sm"
                        onClick={() => animationRef.current && animate(animationRef, animation as any)}
                      >
                        {animation}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Onglet Accessibilité */}
        {activeTab === 'accessibility' && (
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">👁️ Contraste élevé</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Augmente le contraste pour une meilleure lisibilité
                  </p>
                </div>
                <Switch
                  checked={config.highContrast}
                  onCheckedChange={(highContrast) => updateConfig({ highContrast })}
                />
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span>🔊</span>
                  <span className="font-semibold">Support écran-lecteur</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Interface compatible avec les technologies d'assistance.
                  Navigation au clavier optimisée.
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span>📱</span>
                  <span className="font-semibold">Interface adaptative</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Optimisé pour tous les appareils et tailles d'écran.
                  Support des gestes tactiles.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Onglet Aperçu */}
        {activeTab === 'preview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-base font-semibold mb-4 block">
                Sélectionner un composant
              </h3>
              <div className="space-y-2">
                {[
                  { key: 'dashboard', label: 'Tableau de bord' },
                  { key: 'forms', label: 'Formulaires' },
                  { key: 'cards', label: 'Cartes d\'information' },
                ].map(({ key, label }) => (
                  <Button
                    key={key}
                    variant={selectedPreview === key ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setSelectedPreview(key)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            <Card className="p-4">
              <div className="mb-3">
                <h3 className="text-sm font-semibold">Aperçu en temps réel</h3>
              </div>
              {previewComponents[selectedPreview as keyof typeof previewComponents]}
            </Card>
          </div>
        )}
      </div>
    </Card>
  );
}
