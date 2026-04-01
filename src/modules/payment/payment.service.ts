import { Injectable, BadRequestException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ProviderPaymentEntity } from './entities/provider-payment.entity';
import { PaymentCashEntity } from './entities/payment-cash.entity';
import { PaymentBankTransferEntity } from './entities/payment-bank-transfer.entity';
import { PaymentLinkEntity } from './entities/payment-link.entity';
import { PaymentSanadEntity } from './entities/payment-sanad.entity';
import { PaymentPosEntity } from './entities/payment-pos.entity';
import { PaymentChequeEntity } from './entities/payment-cheque.entity';
import { BankAccountEntity } from './entities/bank-account.entity';

@Injectable()
export class PaymentService {

    buildPaymentEntity(manager: EntityManager, paymentDto: CreatePaymentDto): ProviderPaymentEntity {

        const payment = manager.create(ProviderPaymentEntity);

        const cachEntity = this.addCashMethods(manager, paymentDto);
        const bankTransferEntity = this.addBankTransferMethods(manager, paymentDto);
        const sanadEntity = this.addSanadMethods(manager, payment, paymentDto);
        const posEntity = this.addPosMethods(manager, payment, paymentDto);
        const chequeEntity = this.addChequeMethods(manager, payment, paymentDto);
        const paymentLinkEntity = this.addPaymentLinkMethods(manager, payment, paymentDto);

        // payment.cash = cachEntity;
        if (bankTransferEntity?.length) {
            payment.bankTransfer = bankTransferEntity;
        }
        // payment.sanad = sanadEntity;
        // payment.pos = posEntity;
        // payment.cheque = chequeEntity;
        // payment.paymentLink = paymentLinkEntity;

        return payment;
    }

    private addCashMethods(manager: EntityManager, dto: CreatePaymentDto) {
        if (dto.cash?.isEnabled) {
            return manager.create(PaymentCashEntity, { ...dto.cash, });
        }
        // console.log(`payment.cash: ${payment.cash.isEnabled}`);
    }

    private addBankTransferMethods(manager: EntityManager, dto: CreatePaymentDto) {

        const { bankTransfer } = dto;

        // let bankTransferEntity = [];

        if (bankTransfer && bankTransfer?.length) {
            return bankTransfer
                .filter(btDto => btDto.isEnabled)
                .map(btDto => {
                    const bankAccount = this.createBankAccount(manager, btDto);
                    return manager.create(PaymentBankTransferEntity, {
                        isEnabled: btDto.isEnabled,
                        bankAccount,
                    });
                });
        }

        // console.log(payment.bankAccounts)
        // console.log(payment.bankTransfer)
    }

    private addSanadMethods(manager: EntityManager, payment: ProviderPaymentEntity, dto: CreatePaymentDto) {
        if (dto.sanad?.length) {
            payment.sanad = dto.sanad
                .filter(sanadDto => sanadDto.isEnabled)
                .map(sanadDto => {
                    let bankAccount: BankAccountEntity;

                    if (sanadDto.isUsingBankTransferData) {
                        if (payment.bankTransfer?.length > 0) {
                            bankAccount = payment.bankTransfer[0].bankAccount;
                        } else {
                            throw new BadRequestException(
                                'Cannot use bank transfer data for Sanad because no bank transfer method was provided',
                            );
                        }
                    } else {
                        bankAccount = this.createBankAccount(manager, sanadDto);
                    }

                    return manager.create(PaymentSanadEntity, {
                        isEnabled: sanadDto.isEnabled,
                        settlementPreference: sanadDto.settlementPreference,
                        isUsingBankTransferData: sanadDto.isUsingBankTransferData,
                        providerPayment: payment,
                        bankAccount,
                    });
                });
        }
        // console.log(payment.sanad)
    }

    private addPosMethods(manager: EntityManager, payment: ProviderPaymentEntity, dto: CreatePaymentDto) {
        if (dto.pos?.length) {
            payment.pos = dto.pos
                .filter(posDto => posDto.isEnabled)
                .map(posDto =>
                    manager.create(PaymentPosEntity, { ...posDto, providerPayment: payment })
                );
        }
        // console.log(payment.pos)
    }

    private addChequeMethods(manager: EntityManager, payment: ProviderPaymentEntity, dto: CreatePaymentDto) {
        if (dto.cheque?.isEnabled) {
            payment.cheque = manager.create(PaymentChequeEntity, { ...dto.cheque, providerPayment: payment });
        }
        // console.log(payment.cheque)
    }

    private addPaymentLinkMethods(manager: EntityManager, payment: ProviderPaymentEntity, dto: CreatePaymentDto) {
        if (dto.paymentLink?.length) {
            payment.paymentLink = dto.paymentLink
                .filter(linkDto => linkDto.isEnabled)
                .map(linkDto =>
                    manager.create(PaymentLinkEntity, { ...linkDto, providerPayment: payment })
                );
        }
        // console.log(payment.providerProfile.id)
        // console.log(payment.paymentLink)
    }

    private createBankAccount(manager: EntityManager, data: any): BankAccountEntity {
        const bankAccount = manager.create(BankAccountEntity, {
            bankName: data.bankName,
            accountHolderName: data.accountHolderName,
            accountNumber: data.accountNumber,
            iban: data.iban,
            swiftCode: data.swiftCode,
        });
        // console.log(bankAccount.id)
        return bankAccount;
    }
}
