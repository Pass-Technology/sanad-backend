import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AppConfigModule } from '../../config/config.module';
import { AppConfigService } from '../../config/config.service';
import { UserModule } from '../user/user.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { VerificationGuard } from './guards/verification.guard';

@Module({
  imports: [
    PassportModule,
    AppConfigModule,
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        secret: config.auth.jwtSecret,
        signOptions: { expiresIn: config.auth.accessExpiration as any },
      }),
    }),
  ],
  providers: [AuthService, JwtAuthGuard, VerificationGuard],
  exports: [AuthService, JwtAuthGuard, VerificationGuard, JwtModule],
})
export class AuthModule { }
