import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { UserRegisteredListener } from './listeners/user-registered.listener';
import { OtpRepository } from './otp.repository';
import { ValidOtpValidator } from './validators/valid-otp.validator';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [OtpController],
  providers: [
    OtpService,
    UserRegisteredListener,
    OtpRepository,
    ValidOtpValidator,
  ],
  exports: [OtpService, OtpRepository],
})
export class OtpModule {}
