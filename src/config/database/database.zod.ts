import { z } from 'zod';

export const databaseEnvSchema = z.object({
    DATABASE_URL: z.string().url(),
    // DATABASE_HOST: z.string().default('localhost'),
    // DATABASE_PORT: z.coerce.number().int().positive().default(5432),
    // DATABASE_USER: z.string().default('postgres'),
    // DATABASE_PASSWORD: z.string(),
    // DATABASE_NAME: z.string().default('DB'),
});
