import { registerAs } from '@nestjs/config';
import { authEnvSchema } from './auth.zod';

export const authConfig = registerAs('auth', () => {
    const result = authEnvSchema.parse(process.env);
    return {
        jwtSecret: result.JWT_SECRET,
        jwtRefreshSecret: result.JWT_REFRESH_SECRET,
        accessExpiration: result.JWT_ACCESS_EXPIRATION,
        refreshExpiration: result.JWT_REFRESH_EXPIRATION,
        defaultOtp: result.DEFAULT_OTP,
    };
});

