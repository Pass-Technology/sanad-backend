import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../config/config.module';
import { AppConfigService } from '../config/config.service';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [AppConfigModule],
            inject: [AppConfigService],
            useFactory: (config: AppConfigService) => ({
                type: 'postgres',
                url: config.database.url,
                // host: config.database.host,
                // port: config.database.port,
                // username: config.database.username,
                // password: config.database.password,
                // database: config.database.database,
                autoLoadEntities: true,
                synchronize: false,
                ssl: true,
                namingStrategy: new SnakeNamingStrategy(),
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
