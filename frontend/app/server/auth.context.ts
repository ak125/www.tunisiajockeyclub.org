import { AppLoadContext } from '@remix-run/node';

export interface SessionUser {
  id: string;
  email: string;
  name?: string;
}

// Pas besoin d'interface séparée, AppLoadContext a déjà user: unknown

// Helper pour créer un contexte d'authentification sûr
export function createAuthContext(request: Request, context: AppLoadContext): AppLoadContext {
  const authContext = { ...context };
  
  // Vérifier si l'utilisateur est déjà dans le contexte
  if (!authContext.user) {
    // Essayer de récupérer l'utilisateur depuis les headers de session
    const sessionHeader = request.headers.get('x-session-user');
    if (sessionHeader) {
      try {
        authContext.user = JSON.parse(sessionHeader);
      } catch (error) {
        console.warn('Session header invalide:', error);
      }
    }
  }
  
  return authContext;
}

// Mock d'authentification pour le développement
export function createMockAuthContext(context: AppLoadContext, userId?: string): AppLoadContext {
  const authContext = { ...context };
  
  if (process.env.NODE_ENV === 'development' && userId) {
    authContext.user = {
      id: userId,
      email: `user${userId}@tunisiajockeyclub.com`,
      name: `Utilisateur ${userId}`,
    } as SessionUser;
  }
  
  return authContext;
}

// Fonction pour vérifier si un utilisateur est authentifié
export function isAuthenticated(context: AppLoadContext): boolean {
  return context.user != null;
}

// Helper pour obtenir l'utilisateur de manière sûre
export function getSessionUser(context: AppLoadContext): SessionUser | null {
  if (!context.user) return null;
  
  try {
    // Si c'est déjà un SessionUser valide
    if (typeof context.user === 'object' && 
        context.user !== null &&
        'id' in context.user &&
        'email' in context.user) {
      return context.user as SessionUser;
    }
  } catch (error) {
    console.warn('Erreur lors de la conversion de l\'utilisateur:', error);
  }
  
  return null;
}
