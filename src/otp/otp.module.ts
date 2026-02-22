import { Module, forwardRef } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { OtpRepository } from './otp.repository';
import { ValidOtpValidator } from './validators/valid-otp.validator';
import { UserModule } from '../user/user.module';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [OtpController],
  providers: [OtpService, OtpRepository, ValidOtpValidator],
  exports: [OtpService, OtpRepository],
})
export class OtpModule {}
