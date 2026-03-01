import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { OtpModule } from './otp/otp.module';
import { HealthController } from './health.controller';

import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';

@Module({
  imports: [
    AppConfigModule,
    EventEmitterModule.forRoot(),
    DatabaseModule,
    UserModule,
    OtpModule,
  ],
  controllers: [HealthController],
})
export class AppModule { }
