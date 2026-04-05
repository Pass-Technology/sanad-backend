import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ProfileRepository } from './profile.repository';

import { ProviderProfileEntity } from './entities/provider-profile.entity';
import { ProviderUserInfoEntity } from './entities/provider-user-info.entity';
import { BranchEntity } from './entities/branch.entity';
import { ServingAreaEntity } from './entities/serving-area.entity';
import { ProviderComplianceEntity } from './entities/provider-compliance.entity';
import { ServiceManagementModule } from '../service-management/service-management.module';

import { UserModule } from '../user/user.module';
import { LookupsModule } from '../lookups/lookups.module';
import { BankAccountEntity } from '../payment/entities/bank-account.entity';
import { PaymentBankTransferEntity } from '../payment/entities/payment-bank-transfer.entity';
import { PaymentCashEntity } from '../payment/entities/payment-cash.entity';
import { PaymentChequeEntity } from '../payment/entities/payment-cheque.entity';
import { PaymentLinkEntity } from '../payment/entities/payment-link.entity';
import { PaymentPosEntity } from '../payment/entities/payment-pos.entity';
import { PaymentSanadEntity } from '../payment/entities/payment-sanad.entity';
import { ProviderPaymentEntity } from '../payment/entities/provider-payment.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProviderProfileEntity,
            ProviderUserInfoEntity,
            BranchEntity,
            ServingAreaEntity,
            ProviderComplianceEntity,
            ProviderPaymentEntity,
            PaymentCashEntity,
            PaymentBankTransferEntity,
            PaymentLinkEntity,
            PaymentSanadEntity,
            PaymentPosEntity,
            PaymentChequeEntity,
            BankAccountEntity,
        ]),
        UserModule,
        ServiceManagementModule,
        LookupsModule,
    ],
    controllers: [ProfileController],
    providers: [ProfileService, ProfileRepository],
    exports: [ProfileService],
})
export class ProfileModule { }
