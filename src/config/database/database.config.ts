import { registerAs } from '@nestjs/config';
import { databaseEnvSchema } from './database.zod';

export const databaseConfig = registerAs('database', () => {
    const result = databaseEnvSchema.parse(process.env);
    return {
        url: result.DATABASE_URL,
        host: result.DATABASE_HOST,
        port: result.DATABASE_PORT,
        username: result.DATABASE_USER,
        password: result.DATABASE_PASSWORD,
        database: result.DATABASE_NAME,
    };
});
