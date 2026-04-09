import { registerAs } from '@nestjs/config';
import { mailEnvSchema } from './mail.zod';

export const mailConfig = registerAs('mail', () => {
    const result = mailEnvSchema.parse(process.env);
    return {
        host: result.MAIL_HOST,
        port: result.MAIL_PORT,
        user: result.MAIL_USER,
        password: result.MAIL_PASSWORD,
        from: result.MAIL_FROM,
    };
});
