import { registerAs } from '@nestjs/config';
import { authEnvSchema } from './auth.zod';

export const authConfig = registerAs('auth', () => {
    const result = authEnvSchema.parse(process.env);
    return {
        jwtSecret: result.JWT_SECRET,
        defaultOtp: result.DEFAULT_OTP,
    };
});
