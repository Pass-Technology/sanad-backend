import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserEntity } from './entities/user.entity';
import { ExistingUserValidator } from './validators/existing-user.validator';
import { ExistingUserForAuthValidator } from './validators/existing-user-for-auth.validator';
import { OtpModule } from '../otp/otp.module';
import { MailModule } from '../mail/mail.module';
import { SharedAuthModule } from '../../shared/auth/shared-auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    OtpModule,
    MailModule,
    SharedAuthModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    ExistingUserValidator,
    ExistingUserForAuthValidator,
  ],
  exports: [UserService, UserRepository, TypeOrmModule],
})
export class UserModule { }
