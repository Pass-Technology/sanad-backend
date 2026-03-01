import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../config/config.module';
import { AppConfigService } from '../config/config.service';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [AppConfigModule],
            inject: [AppConfigService],
            useFactory: (config: AppConfigService) => ({
                type: 'postgres',
                url: config.database.url,
                autoLoadEntities: true,
                synchronize: false,
                ssl: true,
                extra: {
                    max: 1,
                    connectionTimeoutMillis: 5000,
                    ssl: {
                        rejectUnauthorized: false,
                    },
                },
                migrations: [__dirname + '/migrations/*{.ts,.js}'],
                migrationsRun: false,
            }),
        }),
    ],
})
export class DatabaseModule { }
