import React from 'react';
import { useTheme } from '../../utils/theme.client';
import { useAnimation } from '../../utils/animation.client';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Switch, Slider } from '../ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Settings, 
  Palette, 
  Accessibility, 
  Zap, 
  Monitor, 
  Moon, 
  Sun,
  Sparkles,
  Eye,
  Volume2,
  MousePointer,
  Smartphone,
  RefreshCw,
} from 'lucide-react';

interface ThemeCustomizerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function ThemeCustomizer({ isOpen = true }: ThemeCustomizerProps) {
  const { config, updateConfig, toggleMode, setPreset, colors, reset } = useTheme();
  const { animate, isReducedMotion } = useAnimation();
  const [selectedPreview, setSelectedPreview] = React.useState<string>('dashboard');

  const animationRef = React.useRef<HTMLDivElement>(null);

  const handleColorChange = (color: string) => {
    updateConfig({ primaryColor: color as any });
    if (animationRef.current && !isReducedMotion) {
      animate(animationRef, 'pulse');
    }
  };

  const handlePresetChange = (preset: string) => {
    setPreset(preset as any);
    if (animationRef.current && !isReducedMotion) {
      animate(animationRef, 'bounce');
    }
  };

  const handleFontSizeChange = (fontSize: string[]) => {
    updateConfig({ fontSize: fontSize[0] as any });
  };

  const previewComponents = {
    dashboard: (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Dashboard</h3>
          <Badge className="bg-primary text-primary-foreground">Nouveau</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Card className="p-3">
            <div className="text-sm text-muted-foreground">Courses</div>
            <div className="text-2xl font-bold" style={{ color: colors.primary }}>24</div>
          </Card>
          <Card className="p-3">
            <div className="text-sm text-muted-foreground">Chevaux</div>
            <div className="text-2xl font-bold" style={{ color: colors.accent }}>156</div>
          </Card>
        </div>
        <Button className="w-full">Voir les résultats</Button>
      </div>
    ),
    forms: (
      <div className="space-y-3">
        <div>
          <Label>Nom du cheval</Label>
          <div className="mt-1 h-8 bg-input rounded border flex items-center px-3">
            <span className="text-sm text-muted-foreground">Tornado</span>
          </div>
        </div>
        <div>
          <Label>Catégorie</Label>
          <div className="mt-1 h-8 bg-input rounded border flex items-center px-3">
            <span className="text-sm text-muted-foreground">Galop</span>
          </div>
        </div>
        <Button size="sm" className="w-full">Enregistrer</Button>
      </div>
    ),
    cards: (
      <div className="space-y-3">
        <Card className="p-3 border-l-4" style={{ borderLeftColor: colors.primary }}>
          <div className="font-semibold">Course du jour</div>
          <div className="text-sm text-muted-foreground mt-1">
            Prix de l'Arc de Triomphe
          </div>
        </Card>
        <Card className="p-3 border-l-4" style={{ borderLeftColor: colors.secondary }}>
          <div className="font-semibold">Résultats</div>
          <div className="text-sm text-muted-foreground mt-1">
            Dernière mise à jour il y a 5 min
          </div>
        </Card>
      </div>
    ),
  };

  return (
    <Card className="w-full max-w-4xl mx-auto" ref={animationRef}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Personnalisation de l'interface</h2>
            <p className="text-muted-foreground">
              Adaptez l'apparence selon vos préférences
            </p>
          </div>
        </div>

        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Apparence
            </TabsTrigger>
            <TabsTrigger value="animations" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Animations
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center gap-2">
              <Accessibility className="h-4 w-4" />
              Accessibilité
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Aperçu
            </TabsTrigger>
          </TabsList>

          {/* Apparence */}
          <TabsContent value="appearance" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Thème Mode */}
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      {config.mode === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      Mode d'affichage
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleMode}
                      className="flex items-center gap-2"
                    >
                      <Monitor className="h-4 w-4" />
                      {config.mode === 'dark' ? 'Sombre' : 'Clair'}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Choisissez entre le mode clair et sombre, ou laissez le système décider.
                  </p>
                </Card>

