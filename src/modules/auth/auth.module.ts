import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SharedUserModule } from '../../shared/user/shared-user.module';
import { SharedAuthModule } from '../../shared/auth/shared-auth.module';
import { OtpModule } from '../otp/otp.module';
import { MailModule } from '../mail/mail.module';
import { AuthController } from './auth.controller';
import { AppConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    AppConfigModule,
    SharedUserModule,
    SharedAuthModule,
    OtpModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, SharedAuthModule],
})
export class AuthModule { }
