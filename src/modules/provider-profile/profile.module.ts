import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ProfileRepository } from './profile.repository';
import { WorkerInvitationEntity } from './entities/worker-invitation.entity';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { ProviderProfileEntity } from './entities/provider-profile.entity';
import { ProviderUserInfoEntity } from './entities/provider-user-info.entity';
import { BranchEntity } from './entities/branch.entity';
import { ServingAreaEntity } from './entities/serving-area.entity';
import { ProviderComplianceEntity } from './entities/provider-compliance.entity';
import { ProviderServiceEntity } from '../service-management/entities/provider-service.entity';
import { ProviderServicePricingEntity } from '../service-management/entities/provider-service-pricing.entity';
import { ServiceManagementModule } from '../service-management/service-management.module';
import { UserModule } from '../user/user.module';
import { LookupsModule } from '../lookups/lookups.module';
import { ProviderPaymentEntity } from '../payment/entities/provider-payment.entity';
import { PaymentModule } from '../payment/payment.module';
import { AuthModule } from '../auth/auth.module';

import { ProviderWorkerEntity } from './entities/provider-worker.entity';
import { ProviderProfileChangeEntity } from './entities/provider-profile-change.entity';
import { ProfileStagingService } from './profile-staging.service';
import { ProfileBranchService } from './profile-branch.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProviderProfileEntity,
            ProviderUserInfoEntity,
            BranchEntity,
            ServingAreaEntity,
            ProviderComplianceEntity,
            ProviderPaymentEntity,
            ProviderServiceEntity,
            ProviderServicePricingEntity,
            ProviderWorkerEntity,
            ProviderProfileChangeEntity,
            WorkerInvitationEntity,
        ]),
        UserModule,
        AuthModule,
        ServiceManagementModule,
        LookupsModule,
        PaymentModule,
    ],
    controllers: [ProfileController, InvitationsController],
    providers: [ProfileService, ProfileRepository, ProfileStagingService, ProfileBranchService, InvitationsService],
    exports: [ProfileService, ProfileRepository, ProfileStagingService, ProfileBranchService, InvitationsService],
})
export class ProfileModule { }
