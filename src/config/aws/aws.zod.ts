import { z } from 'zod';

export const awsEnvSchema = z.object({
    AWS_S3_REGION: z.string().min(1),
    AWS_S3_BUCKET: z.string().min(1),
    AWS_ACCESS_KEY_ID: z.string().min(1).trim(),
    AWS_SECRET_ACCESS_KEY: z.string().min(1).trim(),
    PRESIGN_EXPIRES: z.coerce.number().optional().default(300),
});
