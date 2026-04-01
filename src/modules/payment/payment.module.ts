import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { ProviderPaymentEntity } from './entities/provider-payment.entity';
import { PaymentCashEntity } from './entities/payment-cash.entity';
import { PaymentBankTransferEntity } from './entities/payment-bank-transfer.entity';
import { PaymentLinkEntity } from './entities/payment-link.entity';
import { PaymentSanadEntity } from './entities/payment-sanad.entity';
import { PaymentPosEntity } from './entities/payment-pos.entity';
import { PaymentChequeEntity } from './entities/payment-cheque.entity';
import { BankAccountEntity } from './entities/bank-account.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProviderPaymentEntity,
            PaymentCashEntity,
            PaymentBankTransferEntity,
            PaymentLinkEntity,
            PaymentSanadEntity,
            PaymentPosEntity,
            PaymentChequeEntity,
            BankAccountEntity,
        ]),
    ],
    providers: [PaymentService],
    exports: [PaymentService],
})
export class PaymentModule { }
