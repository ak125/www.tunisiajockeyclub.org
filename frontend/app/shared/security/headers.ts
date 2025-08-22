import type { HeadersFunction } from "@remix-run/node";

// Security headers configuration
export const securityHeaders = {
  // Content Security Policy
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join("; "),
  
  // Security headers
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  
  // Cache control for security
  "Cache-Control": "private, no-cache, no-store, must-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
  
  // Remove server information
  "Server": "",
  "X-Powered-By": "",
};

// Development headers (more permissive)
export const devSecurityHeaders = {
  ...securityHeaders,
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' ws: wss:",
  ].join("; "),
  "Cache-Control": "no-cache",
};

// Headers function for Remix routes
export const headers: HeadersFunction = ({ loaderHeaders, parentHeaders }) => {
  const isDev = process.env.NODE_ENV === "development";
  const headersToUse = isDev ? devSecurityHeaders : securityHeaders;
  
  // Merge with loader and parent headers
  const headers = new Headers();
  
  // Add security headers
  Object.entries(headersToUse).forEach(([key, value]) => {
    headers.set(key, value);
  });
  
  // Preserve important loader headers
  if (loaderHeaders.get("Cache-Control")) {
    headers.set("Cache-Control", loaderHeaders.get("Cache-Control")!);
  }
  
  return headers;
};

// Rate limiting configuration
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Trop de requêtes depuis cette adresse IP, réessayez plus tard.",
    retryAfter: "15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
};

// Auth rate limiting (more restrictive)
export const authRateLimitConfig = {
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  message: {
    error: "Trop de tentatives de connexion, réessayez plus tard.",
    retryAfter: "15 minutes"
  },
  skipSuccessfulRequests: true,
};

// Input validation patterns
export const validationPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?[1-9]\d{1,14}$/,
  name: /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  raceId: /^[a-zA-Z0-9-]{1,50}$/,
  dateString: /^\d{4}-\d{2}-\d{2}$/,
  timeString: /^\d{2}:\d{2}$/,
};

// Sanitization helpers
export const sanitize = {
  text: (input: string): string => {
    return input.trim().replace(/[<>\"'&]/g, (char) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entities[char] || char;
    });
  },
  
  email: (input: string): string => {
    return input.trim().toLowerCase();
  },
  
  phone: (input: string): string => {
    return input.replace(/[^\d+]/g, '');
  },
  
  name: (input: string): string => {
    return input.trim().replace(/\s+/g, ' ');
  }
};

// CSRF protection helper
export function generateCSRFToken(): string {
  return crypto.randomUUID();
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken && token.length === 36;
}
