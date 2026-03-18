import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { UserRegisteredListener } from './listeners/user-registered.listener';
import { OtpRepository } from './otp.repository';
import { OtpEntity } from './entities/otp.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([OtpEntity, UserEntity]), forwardRef(() => AuthModule)],
  controllers: [OtpController],
  providers: [
    OtpService,
    UserRegisteredListener,
    OtpRepository,
  ],
  exports: [OtpService, OtpRepository],
})
export class OtpModule { }
