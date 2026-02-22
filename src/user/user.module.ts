import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { ExistingUserValidator } from './validators/existing-user.validator';
import { ExistingUserForAuthValidator } from './validators/existing-user-for-auth.validator';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OtpModule } from '../otp/otp.module';

@Module({
  imports: [
    PassportModule,
    forwardRef(() => OtpModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'test-secret-key',
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    ExistingUserValidator,
    ExistingUserForAuthValidator,
    JwtStrategy,
  ],
  exports: [UserService, UserRepository],
})
export class UserModule {}
