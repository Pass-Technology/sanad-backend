import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RootConfig } from './configuration';

@Injectable()
export class AppConfigService {
    constructor(private configService: ConfigService<RootConfig, true>) { }

    /**
     * Main App configuration
     */
    get app() {
        return this.configService.get('app', { infer: true })!;
    }

    /**
     * Database configuration
     */
    get database() {
        return this.configService.get('database', { infer: true })!;
    }

    /**
     * Auth configuration
     */
    get auth() {
        return this.configService.get('auth', { infer: true })!;
    }
}
