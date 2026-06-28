import { Module } from '@nestjs/common';
// import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { OtpModule } from './modules/otp/otp.module';
import { HealthController } from './health.controller';
import { AppConfigModule } from './config/config.module';
import { ProfileModule } from './modules/provider-profile/profile.module';
import { AuthModule } from './modules/auth/auth.module';
import { PlanModule } from './modules/plan/plan.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ServiceManagementModule } from './modules/service-management/service-management.module';
import { PaymentModule } from './modules/payment/payment.module';
import { MailModule } from './modules/mail/mail.module';
import { TemplateModule } from './modules/template/template.module';
import { ScoringSystemModule } from './modules/profile-scoring-system/scoring-system.module';
import { SharedCacheModule } from './shared/cache/cache.module';
import { UploadAssetsModule } from './modules/upload-assets/upload-assets.module';
import { TargetAudienceModule } from './modules/target-audience-profile/target-audience.module';
import { ValidatorModule } from './modules/validator/validator.module';
import { LegalModule } from './modules/legal/legal.module';
import { ClientModule } from './modules/client/client.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { EarningsModule } from './modules/earnings/earnings.module';
import { EmergencyModule } from './modules/emergency/emergency.module';
import { DocumentationModule } from './modules/documentation/documentation.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { WorkerModule } from './modules/worker/worker.module';

@Module({
  imports: [
    AppConfigModule,
    EventEmitterModule.forRoot(),
    DatabaseModule,
    UserModule,
    AuthModule,
    OtpModule,
    ProfileModule,
    PlanModule,
    SubscriptionModule,
    ServiceManagementModule,
    PaymentModule,
    UploadAssetsModule,
    MailModule,
    TemplateModule,
    ScoringSystemModule,
    SharedCacheModule,
    TargetAudienceModule,
    ValidatorModule,
    LegalModule,
    ClientModule,
    PromotionsModule,
    EarningsModule,
    EmergencyModule,
    DocumentationModule,
    NotificationModule,
    BlogsModule,
    JobsModule,
    WorkerModule,
  ],
  controllers: [HealthController],
})
export class AppModule { }