                {/* Couleurs */}
                <Card className="p-4">
                  <Label className="text-base font-semibold flex items-center gap-2 mb-4">
                    <Palette className="h-4 w-4" />
                    Palette de couleurs
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries({
                      'turf-green': { name: 'Vert Hippique', color: '#2D5016' },
                      blue: { name: 'Bleu Classic', color: '#3B82F6' },
                      emerald: { name: 'Émeraude', color: '#10B981' },
                      purple: { name: 'Violet Royal', color: '#A855F7' },
                      amber: { name: 'Ambre Doré', color: '#F59E0B' },
                      rose: { name: 'Rose Passion', color: '#EC4899' },
                    }).map(([key, { name, color }]) => (
                      <button
                        key={key}
                        onClick={() => handleColorChange(key)}
                        className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                          config.primaryColor === key
                            ? 'border-primary shadow-lg'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-full mx-auto mb-2"
                          style={{ backgroundColor: color }}
                        />
                        <div className="text-xs font-medium">{name}</div>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Taille de police */}
                <Card className="p-4">
                  <Label className="text-base font-semibold flex items-center gap-2 mb-4">
                    <MousePointer className="h-4 w-4" />
                    Taille de police
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Petite</span>
                      <span className="text-sm">Normale</span>
                      <span className="text-sm">Grande</span>
                    </div>
                    <Slider
                      value={[config.fontSize === 'sm' ? 0 : config.fontSize === 'base' ? 1 : 2]}
                      onValueChange={(value) => 
                        handleFontSizeChange([['sm', 'base', 'lg'][value[0]]])
                      }
                      max={2}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                {/* Thèmes prédéfinis */}
                <Card className="p-4">
                  <Label className="text-base font-semibold flex items-center gap-2 mb-4">
                    <Sparkles className="h-4 w-4" />
                    Thèmes prédéfinis
                  </Label>
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
                        className="w-full justify-between h-auto p-3"
                        onClick={() => handlePresetChange(key)}
                      >
                        <div className="text-left">
                          <div className="font-medium">{name}</div>
                          <div className="text-xs text-muted-foreground">{desc}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </Card>

                {/* Actions */}
                <Card className="p-4">
                  <div className="flex gap-2">
                    <Button onClick={reset} variant="outline" className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Réinitialiser
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Animations */}
          <TabsContent value="animations" className="space-y-6">
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-semibold">Animations</Label>
                    <p className="text-sm text-muted-foreground mt-1">
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
                    <Label className="text-base font-semibold">Mouvement réduit</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Respecte la préférence système pour les mouvements réduits
                    </p>
                  </div>
                  <Switch
                    checked={config.reducedMotion}
                    onCheckedChange={(reducedMotion) => updateConfig({ reducedMotion })}
                  />
                </div>

                {config.animations && !config.reducedMotion && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
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
          </TabsContent>

          {/* Accessibilité */}
          <TabsContent value="accessibility" className="space-y-6">
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-semibold">Contraste élevé</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Augmente le contraste pour une meilleure lisibilité
                    </p>
                  </div>
                  <Switch
                    checked={config.highContrast}
                    onCheckedChange={(highContrast) => updateConfig({ highContrast })}
                  />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 className="h-4 w-4" />
                    <span className="font-semibold">Support écran-lecteur</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Interface compatible avec les technologies d'assistance.
                    Navigation au clavier optimisée.
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="h-4 w-4" />
                    <span className="font-semibold">Interface adaptative</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Optimisé pour tous les appareils et tailles d'écran.
                    Support des gestes tactiles.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Aperçu */}
          <TabsContent value="preview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-semibold mb-4 block">
                  Sélectionner un composant
                </Label>
                <Select value={selectedPreview} onValueChange={setSelectedPreview}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">Tableau de bord</SelectItem>
                    <SelectItem value="forms">Formulaires</SelectItem>
                    <SelectItem value="cards">Cartes d'information</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Card className="p-4">
                <div className="mb-3">
                  <Label className="text-sm font-semibold">Aperçu en temps réel</Label>
                </div>
                {previewComponents[selectedPreview as keyof typeof previewComponents]}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
