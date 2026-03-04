import { z } from 'zod';

export const authEnvSchema = z.object({
    JWT_SECRET: z.string().min(1),
    JWT_REFRESH_SECRET: z.string().min(1),
    JWT_ACCESS_EXPIRATION: z.string().default('15m'),
    JWT_REFRESH_EXPIRATION: z.string().default('7d'),
    DEFAULT_OTP: z.coerce.number().optional().default(5555),
});

