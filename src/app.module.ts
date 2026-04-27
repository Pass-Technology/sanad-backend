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
import { TemplateModule } from './modules/template/template.module';
import { ScoringSystemModule } from './modules/profile-scoring-system/scoring-system.module';
import { SharedCacheModule } from './shared/cache/cache.module';
import { TargetAudienceModule } from './modules/target-audience-profile/target-audience.module';
import { AuthModule } from './modules/auth/auth.module';
import { UploadAssetsModule } from './modules/upload-assets/upload-assets.module';

@Module({
  imports: [
    AppConfigModule,
    EventEmitterModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UserModule,
    OtpModule,
    ProfileModule,
    PlanModule,
    SubscriptionModule,
    ServiceManagementModule,
    PaymentModule,
    MailModule,
    TemplateModule,
    ScoringSystemModule,
    SharedCacheModule,
    UploadAssetsModule,
    TargetAudienceModule
  ],
  controllers: [HealthController],
})
export class AppModule { }
