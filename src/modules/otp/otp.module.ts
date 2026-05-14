import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpService } from './otp.service';
import { OtpRepository } from './otp.repository';
import { OtpEntity } from './entities/otp.entity';
import { OtpController } from './otp.controller';
import { SharedUserModule } from '../../shared/user/shared-user.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OtpEntity]),
    SharedUserModule,
    MailModule,
  ],
  controllers: [OtpController],
  providers: [OtpService, OtpRepository],
  exports: [OtpService, OtpRepository],
})
export class OtpModule { }
