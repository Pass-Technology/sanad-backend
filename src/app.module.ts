import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { OtpModule } from './otp/otp.module';
import { HealthController } from './health.controller';

import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';
import { ProfileModule } from './profile/profile.module';
import { LookUpModule } from './lookup/lookup.module';

@Module({
  imports: [
    AppConfigModule,
    EventEmitterModule.forRoot(),
    DatabaseModule,
    UserModule,
    OtpModule,
    ProfileModule,
    LookUpModule
  ],
  controllers: [HealthController],
})
export class AppModule { }
