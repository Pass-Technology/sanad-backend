import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpService } from './otp.service';
import { OtpRepository } from './otp.repository';
import { OtpEntity } from './entities/otp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OtpEntity]),
  ],
  providers: [OtpService, OtpRepository],
  exports: [OtpService, OtpRepository],
})
export class OtpModule { }
