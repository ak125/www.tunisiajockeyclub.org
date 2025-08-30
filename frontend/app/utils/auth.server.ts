import { redirect, type AppLoadContext } from '@remix-run/node';
import { getSession, destroySession, commitSession } from './session.server';
import { z } from 'zod';

// Schema de validation pour l'utilisateur authentifié
const authenticatedUserSchema = z.object({
  id: z.string().optional(),
  email: z.string(),
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  sessionToken: z.string().optional(),
});

export interface User {
  id?: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  sessionToken?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  source?: string;
  performance?: {
    duration: number;
    mode: string;
  };
  timestamp?: string;
}

// Configuration de l'API backend
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// ==========================================
// FONCTIONS CORE D'AUTHENTIFICATION
// ==========================================

/**
 * Authentifier un utilisateur via le backend NestJS
 */
export async function authenticate(email: string, password: string): Promise<User | null> {
  try {
    console.log(`🔐 Authentification tentée pour: ${email}`);
    
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result: AuthResponse = await response.json();
    console.log(`📋 Réponse auth backend:`, result);

    if (result.success && result.user) {
      console.log(`✅ Authentification réussie pour: ${email} (${result.source})`);
      return result.user;
    }
    
    console.log(`❌ Échec authentification pour: ${email} - ${result.message}`);
    return null;
  } catch (error) {
    console.error('❌ Erreur authentification:', error);
    return null;
  }
}

/**
 * Vérifier et valider les informations d'un utilisateur
 */
function validateUser(userData: unknown): User | null {
  try {
    const validatedUser = authenticatedUserSchema.parse(userData);
    return {
      id: validatedUser.id,
      email: validatedUser.email,
      name: validatedUser.name || validatedUser.firstName || '',
      firstName: validatedUser.firstName || validatedUser.name,
      lastName: validatedUser.lastName,
      sessionToken: validatedUser.sessionToken,
    };
  } catch (error) {
    console.warn('⚠️ Données utilisateur invalides:', error);
    return null;
  }
}

// ==========================================
// GESTION DES SESSIONS
// ==========================================

/**
 * Récupérer l'utilisateur depuis la session Remix
 */
export async function getUserFromSession(request: Request): Promise<User | null> {
  try {
    const session = await getSession(request.headers.get('Cookie'));
    const userData = session.get('user');
    
    if (!userData) {
      return null;
    }

    return validateUser(userData);
  } catch (error) {
    console.error('Erreur récupération session utilisateur:', error);
    return null;
  }
}

/**
 * Récupérer l'utilisateur depuis le contexte (pour compatibility)
 */
export async function getUserFromContext(context: AppLoadContext): Promise<User | null> {
  try {
    const sessionUser = context?.session?.get('user');
    if (!sessionUser) {
      return null;
    }
    return validateUser(sessionUser);
  } catch (error) {
    console.error('Erreur récupération contexte utilisateur:', error);
    return null;
  }
}

/**
 * Créer une session utilisateur après authentification
 */
export async function createUserSession({
  request,
  userId,
  user,
  redirectTo,
  remember = false,
}: {
  request: Request;
  userId?: string;
  user?: User;
  redirectTo: string;
  remember?: boolean;
}) {
  const session = await getSession(request.headers.get('Cookie'));
  
  // Utiliser user si fourni, sinon créer un objet basique avec userId
  const userData: User = user || { 
    id: userId, 
    email: '', 
    name: '',
    sessionToken: `session_${Date.now()}`
  };
  
  session.set('user', userData);

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await commitSession(session, {
        maxAge: remember ? 60 * 60 * 24 * 7 : undefined, // 7 jours si remember
      }),
    },
  });
}

// ==========================================
// FONCTIONS DE CONTRÔLE D'ACCÈS
// ==========================================

/**
 * Obtenir l'utilisateur optionnel (compatible avec les deux systèmes)
 */
export async function getOptionalUser(
  requestOrContext: Request | { context: AppLoadContext }
): Promise<User | null> {
  if (requestOrContext instanceof Request) {
    return getUserFromSession(requestOrContext);
  } else if ('context' in requestOrContext) {
    return getUserFromContext(requestOrContext.context);
  } else {
    // Fallback pour compatibilité
    return getUserFromSession(requestOrContext as Request);
  }
}

/**
 * Exiger une authentification (pour Request)
 */
