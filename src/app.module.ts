import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { OtpModule } from './modules/otp/otp.module';
import { HealthController } from './health.controller';
import { AppConfigModule } from './config/config.module';
import { ProfileModule } from './modules/profile/profile.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { PlanModule } from './modules/plan/plan.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';

@Module({
  imports: [
    AppConfigModule,
    EventEmitterModule.forRoot(),
    DatabaseModule,
    UserModule,
    OtpModule,
    ProfileModule,
    SubscriptionModule,
    PlanModule

  ],
  controllers: [HealthController],
})
export class AppModule { }
