import { Injectable, Logger } from '@nestjs/common';
import { EncryptionService } from './encryption.service';
import { AuditService } from './audit.service';

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);

  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly auditService: AuditService,
  ) {}

  // Validation des entrées utilisateur
  sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    return input
      .trim()
      .replace(/[<>\"'&]/g, (char) => {
        const entities: Record<string, string> = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;',
        };
        return entities[char] || char;
      });
  }

  // Validation d'email sécurisée
  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const sanitizedEmail = this.sanitizeInput(email);
    
    return emailRegex.test(sanitizedEmail) && sanitizedEmail.length <= 254;
  }

  // Validation de mot de passe fort
  validateStrongPassword(password: string): { 
    isValid: boolean; 
    errors: string[] 
  } {
    const errors: string[] = [];
    
    if (!password || password.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }
    
    if (!/[@$!%*?&]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&)');
    }

    // Vérifier les mots de passe communs
    const commonPasswords = [
      'password', '123456', 'password123', 'admin', 'qwerty',
      'tunisia', 'jockey', 'club', 'user', 'test'
    ];
    
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Ce mot de passe est trop commun');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Détection d'injection SQL
  detectSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(--|\*\/|\*\*|@@|@)/,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
      /('|('')|;|--|\/\*|\*\/)/,
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  // Détection de XSS
  detectXSS(input: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<img[^>]+src[\\s]*=[\\s]*["\']javascript:/gi,
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }

  // Validation d'une requête
  async validateRequest(data: Record<string, any>, ipAddress?: string, userAgent?: string): Promise<{
    isValid: boolean;
    threats: string[];
  }> {
    const threats: string[] = [];

    // Vérifier chaque champ
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        if (this.detectSQLInjection(value)) {
          threats.push(`SQL injection detected in field: ${key}`);
          
          await this.auditService.logSecurityEvent('sql_injection_attempt', {
            ipAddress,
            userAgent,
            threat: `SQL injection in field: ${key}`,
            blocked: true,
          });
        }

        if (this.detectXSS(value)) {
          threats.push(`XSS attempt detected in field: ${key}`);
          
          await this.auditService.logSecurityEvent('xss_attempt', {
            ipAddress,
            userAgent,
            threat: `XSS in field: ${key}`,
            blocked: true,
          });
        }
      }
    }

    return {
      isValid: threats.length === 0,
      threats,
    };
  }

  // Génération de token sécurisé
  generateSecureToken(purpose: 'session' | 'csrf' | 'api' | 'password_reset'): string {
    const lengths = {
      session: 64,
      csrf: 32,
      api: 48,
      password_reset: 32,
    };

    return this.encryptionService.generateSecureToken(lengths[purpose]);
  }

  // Validation de token CSRF
  validateCSRFToken(token: string, sessionToken: string): boolean {
    if (!token || !sessionToken) {
      return false;
    }

    // Simple validation - en production, utiliser un système plus sophistiqué
    return token === sessionToken && token.length >= 32;
  }

  // Hachage sécurisé pour les mots de passe
  async hashPassword(password: string): Promise<string> {
    const validation = this.validateStrongPassword(password);
    
    if (!validation.isValid) {
      throw new Error(`Mot de passe invalide: ${validation.errors.join(', ')}`);
    }

    return this.encryptionService.hashPassword(password);
  }

  // Vérification de mot de passe
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return this.encryptionService.verifyPassword(password, hash);
  }

  // Chiffrement de données sensibles
  async encryptSensitiveData(data: string): Promise<string> {
    return this.encryptionService.encrypt(data);
  }

  // Déchiffrement de données sensibles
  async decryptSensitiveData(encryptedData: string): Promise<string> {
    return this.encryptionService.decrypt(encryptedData);
  }

  // Nettoyage des données sensibles des logs
  sanitizeForLog(obj: any): any {
    const sensitiveKeys = [
      'password', 'token', 'secret', 'key', 'auth',
      'creditCard', 'ssn', 'passport', 'phoneNumber'
    ];

    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    const sanitized = { ...obj };

    for (const key in sanitized) {
      if (sensitiveKeys.some(sensitive => 
        key.toLowerCase().includes(sensitive.toLowerCase())
      )) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof sanitized[key] === 'object') {
        sanitized[key] = this.sanitizeForLog(sanitized[key]);
      }
    }

    return sanitized;
  }

  // Configuration des headers de sécurité
  getSecurityHeaders(): Record<string, string> {
    const isProduction = process.env.NODE_ENV === 'production';
    
    return {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), camera=(), microphone=()',
      ...(isProduction && {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      }),
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https:",
        "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; ')
    };
  }
}
