import { redirect } from '@remix-run/node';
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';
import { z } from 'zod';

// Types pour le middleware
export interface SecurityContext {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface SecurityOptions {
  requireAuth?: boolean;
  requireRole?: string[];
  rateLimit?: {
    windowMs: number;
    maxRequests: number;
  };
  validateCSRF?: boolean;
  sanitizeInput?: boolean;
}

// Extracteur d'IP sécurisé
function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  return realIP || 'unknown';
}

// Middleware de sécurité principal
export async function withSecurity<T extends LoaderFunctionArgs | ActionFunctionArgs>(
  args: T,
  options: SecurityOptions = {},
  handler: (args: T, context: SecurityContext) => Promise<Response | any>
): Promise<Response | any> {
  const { request } = args;
  const url = new URL(request.url);
  
  // Construire le contexte de sécurité
  const context: SecurityContext = {
    ipAddress: getClientIP(request),
    userAgent: request.headers.get('user-agent') || undefined,
  };

  try {
    // 1. Rate limiting
    if (options.rateLimit) {
      const rateLimitResult = await checkRateLimit(
        context.ipAddress!,
        options.rateLimit.windowMs,
        options.rateLimit.maxRequests
      );
      
      if (!rateLimitResult.allowed) {
        throw new Response('Too Many Requests', { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
            'X-RateLimit-Limit': options.rateLimit.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime?.toString() || '',
          }
        });
      }
    }

    // 2. Session et authentification
    if (options.requireAuth) {
      const session = await getSession(request);
      const user = session.get('user') as SecurityContext['user'];
      const sessionId = session.get('sessionId') as string;
      
      if (!user) {
        throw redirect('/login?redirect=' + encodeURIComponent(url.pathname));
      }
      
      context.user = user;
      context.sessionId = sessionId;
      
      // Vérification du rôle
      if (options.requireRole && options.requireRole.length > 0) {
        if (!options.requireRole.includes(user.role)) {
          throw new Response('Forbidden', { status: 403 });
        }
      }
    }

    // 3. Protection CSRF pour les mutations
    if (options.validateCSRF && request.method !== 'GET') {
      const formData = await request.clone().formData();
      const csrfToken = formData.get('_csrf') as string;
      
      if (!csrfToken || !await validateCSRFToken(csrfToken, context.sessionId)) {
        throw new Response('CSRF validation failed', { status: 403 });
      }
    }

    // 4. Sanitisation des entrées
    if (options.sanitizeInput && request.method !== 'GET') {
      await sanitizeRequestInput(request);
    }

    // 5. Logging sécurisé
    await logSecurityEvent(request, context, 'access');

    // Exécuter le handler avec le contexte sécurisé
    return await handler(args, context);
    
  } catch (error) {
    // Log des erreurs de sécurité
    await logSecurityEvent(request, context, 'error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    throw error;
  }
}

// Implémentation du rate limiting (simple, en production utiliser Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

async function checkRateLimit(
  identifier: string,
  windowMs: number,
  maxRequests: number
): Promise<{ allowed: boolean; retryAfter?: number; resetTime?: number }> {
  const now = Date.now();
  const key = `rate_limit:${identifier}`;
  const window = rateLimitStore.get(key);
  
  if (!window || now > window.resetTime) {
    // Nouveau window ou expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, resetTime: now + windowMs };
  }
  
  if (window.count >= maxRequests) {
    return { 
      allowed: false, 
      retryAfter: Math.ceil((window.resetTime - now) / 1000),
      resetTime: window.resetTime 
    };
  }
  
  window.count++;
  return { allowed: true, resetTime: window.resetTime };
}

// Gestion des sessions (mock, en production utiliser un vrai session store)
async function getSession(request: Request) {
  // En production, utiliser un vrai gestionnaire de session
  const sessionCookie = request.headers.get('Cookie');
  
  return {
    get: (key: string) => {
      // Mock implementation
      if (key === 'user') {
        return sessionCookie?.includes('authenticated=true') 
          ? { id: '1', email: 'user@example.com', role: 'user' }
          : null;
      }
      if (key === 'sessionId') {
        return 'mock-session-id';
      }
      return null;
    }
  };
}

