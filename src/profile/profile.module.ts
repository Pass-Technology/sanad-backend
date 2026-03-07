import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ProfileRepository } from './profile.repository';


import { ProviderProfile } from './entities/provider-profile.entity';
import { ProviderUserInfo } from './entities/provider-user-info.entity';
import { Branch } from './entities/branch.entity';
import { ServingArea } from './entities/serving-area.entity';
import { ProviderCompliance } from './entities/provider-compliance.entity';
import { ProviderPayment } from './entities/provider-payment.entity';
import { ProviderSubscription } from './entities/provider-subscription.entity';


import { UserModule } from '../user/user.module';
import { LookUpModule } from '../lookup/lookup.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProviderProfile,
            ProviderUserInfo,
            Branch,
            ServingArea,
            ProviderCompliance,
            ProviderPayment,
            ProviderSubscription,
        ]),
        UserModule,
        LookUpModule,
    ],
    controllers: [ProfileController],
    providers: [ProfileService, ProfileRepository],
    exports: [ProfileService],
})
export class ProfileModule { }
