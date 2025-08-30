import { json, type ActionFunction, type LoaderFunction } from "@remix-run/node";
import { useActionData, useLoaderData, Form, Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { ExecutiveBadge, ExecutiveButton, ExecutiveAlert } from "../components/ui/executive-components";
import { authenticate, createUserSession, getUserFromSession } from "../utils/auth.server";

interface ActionData {
  error?: string;
  success?: boolean;
}

export const loader: LoaderFunction = async ({ request }) => {
  // Rediriger si déjà connecté
  const user = await getUserFromSession(request);
  if (user) {
    throw new Response("", { status: 302, headers: { Location: "/dashboard" } });
  }

  // Vérifier les paramètres d'URL pour les messages
  const url = new URL(request.url);
  const message = url.searchParams.get("message");
  const error = url.searchParams.get("error");

  return json({ message, error });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();
  const redirectTo = formData.get("redirectTo")?.toString() || "/dashboard";

  if (!username || !password) {
    return json<ActionData>({ 
      error: "Nom d'utilisateur et mot de passe requis" 
    }, { status: 400 });
  }

  try {
    const user = await authenticate(username, password);
    
    if (!user) {
      return json<ActionData>({ 
        error: "Identifiants invalides" 
      }, { status: 401 });
    }

    return await createUserSession(user, redirectTo);
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    return json<ActionData>({ 
      error: "Erreur système. Veuillez réessayer." 
    }, { status: 500 });
  }
};

export default function Login() {
  const { message, error: urlError } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const [showPassword, setShowPassword] = useState(false);

  const error = actionData?.error || urlError;
  const hasError = Boolean(error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl"
            >
              <span className="text-white text-3xl font-bold">🏇</span>
            </motion.div>
            
            <h1 className="text-3xl font-black text-slate-800 mb-2">
              Accès Sécurisé
            </h1>
            <p className="text-slate-600 font-medium">
              Club Jockey Tunisie - Administration
            </p>
            
            <div className="mt-4">
              <ExecutiveBadge variant="ministerial" size="sm">
                SYSTÈME OFFICIEL
              </ExecutiveBadge>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <ExecutiveAlert
                variant="info"
                title="Information"
                message={message}
                dismissible
              />
            </motion.div>
          )}

          {hasError && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <ExecutiveAlert
                variant="critical"
                title="Erreur d'Authentification"
                message={error}
                dismissible
              />
            </motion.div>
          )}

          {/* Login Form */}
          <Form method="post" className="space-y-6">
                        <input type="hidden" name="redirectTo" value="/dashboard" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="username" className="block text-sm font-bold text-slate-700 mb-3">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-800 placeholder-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 font-medium"
                placeholder="Entrez votre nom d'utilisateur"
                autoComplete="username"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-3">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-800 placeholder-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 font-medium pr-12"
                  placeholder="Entrez votre mot de passe"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ExecutiveButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={false}
              >
                🔐 Connexion Sécurisée
              </ExecutiveButton>
            </motion.div>
          </Form>

          {/* Demo Credentials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 p-4 bg-slate-100 rounded-2xl"
          >
            <h3 className="text-sm font-bold text-slate-700 mb-3">Comptes de démonstration:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Super Admin:</span>
                <code className="font-mono bg-white px-2 py-1 rounded">admin / admin123</code>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Manager:</span>
                <code className="font-mono bg-white px-2 py-1 rounded">manager / manager123</code>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500 mb-4">
              Système protégé par authentification à deux facteurs
            </p>
            <div className="flex justify-center space-x-2">
              <ExecutiveBadge variant="certified" size="sm">SSL</ExecutiveBadge>
              <ExecutiveBadge variant="international" size="sm">ISO 27001</ExecutiveBadge>
            </div>
          </div>
        </motion.div>

        {/* Back to public site */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6"
        >
          <Link 
            to="/professional-demo" 
            className="text-white/70 hover:text-white transition-colors text-sm font-medium"
          >
            ← Retour au site public
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
