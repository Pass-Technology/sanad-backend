import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { UserVerificationRequestedListener } from './listeners/user-verification-requested.listener';
import { ExistingUserValidator } from './validators/existing-user.validator';
import { ExistingUserForAuthValidator } from './validators/existing-user-for-auth.validator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { AppConfigModule } from '../config/config.module';
import { AppConfigService } from '../config/config.service';
import { OtpModule } from '../otp/otp.module';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    OtpModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        secret: config.auth.jwtSecret,
        signOptions: { expiresIn: config.auth.accessExpiration as any },
      }),


    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserVerificationRequestedListener,
    ExistingUserValidator,
    ExistingUserForAuthValidator,
    JwtAuthGuard,
  ],
  exports: [UserService, UserRepository, JwtAuthGuard, JwtModule],
})
export class UserModule { }
