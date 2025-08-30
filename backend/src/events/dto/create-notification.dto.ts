import { z } from 'zod';

export const NotificationTypeEnum = z.enum([
  'RACE_UPDATE',
  'RACE_START',
  'RACE_FINISH',
  'RESULTS_PUBLISHED',
  'SYSTEM_ALERT',
]);

export const CreateNotificationSchema = z.object({
  type: NotificationTypeEnum,
  message: z.string().min(1, 'Le message est requis'),
  data: z.record(z.string(), z.any()),
});

export type CreateNotificationDto = z.infer<typeof CreateNotificationSchema>;
