import { useState } from 'react';
import { Form, useNavigation } from '@remix-run/react';
import { Calculator, TrendingUp, Star, AlertCircle } from 'lucide-react';

interface IFHAFormProps {
  onSubmit?: (data: FormData) => void;
  className?: string;
}

interface FormErrors {
  horseId?: string;
  targetScale?: string;
}

export function IFHACalculatorForm({ onSubmit, className = "" }: IFHAFormProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    const horseId = formData.get('horseId') as string;
    const targetScale = formData.get('targetScale') as string;
    
    // Validation
    const newErrors: FormErrors = {};
    if (!horseId?.trim()) {
      newErrors.horseId = 'ID du cheval requis';
    }
    if (!targetScale) {
      newErrors.targetScale = 'Échelle cible requise';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      if (onSubmit) {
        onSubmit(formData);
      }
    }
  };

  const targetScales = [
    { value: 'france', label: 'France Galop', description: 'Système français officiel' },
    { value: 'uk', label: 'BHA (UK)', description: 'British Horseracing Authority' },
    { value: 'uae', label: 'UAE', description: 'Émirats Arabes Unis' },
    { value: 'ifha', label: 'IFHA', description: 'International Federation' }
  ];

  const isSubmitting = navigation.state === 'submitting' || isLoading;

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-2">
          <Calculator className="h-6 w-6 text-blue-600" />
          Calculateur Rating IFHA
        </h2>
        <p className="text-gray-600">
          Calculez et convertissez les ratings selon les standards internationaux
        </p>
      </div>

      <Form 
        method="post"
        onSubmit={handleSubmit}
        aria-label="Formulaire de calcul IFHA"
        role="form"
        className="space-y-6"
      >
        <fieldset disabled={isSubmitting} className="space-y-6">
          <legend className="sr-only">Paramètres de calcul rating IFHA</legend>
          
          {/* ID du cheval */}
          <div>
            <label 
              htmlFor="horseId" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              ID du Cheval <span className="text-red-500" aria-label="requis">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="horseId"
                name="horseId"
                required
                aria-required="true"
                aria-invalid={errors.horseId ? 'true' : 'false'}
                aria-describedby={errors.horseId ? 'horseId-error' : 'horseId-help'}
                placeholder="Entrez l'ID du cheval (ex: TJC-H-001)"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.horseId 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              />
              <TrendingUp className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            
            {errors.horseId ? (
              <p 
                id="horseId-error" 
                role="alert" 
                aria-live="polite"
                className="mt-2 text-sm text-red-600 flex items-center gap-1"
              >
                <AlertCircle className="h-4 w-4" />
                {errors.horseId}
              </p>
            ) : (
              <p id="horseId-help" className="mt-2 text-sm text-gray-500">
                Identifiant unique du cheval dans le système TJC
              </p>
            )}
          </div>

          {/* Échelle de conversion */}
          <div>
            <label 
              htmlFor="targetScale" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Échelle de Conversion <span className="text-red-500" aria-label="requis">*</span>
            </label>
            <select
              id="targetScale"
              name="targetScale"
              required
              aria-required="true"
              aria-invalid={errors.targetScale ? 'true' : 'false'}
              aria-describedby={errors.targetScale ? 'targetScale-error' : 'targetScale-help'}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.targetScale 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <option value="">Sélectionnez une échelle...</option>
              {targetScales.map((scale) => (
                <option key={scale.value} value={scale.value}>
                  {scale.label} - {scale.description}
                </option>
              ))}
            </select>
            
            {errors.targetScale ? (
              <p 
                id="targetScale-error" 
                role="alert" 
                aria-live="polite"
                className="mt-2 text-sm text-red-600 flex items-center gap-1"
              >
                <AlertCircle className="h-4 w-4" />
                {errors.targetScale}
              </p>
            ) : (
              <p id="targetScale-help" className="mt-2 text-sm text-gray-500">
                Système de rating international cible
              </p>
            )}
          </div>

          {/* Options avancées */}
          <details className="group">
            <summary className="cursor-pointer list-none">
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-sm font-medium text-gray-700">
                  Options avancées
                </span>
                <Star className="h-4 w-4 text-gray-400 group-open:rotate-180 transition-transform" />
              </div>
            </summary>
            
            <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50" role="region" aria-label="Options avancées">
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeHistory"
                    name="includeHistory"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includeHistory" className="ml-2 text-sm text-gray-700">
                    Inclure l'historique des performances
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="detailedAnalysis"
                    name="detailedAnalysis"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="detailedAnalysis" className="ml-2 text-sm text-gray-700">
                    Analyse détaillée avec facteurs de confiance
                  </label>
                </div>
              </div>
            </div>
          </details>

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={isSubmitting}
            aria-label={isSubmitting ? "Calcul en cours..." : "Calculer le rating IFHA"}
            className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-base font-medium text-white transition-all duration-200 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Calcul en cours...
              </>
            ) : (
              <>
                <Calculator className="h-5 w-5 mr-2" />
                Calculer le Rating IFHA
              </>
            )}
          </button>
        </fieldset>
      </Form>

      {/* Indicateur de statut */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200" role="status" aria-live="polite">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-700 font-medium">
            Système IFHA opérationnel
          </span>
        </div>
        <p className="text-xs text-green-600 mt-1">
          Cache Redis actif - Réponses optimisées
        </p>
      </div>
    </div>
  );
}

export default IFHACalculatorForm;
