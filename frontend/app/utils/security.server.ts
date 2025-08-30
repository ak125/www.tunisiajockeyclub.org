import { redirect } from '@remix-run/node';
import { getUserFromSession, type User } from './auth.server';

export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export interface SecurityContext {
  user: User | null;
  role: UserRole;
  permissions: string[];
  isAuthenticated: boolean;
  sessionAge: number;
}

/**
 * Middleware de sécurité avancé
 */
export class SecurityMiddleware {
  
  /**
   * Créer un contexte de sécurité pour une requête
   */
  static async createSecurityContext(request: Request): Promise<SecurityContext> {
    const user = await getUserFromSession(request);
    
    return {
      user,
      role: user ? this.getUserRole(user) : UserRole.GUEST,
      permissions: user ? this.getUserPermissions(user) : [],
      isAuthenticated: !!user,
      sessionAge: 0, // TODO: Calculer l'âge de session
    };
  }
  
  /**
   * Déterminer le rôle d'un utilisateur
   */
  private static getUserRole(user: User): UserRole {
    // TODO: Implémenter la logique de rôle basée sur les données utilisateur
    // Pour l'instant, tous les utilisateurs connectés sont des utilisateurs normaux
    if (user.email?.includes('admin')) {
      return UserRole.ADMIN;
    }
    return UserRole.USER;
  }
  
  /**
   * Obtenir les permissions d'un utilisateur
   */
  private static getUserPermissions(user: User): string[] {
    const role = this.getUserRole(user);
    
    const permissions: Record<UserRole, string[]> = {
      [UserRole.GUEST]: [],
      [UserRole.USER]: ['read', 'courses.view', 'horses.view'],
      [UserRole.ADMIN]: ['read', 'write', 'courses.manage', 'horses.manage', 'ratings.manage'],
      [UserRole.SUPER_ADMIN]: ['*'], // Toutes les permissions
    };
    
    return permissions[role] || [];
  }
  
  /**
   * Vérifier si un utilisateur a une permission spécifique
   */
  static hasPermission(context: SecurityContext, permission: string): boolean {
    if (!context.isAuthenticated) return false;
    
    // Super admin a toutes les permissions
    if (context.permissions.includes('*')) return true;
    
    // Vérifier la permission exacte
    if (context.permissions.includes(permission)) return true;
    
    // Vérifier les permissions wildcard
    const wildcardPermissions = context.permissions
      .filter(p => p.endsWith('*'))
      .map(p => p.slice(0, -1));
      
    return wildcardPermissions.some(prefix => permission.startsWith(prefix));
  }
  
  /**
   * Middleware pour protéger les routes
   */
  static requireAuth() {
    return async ({ request }: { request: Request }) => {
      const context = await this.createSecurityContext(request);
      
      if (!context.isAuthenticated) {
        throw redirect('/login');
      }
      
      return context;
    };
  }
  
  /**
   * Middleware pour protéger avec permission spécifique
   */
  static requirePermission(permission: string) {
    return async ({ request }: { request: Request }) => {
      const context = await this.createSecurityContext(request);
      
      if (!context.isAuthenticated) {
        throw redirect('/login');
      }
      
      if (!this.hasPermission(context, permission)) {
        throw redirect('/unauthorized');
      }
      
      return context;
    };
  }
  
  /**
   * Middleware pour protéger les routes admin
   */
  static requireAdmin() {
    return async ({ request }: { request: Request }) => {
      const context = await this.createSecurityContext(request);
      
      if (!context.isAuthenticated) {
        throw redirect('/login');
      }
      
      if (context.role !== UserRole.ADMIN && context.role !== UserRole.SUPER_ADMIN) {
        throw redirect('/unauthorized');
      }
      
      return context;
    };
  }
}

/**
 * Utilitaire pour créer des loaders sécurisés avec contexte de sécurité
 */
export function createSecureLoaderWithContext<T>(
  loaderFn: (args: { request: Request; context: SecurityContext }) => T | Promise<T>
) {
  return async ({ request }: { request: Request }) => {
    const context = await SecurityMiddleware.createSecurityContext(request);
    
    if (!context.isAuthenticated) {
      throw redirect('/login');
    }
    
    return loaderFn({ request, context });
  };
}

/**
 * Utilitaire pour créer des actions sécurisées avec contexte de sécurité
 */
export function createSecureActionWithContext<T>(
  actionFn: (args: { request: Request; context: SecurityContext }) => T | Promise<T>
) {
  return async ({ request }: { request: Request }) => {
    const context = await SecurityMiddleware.createSecurityContext(request);
    
    if (!context.isAuthenticated) {
      throw redirect('/login');
    }
    
    return actionFn({ request, context });
  };
}
