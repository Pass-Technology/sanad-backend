import { z } from 'zod';

export const mailEnvSchema = z.object({
    MAIL_HOST: z.string().default('smtp.ethereal.email'),
    MAIL_PORT: z.coerce.number().default(587),
    MAIL_USER: z.string().optional(),
    MAIL_PASSWORD: z.string().optional(),
    MAIL_FROM: z.string().default('"No Reply" <noreply@example.com>'),
});
