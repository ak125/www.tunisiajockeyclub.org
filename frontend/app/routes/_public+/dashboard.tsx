import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getUserFromSession } from "~/utils/auth.server";

// Redirection intelligente selon l'état d'authentification
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const user = await getUserFromSession(request);
    
    console.log(`🎯 Dashboard redirect - Utilisateur: ${user?.email}, Auth: ${!!user}`);
    
    if (!user) {
      // Non connecté → page de connexion
      console.log('❌ Utilisateur non authentifié, redirection vers /login');
      return redirect("/login");
    }
    
    // Connecté → redirection intelligente selon le rôle
    const redirectUrl = getRedirectUrlForUser(user);
    console.log(`✅ Utilisateur ${user.email} redirigé vers: ${redirectUrl}`);
    
    return redirect(redirectUrl);
    
  } catch (error) {
    console.error('❌ Erreur dans le loader dashboard:', error);
    // En cas d'erreur, rediriger vers la connexion par sécurité
    return redirect("/login");
  }
}

/**
 * Déterminer l'URL de redirection selon l'utilisateur
 */
function getRedirectUrlForUser(user: any): string {
  // Si l'email contient 'admin', rediriger vers admin
  if (user.email?.includes('admin')) {
    return "/admin";
  }
  
  // Utilisateur normal vers member
  return "/member";
}

// Composant qui ne sera jamais rendu grâce à la redirection
export default function DashboardRedirect() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirection en cours...</p>
      </div>
    </div>
  );
}