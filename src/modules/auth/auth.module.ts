import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppConfigModule } from '../../config/config.module';
import { AppConfigService } from '../../config/config.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        secret: config.auth.jwtSecret,
        signOptions: { expiresIn: config.auth.accessExpiration as any },
      }),
    }),
    AppConfigModule,
  ],
  providers: [JwtAuthGuard, AuthService],
  exports: [JwtModule, PassportModule, JwtAuthGuard, AuthService],
})
export class AuthModule { }
