import { createCookieSessionStorage } from '@remix-run/node';

// Configuration de session améliorée pour Remix
const SESSION_SECRET = process.env.SESSION_SECRET || 'tunisia-jockey-club-default-secret-key';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: 'tjc_session', // Nom spécifique au Tunisia Jockey Club
    secrets: [SESSION_SECRET],
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    path: '/',
    sameSite: 'lax',
    secure: IS_PRODUCTION,
  },
});

// Types pour les données de session
export interface SessionData {
  user?: {
    id?: string;
    email: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    sessionToken?: string;
  };
  csrfToken?: string;
  lastActivity?: number;
}

// Utilitaires de session avancés
export async function validateSession(request: Request): Promise<boolean> {
  try {
    const session = await getSession(request.headers.get('Cookie'));
    const lastActivity = session.get('lastActivity');
    
    if (!lastActivity) {
      return false;
    }
    
    // Vérifier si la session n'a pas expiré (24 heures d'inactivité)
    const maxInactivity = 24 * 60 * 60 * 1000; // 24 heures
    const isExpired = (Date.now() - lastActivity) > maxInactivity;
    
    return !isExpired;
  } catch (error) {
    console.warn('Erreur validation session:', error);
    return false;
  }
}

export async function updateSessionActivity(request: Request): Promise<Response | null> {
  try {
    const session = await getSession(request.headers.get('Cookie'));
    session.set('lastActivity', Date.now());
    
    return new Response(null, {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  } catch (error) {
    console.warn('Erreur mise à jour activité session:', error);
    return null;
  }
}

export { getSession, commitSession, destroySession };
