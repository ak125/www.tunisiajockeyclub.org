import { createCookieSessionStorage, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";

// Configuration de session
const sessionSecret = process.env.SESSION_SECRET || "default-secret-for-dev";
if (sessionSecret === "default-secret-for-dev" && process.env.NODE_ENV === "production") {
  throw new Error("Vous devez définir une SESSION_SECRET en production");
}

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "tjc_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    httpOnly: true,
  },
});

// Types d'utilisateur
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'manager' | 'viewer';
  firstName: string;
  lastName: string;
  lastLogin?: string;
  isActive: boolean;
}

// Base de données simulée des administrateurs (en production, utiliser Supabase)
const ADMIN_USERS: Record<string, { 
  password: string; 
  user: Omit<User, 'lastLogin'>; 
}> = {
  "admin": {
    password: "$2a$10$8K1.zWzGXvGlqPEcFqxL7O8K2pZz8fKs4jCc9VrQhKtGlW2V4Z0QG", // "admin123"
    user: {
      id: "1",
      username: "admin",
      email: "admin@jockeyclub.tn",
      role: "super_admin",
      firstName: "Administrateur",
      lastName: "Système",
      isActive: true
    }
  },
  "manager": {
    password: "$2a$10$8K1.zWzGXvGlqPEcFqxL7O8K2pZz8fKs4jCc9VrQhKtGlW2V4Z0QG", // "manager123"
    user: {
      id: "2", 
      username: "manager",
      email: "manager@jockeyclub.tn",
      role: "manager",
      firstName: "Gestionnaire",
      lastName: "Principal",
      isActive: true
    }
  }
};

// Authentification
export async function authenticate(username: string, password: string): Promise<User | null> {
  const adminData = ADMIN_USERS[username.toLowerCase()];
  
  if (!adminData || !adminData.user.isActive) {
    return null;
  }

  const isValid = await bcrypt.compare(password, adminData.password);
  if (!isValid) {
    return null;
  }

  return {
    ...adminData.user,
    lastLogin: new Date().toISOString()
  };
}

// Gestion des sessions
export async function createUserSession(user: User, redirectTo: string = "/executive") {
  const session = await getSession();
  session.set("userId", user.id);
  session.set("userRole", user.role);
  session.set("lastActivity", Date.now());
  
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function getUserFromSession(request: Request): Promise<User | null> {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const lastActivity = session.get("lastActivity");
  
  if (!userId) return null;

  // Vérifier l'expiration de session (2 heures d'inactivité)
  if (lastActivity && Date.now() - lastActivity > 2 * 60 * 60 * 1000) {
    return null;
  }

  // Trouver l'utilisateur (en production, requête à Supabase)
  for (const adminData of Object.values(ADMIN_USERS)) {
    if (adminData.user.id === userId && adminData.user.isActive) {
      return {
        ...adminData.user,
        lastLogin: new Date().toISOString()
      };
    }
  }

  return null;
}

export async function requireAuth(request: Request, allowedRoles?: User['role'][]): Promise<User> {
  const user = await getUserFromSession(request);
  
  if (!user) {
    throw redirect("/login");
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw redirect("/executive?error=unauthorized");
  }

  return user;
}

export async function logout(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

// Vérification des permissions
export function hasPermission(user: User, action: string): boolean {
  const permissions = {
    super_admin: ['read', 'write', 'delete', 'manage_users', 'system_config', 'export_data'],
    admin: ['read', 'write', 'delete', 'export_data'],
    manager: ['read', 'write', 'export_data'],
    viewer: ['read']
  };

  return permissions[user.role]?.includes(action) || false;
}

// Hash password utility (pour créer de nouveaux utilisateurs)
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
