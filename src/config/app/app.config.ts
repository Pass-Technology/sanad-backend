import { registerAs } from '@nestjs/config';
import { appEnvSchema } from './app.zod';

export const appConfig = registerAs('app', () => {
    const result = appEnvSchema.parse(process.env);
    return {
        port: result.PORT,
        env: result.NODE_ENV,
    };
});
