import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { OtpRepository } from './otp.repository';
import { OtpEntity } from './entities/otp.entity';
import { UserEntity } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([OtpEntity, UserEntity])],
  controllers: [OtpController],
  providers: [
    OtpService,
    OtpRepository,
  ],
  exports: [OtpService, OtpRepository],
})
export class OtpModule { }
