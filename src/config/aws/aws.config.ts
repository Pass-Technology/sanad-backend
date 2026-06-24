import { registerAs } from '@nestjs/config';
import { awsEnvSchema } from './aws.zod';

export const awsConfig = registerAs('aws', () => {
    const result = awsEnvSchema.parse(process.env);
    return {
        s3Region: result.AWS_S3_REGION,
        s3Bucket: result.AWS_S3_BUCKET,
        accessKeyId: result.AWS_ACCESS_KEY_ID,
        secretAccessKey: result.AWS_SECRET_ACCESS_KEY,
        presignExpires: result.PRESIGN_EXPIRES,
    };
});
