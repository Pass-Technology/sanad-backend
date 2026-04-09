import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { OtpModule } from './modules/otp/otp.module';
import { HealthController } from './health.controller';
import { AppConfigModule } from './config/config.module';
import { ProfileModule } from './modules/profile/profile.module';
import { PlanModule } from './modules/plan/plan.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ServiceManagementModule } from './modules/service-management/service-management.module';
import { PaymentModule } from './modules/payment/payment.module';
import { MailModule } from './modules/mail/mail.module';


@Module({
  imports: [
    AppConfigModule,
    EventEmitterModule.forRoot(),
    DatabaseModule,
    UserModule,
    OtpModule,
    ProfileModule,
    PlanModule,
    SubscriptionModule,
    ServiceManagementModule,
    PaymentModule,
    MailModule,
  ],
  controllers: [HealthController],
})
export class AppModule { }
