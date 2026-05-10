import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AppConfigModule } from '../../config/config.module';
import { AppConfigService } from '../../config/config.service';
import { UserModule } from '../user/user.module';
import { OtpModule } from '../otp/otp.module';
import { MailModule } from '../mail/mail.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { VerificationGuard } from './guards/verification.guard';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    AppConfigModule,
    forwardRef(() => UserModule),
    OtpModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        secret: config.auth.jwtSecret,
        signOptions: { expiresIn: config.auth.accessExpiration as any },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, VerificationGuard],
  exports: [AuthService, JwtAuthGuard, VerificationGuard, JwtModule],
})
export class AuthModule { }
