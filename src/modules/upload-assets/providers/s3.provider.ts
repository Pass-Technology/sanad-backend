import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { IStorageProvider } from '../interfaces/storage-provider.interface';
import { AppConfigService } from '../../../config/config.service';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import * as crypto from 'crypto';

@Injectable()
export class S3StorageProvider implements IStorageProvider {
    private readonly s3Client: S3Client;
    private readonly bucketName: string;
    private readonly logger = new Logger(S3StorageProvider.name);

    constructor(private readonly configService: AppConfigService) {
        const awsConfig = this.configService.aws;
        this.bucketName = awsConfig.s3Bucket || '';

        this.s3Client = new S3Client({
            region: awsConfig.s3Region || 'us-east-1',
            credentials: {
                accessKeyId: awsConfig.accessKeyId || '',
                secretAccessKey: awsConfig.secretAccessKey || '',
            },
        });
    }

    async upload(file: Express.Multer.File, folder: string): Promise<{ path: string; url: string }> {
        try {
            const uniqueSuffix = crypto.randomUUID();
            const extension = file.originalname.split('.').pop();
            const fileName = `${uniqueSuffix}.${extension}`;
            const key = `${folder}/${fileName}`;

            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            });

            await this.s3Client.send(command);

            const url = `https://${this.bucketName}.s3.${this.configService.aws.s3Region}.amazonaws.com/${key}`;

            return { path: key, url };
        } catch (error: any) {
            this.logger.error(`Error uploading to S3: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to upload asset to S3');
        }
    }

    async getURL(path: string): Promise<string> {
        return `https://${this.bucketName}.s3.${this.configService.aws.s3Region}.amazonaws.com/${path}`;
    }

    async delete(path: string): Promise<void> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: path,
            });

            await this.s3Client.send(command);
        } catch (error: any) {
            this.logger.error(`Error deleting from S3: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to delete asset from S3');
        }
    }
}
