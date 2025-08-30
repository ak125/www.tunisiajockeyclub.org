import { z } from 'zod';

// Schéma pour l'email
export const emailSchema = z
  .string()
  .email("Format d'email invalide")
  .min(5, "L'email doit contenir au moins 5 caractères")
  .max(254, "L'email ne peut pas dépasser 254 caractères")
  .toLowerCase()
  .transform((val) => val.trim());

// Schéma pour le mot de passe
export const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial',
  )
  .refine(
    (password) => {
      const commonPasswords = [
        'password',
        '123456',
        'password123',
        'admin',
        'qwerty',
        'tunisia',
        'jockey',
        'club',
        'user',
        'test',
      ];
      return !commonPasswords.includes(password.toLowerCase());
    },
    { message: 'Ce mot de passe est trop commun' },
  );

// Schéma pour le nom
export const nameSchema = z
  .string()
  .min(2, 'Le nom doit contenir au moins 2 caractères')
  .max(50, 'Le nom ne peut pas dépasser 50 caractères')
  .regex(
    /^[a-zA-ZÀ-ÿ\s'-]+$/,
    'Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets',
  )
  .transform((val) => val.trim().replace(/\s+/g, ' '));

// Schéma pour la connexion
export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères'),
  rememberMe: z.boolean().optional().default(false),
});

// Schéma pour l'inscription
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, 'La confirmation du mot de passe est requise'),
    firstName: nameSchema,
    lastName: nameSchema,
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Vous devez accepter les conditions d'utilisation",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

// Schéma pour la réinitialisation du mot de passe
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Schéma pour le changement de mot de passe
export const resetPasswordSchema = z
  .object({
    token: z.string().min(32, 'Token invalide').max(256, 'Token invalide'),
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, 'La confirmation du mot de passe est requise'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

// Schéma pour le changement de mot de passe (utilisateur connecté)
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Le mot de passe actuel est requis')
      .max(128, 'Mot de passe trop long'),
    newPassword: passwordSchema,
    confirmNewPassword: z
      .string()
      .min(1, 'La confirmation du nouveau mot de passe est requise'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Les nouveaux mots de passe ne correspondent pas',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Le nouveau mot de passe doit être différent de l'ancien",
    path: ['newPassword'],
  });

// Schéma pour la mise à jour du profil
export const updateProfileSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  email: emailSchema.optional(),
  phone: z
    .string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Numéro de téléphone invalide')
    .optional()
    .or(z.literal('')),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 13 && age <= 120;
    }, "L'âge doit être entre 13 et 120 ans")
    .optional(),
});

// Types TypeScript générés
export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;

// Schéma pour la validation des tokens
export const tokenSchema = z.object({
  token: z
    .string()
    .min(32, 'Token trop court')
    .max(256, 'Token trop long')
    .regex(/^[A-Za-z0-9\-_\.]+$/, 'Format de token invalide'),
  type: z.enum(['session', 'csrf', 'api', 'password_reset']),
  expiresAt: z.date().optional(),
});

export type TokenDto = z.infer<typeof tokenSchema>;
