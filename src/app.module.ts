import { Module } from '@nestjs/common';
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
    MailModule,
    TemplateModule,
    ScoringSystemModule,
    SharedCacheModule,
    UploadAssetsModule,
    TargetAudienceModule,
    ValidatorModule,
    LegalModule,
    ClientModule
  ],
  controllers: [HealthController],
})
export class AppModule { }
