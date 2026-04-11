import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserEntity } from './entities/user.entity';
import { ExistingUserValidator } from './validators/existing-user.validator';
import { ExistingUserForAuthValidator } from './validators/existing-user-for-auth.validator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { AppConfigModule } from '../../config/config.module';
import { AppConfigService } from '../../config/config.service';
import { OtpModule } from '../otp/otp.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => OtpModule),
    MailModule,
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
    ExistingUserValidator,
    ExistingUserForAuthValidator,
    JwtAuthGuard,
  ],
  exports: [UserService, UserRepository, JwtAuthGuard, JwtModule],
})
export class UserModule { }
