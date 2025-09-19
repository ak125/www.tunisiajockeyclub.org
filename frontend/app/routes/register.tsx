import { json } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { Eye, EyeOff, User, Mail, Lock, AlertCircle, CheckCircle, Phone, Building } from "lucide-react";
import { useState } from "react";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const firstName = formData.get("firstName")?.toString();
  const lastName = formData.get("lastName")?.toString();
  const email = formData.get("email")?.toString();
  const phone = formData.get("phone")?.toString();
  const organization = formData.get("organization")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  const acceptTerms = formData.get("acceptTerms") === "on";
  
  // Validations
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return json({
      error: "Tous les champs obligatoires doivent être remplis",
      success: false
    }, { status: 400 });
  }
  
  if (password !== confirmPassword) {
    return json({
      error: "Les mots de passe ne correspondent pas",
      success: false
    }, { status: 400 });
  }
  
  if (password.length < 6) {
    return json({
      error: "Le mot de passe doit contenir au moins 6 caractères",
      success: false
    }, { status: 400 });
  }
  
  if (!acceptTerms) {
    return json({
      error: "Vous devez accepter les conditions d'utilisation",
      success: false
    }, { status: 400 });
  }
  
  // Vérifier si l'email existe déjà (simulation)
  const existingEmails = ["admin@tunisiajockeyclub.org", "manager@tunisiajockeyclub.org"];
  if (existingEmails.includes(email)) {
    return json({
      error: "Cette adresse email est déjà utilisée",
      success: false
    }, { status: 409 });
  }
  
  // Simulation de création du compte
  const newUser = {
    id: Date.now().toString(),
    firstName,
    lastName,
    email,
    phone: phone || null,
    organization: organization || null,
    role: "user",
    createdAt: new Date().toISOString()
  };
  
  // En réalité, sauvegarder en base de données
  console.log("Nouveau utilisateur créé:", newUser);
  
  return json({
    success: true,
    message: "Compte créé avec succès ! Vous pouvez maintenant vous connecter."
  });
}

export default function RegisterPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });
  
  const isSubmitting = navigation.state === "submitting";

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (actionData?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 text-center">
            <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Compte créé avec succès !
            </h1>
            <p className="text-gray-600 mb-6">
              {actionData.message}
            </p>
            <div className="space-y-3">
              <Link 
                to="/auth/signin"
                className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Se connecter maintenant
              </Link>
              <Link 
                to="/"
                className="block w-full text-blue-600 hover:text-blue-700 py-2"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo et titre */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-3 rounded-full">
              <span className="text-3xl text-white">🏇</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Rejoindre le Club
          </h1>
          <p className="text-gray-600">
            Créez votre compte professionnel
          </p>
        </div>

        {/* Formulaire d'inscription */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <Form method="post" className="space-y-6">
            {/* Alerte d'erreur */}
            {actionData?.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">Erreur</p>
                  <p className="text-red-600 text-sm">{actionData.error}</p>
                </div>
              </div>
            )}

            {/* Nom et Prénom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Jean"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Dupont"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Téléphone (optionnel) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="+216 12 345 678"
                />
              </div>
            </div>

            {/* Organisation (optionnelle) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organisation
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={(e) => updateField("organization", e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Votre organisation"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Minimum 6 caractères"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Répétez votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Conditions d'utilisation */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="acceptTerms"
                required
                checked={formData.acceptTerms}
                onChange={(e) => updateField("acceptTerms", e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              />
              <div className="text-sm text-gray-600">
                J'accepte les{" "}
                <Link to="/terms" className="text-blue-600 hover:text-blue-700 underline">
                  conditions d'utilisation
                </Link>{" "}
                et la{" "}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                  politique de confidentialité
                </Link>
              </div>
            </div>

            {/* Bouton d'inscription */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Création du compte...</span>
                </>
              ) : (
                <>
                  <User className="h-5 w-5" />
                  <span>Créer mon compte</span>
                </>
              )}
            </button>
          </Form>
        </div>

        {/* Liens utiles */}
        <div className="text-center space-y-2">
          <div className="text-sm text-gray-500">
            Déjà un compte ?{" "}
            <Link to="/auth/signin" className="text-blue-600 hover:text-blue-700 font-medium">
              Se connecter
            </Link>
          </div>
          <Link 
            to="/"
            className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center text-sm"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
