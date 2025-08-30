import { z } from 'zod';

// Schéma pour la connexion
export const LoginSchema = z.object({
  email: z
    .string()
    .email('Email invalide')
    .min(1, 'Email requis')
    .transform((email) => email.toLowerCase().trim()),
  password: z
    .string()
    .min(8, 'Mot de passe doit contenir au moins 8 caractères')
    .max(128, 'Mot de passe trop long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Mot de passe doit contenir une minuscule, une majuscule et un chiffre',
    ),
});

// Schéma pour l'inscription
export const RegisterSchema = z
  .object({
    email: z
      .string()
      .email('Email invalide')
      .min(1, 'Email requis')
      .transform((email) => email.toLowerCase().trim()),
    password: z
      .string()
      .min(8, 'Mot de passe doit contenir au moins 8 caractères')
      .max(128, 'Mot de passe trop long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Mot de passe doit contenir une minuscule, une majuscule et un chiffre',
      ),
    confirmPassword: z.string(),
    firstName: z
      .string()
      .min(2, 'Prénom doit contenir au moins 2 caractères')
      .max(50, 'Prénom trop long')
      .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Prénom contient des caractères invalides'),
    lastName: z
      .string()
      .min(2, 'Nom doit contenir au moins 2 caractères')
      .max(50, 'Nom trop long')
      .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Nom contient des caractères invalides'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

// Schéma pour le changement de mot de passe
export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
  newPassword: z
    .string()
    .min(8, 'Nouveau mot de passe doit contenir au moins 8 caractères')
    .max(128, 'Nouveau mot de passe trop long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Nouveau mot de passe doit contenir une minuscule, une majuscule et un chiffre'),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Les nouveaux mots de passe ne correspondent pas",
  path: ["confirmNewPassword"],
});

// Schéma pour la réinitialisation de mot de passe
export const ResetPasswordSchema = z.object({
  email: z
    .string()
    .email('Email invalide')
    .min(1, 'Email requis')
    .transform(email => email.toLowerCase().trim()),
});

// Schéma pour confirmer la réinitialisation
export const ConfirmResetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requis'),
  newPassword: z
    .string()
    .min(8, 'Mot de passe doit contenir au moins 8 caractères')
    .max(128, 'Mot de passe trop long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Mot de passe doit contenir une minuscule, une majuscule et un chiffre'),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmNewPassword"],
});

// Types TypeScript dérivés des schémas
export type LoginDto = z.infer<typeof LoginSchema>;
export type RegisterDto = z.infer<typeof RegisterSchema>;
export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;
export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;
export type ConfirmResetPasswordDto = z.infer<typeof ConfirmResetPasswordSchema>;
