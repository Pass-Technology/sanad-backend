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
import { ClientRequestsModule } from './modules/client-requests/client-requests.module';
import { ProviderJobsModule } from './modules/provider-jobs/provider-jobs.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { EarningsModule } from './modules/earnings/earnings.module';
import { ReviewModule } from './modules/reviews/review.module';
import { EmergencyModule } from './modules/emergency/emergency.module';
import { DocumentationModule } from './modules/documentation/documentation.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { BlogsModule } from './modules/blogs/blogs.module';

@Module({
  imports: [
    AppConfigModule,
    // ThrottlerModule.forRoot([{
    //   ttl: 60000,
    //   limit: 10,
    // }]),
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
    MailModule,
    TemplateModule,
    ScoringSystemModule,
    SharedCacheModule,
    UploadAssetsModule,
    TargetAudienceModule,
    ValidatorModule,
    LegalModule,
    ClientModule,
    ClientRequestsModule,
    ProviderJobsModule,
    PromotionsModule,
    EarningsModule,
    ReviewModule,
    EmergencyModule,
    DocumentationModule,
    NotificationModule,
    BlogsModule,
  ],
  controllers: [HealthController],
})
export class AppModule { }
