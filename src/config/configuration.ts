import { ConfigType } from '@nestjs/config';
import { appConfig } from './app/app.config';
import { databaseConfig } from './database/database.config';
import { authConfig } from './auth/auth.config';

export const configurations = [appConfig, databaseConfig, authConfig];

export type RootConfig = {

    app: ConfigType<typeof appConfig>;
    database: ConfigType<typeof databaseConfig>;
    auth: ConfigType<typeof authConfig>;
};
