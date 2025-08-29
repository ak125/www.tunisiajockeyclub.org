import { z } from 'zod';

// Schéma pour une course
export const CourseSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  date: z.string().datetime('Date invalide'),
  location: z.string().min(2, 'Le lieu doit contenir au moins 2 caractères'),
  distance: z.number().positive('La distance doit être positive'),
  prize: z.number().positive('Le prix doit être positif'),
  category: z.enum(['GROUP_1', 'GROUP_2', 'GROUP_3', 'LISTED', 'HANDICAP', 'MAIDEN']),
  surface: z.enum(['TURF', 'DIRT', 'SYNTHETIC']),
  weather: z.enum(['SUNNY', 'CLOUDY', 'RAINY', 'WINDY']).optional(),
  trackCondition: z.enum(['FAST', 'GOOD', 'SOFT', 'HEAVY']).optional(),
  maxParticipants: z.number().min(4).max(20).default(16),
  registrationDeadline: z.string().datetime(),
  status: z.enum(['SCHEDULED', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'RUNNING', 'FINISHED', 'CANCELLED']).default('SCHEDULED'),
});

// Schéma pour un participant à une course
export const ParticipantSchema = z.object({
  id: z.string().uuid().optional(),
  courseId: z.string().uuid('ID course invalide'),
  horseId: z.string().uuid('ID cheval invalide'),
  jockeyId: z.string().uuid('ID jockey invalide'),
  ownerId: z.string().uuid('ID propriétaire invalide'),
  trainerId: z.string().uuid('ID entraîneur invalide'),
  startingGate: z.number().min(1).max(20),
  weight: z.number().positive('Le poids doit être positif'),
  odds: z.number().positive().optional(),
  registrationDate: z.string().datetime(),
  status: z.enum(['REGISTERED', 'CONFIRMED', 'WITHDRAWN', 'DISQUALIFIED']).default('REGISTERED'),
});

// Schéma pour les résultats d'une course
export const ResultatSchema = z.object({
  id: z.string().uuid().optional(),
  courseId: z.string().uuid('ID course invalide'),
  participantId: z.string().uuid('ID participant invalide'),
  position: z.number().min(1),
  finishTime: z.string().optional(),
  margin: z.string().optional(), // Ex: "1 longueur", "nez", "encolure"
  comments: z.string().optional(),
  disqualified: z.boolean().default(false),
  disqualificationReason: z.string().optional(),
});

// Schémas pour les requêtes API
export const CreateCourseSchema = CourseSchema.omit({ id: true });
export const UpdateCourseSchema = CourseSchema.partial().omit({ id: true });

export const CreateParticipantSchema = ParticipantSchema.omit({ id: true });
export const UpdateParticipantSchema = ParticipantSchema.partial().omit({ id: true, courseId: true });

export const CreateResultatSchema = ResultatSchema.omit({ id: true });
export const UpdateResultatSchema = ResultatSchema.partial().omit({ id: true, courseId: true, participantId: true });

// Types TypeScript
export type Course = z.infer<typeof CourseSchema>;
export type CreateCourse = z.infer<typeof CreateCourseSchema>;
export type UpdateCourse = z.infer<typeof UpdateCourseSchema>;

export type Participant = z.infer<typeof ParticipantSchema>;
export type CreateParticipant = z.infer<typeof CreateParticipantSchema>;
export type UpdateParticipant = z.infer<typeof UpdateParticipantSchema>;

export type Resultat = z.infer<typeof ResultatSchema>;
export type CreateResultat = z.infer<typeof CreateResultatSchema>;
export type UpdateResultat = z.infer<typeof UpdateResultatSchema>;
