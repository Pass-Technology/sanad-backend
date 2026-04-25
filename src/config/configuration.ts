import { ConfigType } from '@nestjs/config';
import { appConfig } from './app/app.config';
import { databaseConfig } from './database/database.config';
import { authConfig } from './auth/auth.config';
import { mailConfig } from './mail/mail.config';
import { awsConfig } from './aws/aws.config';

export const configurations = [appConfig, databaseConfig, authConfig, mailConfig, awsConfig];

export type RootConfig = {

    app: ConfigType<typeof appConfig>;
    database: ConfigType<typeof databaseConfig>;
    auth: ConfigType<typeof authConfig>;
    mail: ConfigType<typeof mailConfig>;
    aws: ConfigType<typeof awsConfig>;
};
