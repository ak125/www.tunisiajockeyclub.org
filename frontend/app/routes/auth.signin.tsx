import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { Eye, EyeOff, User, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  // const remember = formData.get("remember") === "on"; // Pour future implémentation
  
  if (!email || !password) {
    return json({
      error: "Email et mot de passe requis",
      success: false
    }, { status: 400 });
  }
  
  // Simulation de l'authentification (en réalité, vérifier avec la base de données)
  const mockUsers = [
    { email: "admin@tunisiajockeyclub.org", password: "admin123", role: "admin", name: "Administrateur" },
    { email: "manager@tunisiajockeyclub.org", password: "manager123", role: "manager", name: "Gestionnaire" },
    { email: "user@tunisiajockeyclub.org", password: "user123", role: "user", name: "Utilisateur" },
    { email: "demo@demo.com", password: "demo", role: "demo", name: "Démo" }
  ];
  
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return json({
      error: "Email ou mot de passe incorrect",
      success: false
    }, { status: 401 });
  }
  
  // En réalité, créer une session sécurisée avec JWT ou cookies
  // Pour la démo, on redirige vers le dashboard avec un paramètre
  const redirectUrl = `/dashboard?auth=success&user=${encodeURIComponent(user.name)}&role=${user.role}`;
  
  return redirect(redirectUrl);
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false
  });
  
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo et titre */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-full">
              <span className="text-3xl text-white">🏇</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tunisia Jockey Club
          </h1>
          <p className="text-gray-600">
            Connexion à l'espace professionnel
          </p>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <Form method="post" className="space-y-6">
            {/* Alerte d'erreur */}
            {actionData?.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">Erreur de connexion</p>
                  <p className="text-red-600 text-sm">{actionData.error}</p>
                </div>
              </div>
            )}

            {/* Champ email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Champ mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
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
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Votre mot de passe"
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

            {/* Se souvenir de moi */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={(e) => setFormData({...formData, remember: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Connexion...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Se connecter</span>
                </>
              )}
            </button>
          </Form>

          {/* Comptes de démonstration */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">Comptes de démonstration</p>
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="bg-blue-50 p-2 rounded border">
                <strong>Admin:</strong> admin@tunisiajockeyclub.org / admin123
              </div>
              <div className="bg-green-50 p-2 rounded border">
                <strong>Manager:</strong> manager@tunisiajockeyclub.org / manager123
              </div>
              <div className="bg-yellow-50 p-2 rounded border">
                <strong>Utilisateur:</strong> user@tunisiajockeyclub.org / user123
              </div>
              <div className="bg-purple-50 p-2 rounded border">
                <strong>Démo:</strong> demo@demo.com / demo
              </div>
            </div>
          </div>
        </div>

        {/* Liens utiles */}
        <div className="text-center space-y-2">
          <Link 
            to="/"
            className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
          >
            ← Retour à l'accueil
          </Link>
          <div className="text-sm text-gray-500">
            Pas encore de compte ? 
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