// Validation CSRF
async function validateCSRFToken(token: string, sessionId?: string): Promise<boolean> {
  // Implémentation simple, en production utiliser un vrai système CSRF
  const expectedToken = generateCSRFToken(sessionId || 'default');
  return token === expectedToken;
}

// Génération de token CSRF
export function generateCSRFToken(sessionId: string): string {
  // En production, utiliser une vraie génération cryptographique
  const timestamp = Date.now();
  return `csrf-${sessionId}-${timestamp}`;
}

// Sanitisation des entrées
async function sanitizeRequestInput(request: Request) {
  const contentType = request.headers.get('content-type');
  
  if (contentType?.includes('application/json')) {
    const body = await request.clone().json();
    sanitizeObject(body);
  } else if (contentType?.includes('application/x-www-form-urlencoded')) {
    const formData = await request.clone().formData();
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        sanitizeString(value);
      }
    }
  }
}

// Sanitisation d'objet récursive
function sanitizeObject(obj: any): void {
  if (typeof obj !== 'object' || obj === null) return;
  
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = sanitizeString(obj[key]);
    } else if (typeof obj[key] === 'object') {
      sanitizeObject(obj[key]);
    }
  }
}

// Sanitisation de chaîne
function sanitizeString(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

// Logging sécurisé
async function logSecurityEvent(
  request: Request,
  context: SecurityContext,
  eventType: 'access' | 'error' | 'suspicious',
  details?: any
) {
  const event = {
    timestamp: new Date().toISOString(),
    type: eventType,
    method: request.method,
    url: request.url,
    userAgent: context.userAgent,
    ipAddress: context.ipAddress,
    userId: context.user?.id,
    sessionId: context.sessionId,
    details,
  };
  
  // En production, envoyer vers un service de logging sécurisé
  if (process.env.NODE_ENV === 'development') {
    console.log('Security Event:', event);
  }
  
  // Détection de comportements suspects
  if (eventType === 'error' || isSuspiciousActivity(request, context)) {
    await alertSecurityTeam(event);
  }
}

// Détection d'activité suspecte
function isSuspiciousActivity(request: Request, context: SecurityContext): boolean {
  const url = new URL(request.url);
  const suspiciousPatterns = [
    /\.\./,  // Path traversal
    /<script/i,  // XSS attempts
    /union\s+select/i,  // SQL injection
    /\bexec\b/i,  // Command injection
  ];
  
  const testString = url.pathname + url.search;
  return suspiciousPatterns.some(pattern => pattern.test(testString));
}

// Alerte équipe sécurité
async function alertSecurityTeam(event: any) {
  // En production, envoyer vers un système d'alerte
  console.warn('SECURITY ALERT:', event);
}

// Helpers pour les routes
export function createSecureLoader(
  handler: (args: LoaderFunctionArgs, context: SecurityContext) => Promise<Response | any>,
  options: SecurityOptions = {}
) {
  return async (args: LoaderFunctionArgs) => {
    return withSecurity(args, options, handler);
  };
}

export function createSecureAction(
  handler: (args: ActionFunctionArgs, context: SecurityContext) => Promise<Response | any>,
  options: SecurityOptions = {}
) {
  return async (args: ActionFunctionArgs) => {
    return withSecurity(args, {
      ...options,
      validateCSRF: options.validateCSRF ?? true,
      sanitizeInput: options.sanitizeInput ?? true,
    }, handler);
  };
}

// Validation de schéma avec Zod
export function withValidation<T extends z.ZodSchema>(
  schema: T,
  handler: (
    args: LoaderFunctionArgs | ActionFunctionArgs,
    context: SecurityContext,
    data: z.infer<T>
  ) => Promise<Response | any>,
  options: SecurityOptions = {}
) {
  return async (args: LoaderFunctionArgs | ActionFunctionArgs, context: SecurityContext) => {
    const { request } = args;
    
    let rawData: any;
    
    if (request.method === 'GET') {
      const url = new URL(request.url);
      rawData = Object.fromEntries(url.searchParams);
    } else {
      const contentType = request.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        rawData = await request.json();
      } else {
        const formData = await request.formData();
        rawData = Object.fromEntries(formData);
      }
    }
    
    try {
      const validatedData = schema.parse(rawData);
      return await handler(args, context, validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Response(JSON.stringify({
          error: 'Validation failed',
          issues: error.issues,
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      throw error;
    }
  };
}
