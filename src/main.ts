import { NestFactory } from '@nestjs/core';
import { Logger, Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // HTTP request logging — one line per request so runtime activity is visible in logs.
    const httpLogger = new Logger('HTTP');
    app.use((req: Request, res: Response, next: NextFunction) => {
        const start = Date.now();
        res.on('finish', () => {
            httpLogger.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
        });
        next();
    });

    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: 'Content-Type,Accept,Authorization,X-Requested-With',
    });

    app.setGlobalPrefix('api');

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('Sanad API')
        .setDescription('Sanad backend API documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const configService = app.get(AppConfigService);
    const port = configService.app.port;

    await app.listen(port);

    console.log(`\n🚀 Application is running on: http://localhost:${port}/api`);

    console.log(`📖 Swagger documentation: http://localhost:${port}/api/docs\n`);
}
void bootstrap();
