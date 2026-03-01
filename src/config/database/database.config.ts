import { registerAs } from '@nestjs/config';
import { databaseEnvSchema } from './database.zod';

export const databaseConfig = registerAs('database', () => {
    const result = databaseEnvSchema.parse(process.env);
    return {
        url: result.DATABASE_URL,
    };
});
