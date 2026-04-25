import { registerAs } from '@nestjs/config';

export const awsConfig = registerAs('aws', () => ({
    s3Region: process.env.AWS_S3_REGION,
    s3Bucket: process.env.AWS_S3_BUCKET,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
}));
