import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from '../../config/config.module';
import { AppConfigService } from '../../config/config.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { VerificationGuard } from '../guards/verification.guard';

@Module({
    imports: [
        AppConfigModule,
        JwtModule.registerAsync({
            imports: [AppConfigModule],
            inject: [AppConfigService],
            useFactory: (config: AppConfigService) => ({
                secret: config.auth.jwtSecret,
                signOptions: { expiresIn: config.auth.accessExpiration as any },
            }),
        }),
    ],
    providers: [JwtAuthGuard, VerificationGuard],
    exports: [JwtModule, JwtAuthGuard, VerificationGuard],
})
export class SharedAuthModule { }
