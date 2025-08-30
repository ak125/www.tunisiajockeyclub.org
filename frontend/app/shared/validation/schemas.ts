import { z } from 'zod';

// User validation schemas
export const loginSchema = z.object({
  email: z.string()
    .email('Format d\'email invalide')
    .max(255, 'Email trop long')
    .transform(email => email.toLowerCase().trim()),
  password: z.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .max(128, 'Mot de passe trop long'),
  rememberMe: z.boolean().optional(),
  csrfToken: z.string().uuid('Token CSRF invalide').optional(),
});

export const registerSchema = z.object({
  email: z.string()
    .email('Format d\'email invalide')
    .max(255, 'Email trop long')
    .transform(email => email.toLowerCase().trim()),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(128, 'Mot de passe trop long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  confirmPassword: z.string(),
  firstName: z.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Prénom trop long')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le prénom contient des caractères invalides')
    .transform(name => name.trim()),
  lastName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Nom trop long')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom contient des caractères invalides')
    .transform(name => name.trim()),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Format de téléphone invalide')
    .optional(),
  city: z.string()
    .max(100, 'Nom de ville trop long')
    .optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export const updateProfileSchema = z.object({
  firstName: z.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Prénom trop long')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le prénom contient des caractères invalides')
    .transform(name => name.trim()),
  lastName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Nom trop long')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom contient des caractères invalides')
    .transform(name => name.trim()),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Format de téléphone invalide')
    .optional(),
  city: z.string()
    .max(100, 'Nom de ville trop long')
    .optional(),
});

// Race validation schemas
export const createRaceSchema = z.object({
  name: z.string()
    .min(3, 'Le nom de la course doit contenir au moins 3 caractères')
    .max(100, 'Nom de course trop long')
    .regex(/^[a-zA-ZÀ-ÿ0-9\s'-]+$/, 'Le nom contient des caractères invalides')
    .transform(name => name.trim()),
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)')
    .refine(date => {
      const raceDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return raceDate >= today;
    }, 'La date de la course doit être future'),
  time: z.string()
    .regex(/^\d{2}:\d{2}$/, 'Format d\'heure invalide (HH:MM)'),
  distance: z.number()
    .int('La distance doit être un nombre entier')
    .min(800, 'Distance minimale : 800m')
    .max(5000, 'Distance maximale : 5000m'),
  maxParticipants: z.number()
    .int('Le nombre de participants doit être un entier')
    .min(4, 'Minimum 4 participants')
    .max(20, 'Maximum 20 participants'),
  prize: z.number()
    .positive('Le prix doit être positif')
    .max(1000000, 'Prix trop élevé'),
  category: z.enum(['groupe1', 'groupe2', 'groupe3', 'handicap', 'maiden'], {
    errorMap: () => ({ message: 'Catégorie invalide' })
  }),
  track: z.enum(['main', 'training', 'grass'], {
    errorMap: () => ({ message: 'Type de piste invalide' })
  }),
  description: z.string()
    .max(500, 'Description trop longue')
    .optional(),
});

export const updateRaceSchema = createRaceSchema.partial().extend({
  id: z.string().uuid('ID de course invalide'),
});

// Search and filter schemas
export const raceFiltersSchema = z.object({
  search: z.string().max(100).optional(),
  status: z.enum(['all', 'upcoming', 'live', 'finished']).optional(),
  category: z.enum(['all', 'groupe1', 'groupe2', 'groupe3', 'handicap', 'maiden']).optional(),
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
}).refine(data => {
  if (data.dateFrom && data.dateTo) {
    return new Date(data.dateFrom) <= new Date(data.dateTo);
  }
  return true;
}, {
  message: "La date de début doit être antérieure à la date de fin",
  path: ["dateFrom"],
});

// API response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.object({
    message: z.string(),
    code: z.string().optional(),
    details: z.unknown().optional(),
  }).optional(),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }).optional(),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, 'Fichier trop volumineux (max 5MB)')
    .refine(
      file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Type de fichier non supporté (JPEG, PNG, WebP uniquement)'
    ),
  alt: z.string().min(1).max(200, 'Description trop longue'),
});

// Validation helper functions
export function validateFormData<T>(
  schema: z.ZodSchema<T>, 
  formData: FormData
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } {
  const data = Object.fromEntries(formData.entries());
  
  // Convert string numbers to numbers
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'string' && !isNaN(Number(data[key])) && data[key] !== '') {
      data[key] = Number(data[key]);
    }
  });
  
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors: Record<string, string[]> = {};
  result.error.issues.forEach(issue => {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  });
  
  return { success: false, errors };
}

export function validateJSON<T>(
  schema: z.ZodSchema<T>,
  json: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(json);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors = result.error.issues.map(issue => 
    `${issue.path.join('.')}: ${issue.message}`
  );
  
  return { success: false, errors };
}

// Type inference helpers
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateRaceInput = z.infer<typeof createRaceSchema>;
export type UpdateRaceInput = z.infer<typeof updateRaceSchema>;
export type RaceFiltersInput = z.infer<typeof raceFiltersSchema>;
export type ApiResponse = z.infer<typeof apiResponseSchema>;

// Schémas d'administration
export const adminSchema = {
  updateSecuritySettings: z.object({
    action: z.enum(['force_logout_all', 'security_scan', 'clear_suspicious']),
    timestamp: z.string(),
    _csrf: z.string().min(1, 'Token CSRF requis'),
  }),
  
  userManagement: z.object({
    userId: z.string().uuid('ID utilisateur invalide'),
    action: z.enum(['suspend', 'activate', 'delete', 'reset_password']),
    reason: z.string().min(10, 'Raison requise (minimum 10 caractères)').optional(),
  }),
  
  systemSettings: z.object({
    rateLimitEnabled: z.boolean(),
    maxLoginAttempts: z.number().min(1).max(10),
    sessionTimeout: z.number().min(300).max(86400), // 5 min to 24h
    csrfProtection: z.boolean(),
    auditLogging: z.boolean(),
  }),
};
