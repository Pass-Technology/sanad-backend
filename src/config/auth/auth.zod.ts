import { z } from 'zod';

export const authEnvSchema = z.object({
    JWT_SECRET: z.string().min(1),
    DEFAULT_OTP: z.coerce.number().optional().default(5555),
});