export async function requireAuth(request: Request): Promise<User> {
  const user = await getUserFromSession(request);
  if (!user) {
    throw redirect('/login');
  }
  return user;
}

/**
 * Exiger une authentification (pour Context)
 */
export async function requireUser(context: { context: AppLoadContext }): Promise<User> {
  const user = await getUserFromContext(context.context);
  if (!user) {
    throw redirect('/login');
  }
  return user;
}

// ==========================================
// HIGHER-ORDER FUNCTIONS POUR SÉCURITÉ
// ==========================================

/**
 * Créer un loader sécurisé qui vérifie l'authentification
 */
export function createSecureLoader<T>(
  loaderFn: (args: { request: Request; user: User }) => T | Promise<T>
) {
  return async ({ request }: { request: Request }) => {
    const user = await requireAuth(request);
    return loaderFn({ request, user });
  };
}

/**
 * Créer un loader sécurisé spécifique pour les ratings
 */
export function createRatingSecureLoader<T>(
  loaderFn: (args: { request: Request; user: User }) => T | Promise<T>
) {
  return createSecureLoader(loaderFn);
}

/**
 * Créer un action sécurisé qui vérifie l'authentification
 */
export function createSecureAction<T>(
  actionFn: (args: { request: Request; user: User }) => T | Promise<T>
) {
  return async ({ request }: { request: Request }) => {
    const user = await requireAuth(request);
    return actionFn({ request, user });
  };
}

// ==========================================
// GESTION DES PERMISSIONS
// ==========================================

export enum Permission {
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin',
  RATING = 'rating',
  COURSES = 'courses',
  HORSES = 'horses',
  TOURNAMENTS = 'tournaments',
  JOCKEYS = 'jockeys',
  ANALYTICS = 'analytics',
}

/**
 * Vérifier les permissions d'un utilisateur
 */
export function hasPermission(user: User | null, permission: Permission | string): boolean {
  if (!user) return false;
  
  // Pour l'instant, tous les utilisateurs connectés ont toutes les permissions
  // TODO: Implémenter un système de rôles plus sophistiqué
  return true;
}

/**
 * Exiger une permission spécifique
 */
export async function requirePermission(
  request: Request, 
  permission: Permission | string
): Promise<User> {
  const user = await requireAuth(request);
  
  if (!hasPermission(user, permission)) {
    throw redirect('/unauthorized');
  }
  
  return user;
}

// ==========================================
// DÉCONNEXION
// ==========================================

/**
 * Déconnecter l'utilisateur et détruire la session
 */
export async function logout(request: Request) {
  const session = await getSession(request.headers.get('Cookie'));
  
  // Optionnel: Notifier le backend de la déconnexion
  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.warn('Avertissement: Impossible de notifier le backend de la déconnexion:', error);
  }
  
  return redirect('/login', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
}

// ==========================================
// UTILITAIRES AVANCÉS
// ==========================================

/**
 * Vérifier si l'utilisateur a une session valide
 */
export async function isAuthenticated(request: Request): Promise<boolean> {
  const user = await getUserFromSession(request);
  return user !== null;
}

/**
 * Obtenir les informations de session pour le debugging
 */
export async function getSessionInfo(request: Request): Promise<{
  hasSession: boolean;
  user?: User;
  sessionAge?: number;
}> {
  const session = await getSession(request.headers.get('Cookie'));
  const user = await getUserFromSession(request);
  
  return {
    hasSession: !!user,
    user: user || undefined,
  };
}

/**
 * Rafraîchir la session utilisateur depuis le backend
 */
export async function refreshUserSession(request: Request): Promise<User | null> {
  const currentUser = await getUserFromSession(request);
  if (!currentUser?.email) {
    return null;
  }

  try {
    // Vérifier avec le backend si l'utilisateur est toujours valide
    const response = await fetch(`${API_BASE_URL}/api/auth/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: currentUser.email,
        sessionToken: currentUser.sessionToken 
      }),
    });

    const result = await response.json();
    
    if (result.success && result.user) {
      // Mettre à jour la session avec les nouvelles informations
      const session = await getSession(request.headers.get('Cookie'));
      session.set('user', result.user);
      await commitSession(session);
      return result.user;
    }
  } catch (error) {
    console.warn('Impossible de rafraîchir la session:', error);
  }
  
  return currentUser;
}
