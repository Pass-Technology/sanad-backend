import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SharedUserModule } from '../../shared/user/shared-user.module';
import { SharedAuthModule } from '../../shared/auth/shared-auth.module';
import { OtpModule } from '../otp/otp.module';
import { MailModule } from '../mail/mail.module';
import { AuthController } from './auth.controller';
import { AppConfigModule } from 'src/config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkerInvitationEntity } from '../provider-profile/entities/worker-invitation.entity';

@Module({
  imports: [
    AppConfigModule,
    SharedUserModule,
    SharedAuthModule,
    OtpModule,
    MailModule,
    TypeOrmModule.forFeature([WorkerInvitationEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, SharedAuthModule],
})
export class AuthModule { }
