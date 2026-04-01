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
import { BankTransferMethodDto } from './dto/bank-transfer-method.dto';
import { SanadMethodDto } from './dto/sanad-method.dto';

@Injectable()
export class PaymentService {

    buildPaymentEntity(paymentDto: CreatePaymentDto, manager?: EntityManager): ProviderPaymentEntity {
        const paymentData = { bankAccounts: [] } as any;
        const payment = manager
            ? manager.create(ProviderPaymentEntity, paymentData)
            : Object.assign(new ProviderPaymentEntity(), paymentData);

        this.addCashMethods(payment, paymentDto, manager);
        this.addBankTransferMethods(payment, paymentDto, manager);
        this.addSanadMethods(payment, paymentDto, manager);
        this.addPosMethods(payment, paymentDto, manager);
        this.addChequeMethods(payment, paymentDto, manager);
        this.addPaymentLinkMethods(payment, paymentDto, manager);

        return payment;
    }

    private addCashMethods(payment: ProviderPaymentEntity, dto: CreatePaymentDto, manager?: EntityManager) {
        if (dto.cash?.isEnabled) {
            const data = { ...dto.cash } as any;
            payment.cash = manager ? manager.create(PaymentCashEntity, data) : Object.assign(new PaymentCashEntity(), data);
        }
    }

    private addBankTransferMethods(payment: ProviderPaymentEntity, dto: CreatePaymentDto, manager?: EntityManager) {
        if (dto.bankTransfer?.length) {
            payment.bankTransfer = dto.bankTransfer
                .filter(btDto => btDto.isEnabled)
                .map(btDto => {
                    const bankAccount = this.createBankAccount(btDto, manager);
                    payment.bankAccounts.push(bankAccount);

                    const data = { isEnabled: btDto.isEnabled } as any;
                    const entity = manager
                        ? manager.create(PaymentBankTransferEntity, data)
                        : Object.assign(new PaymentBankTransferEntity(), data);

                    entity.bankAccount = bankAccount; // Assign AFTER creation to preserve exact memory pointer
                    return entity;
                });
        }
    }

    private addSanadMethods(payment: ProviderPaymentEntity, dto: CreatePaymentDto, manager?: EntityManager) {
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
                        bankAccount = this.createBankAccount(sanadDto, manager);
                        payment.bankAccounts.push(bankAccount);
                    }

                    const data = {
                        isEnabled: sanadDto.isEnabled,
                        settlementPreference: sanadDto.settlementPreference,
                        isUsingBankTransferData: sanadDto.isUsingBankTransferData,
                    } as any;
                    const entity = manager
                        ? manager.create(PaymentSanadEntity, data)
                        : Object.assign(new PaymentSanadEntity(), data);

                    entity.bankAccount = bankAccount; // Assign AFTER creation to preserve exact memory pointer
                    return entity;
                });
        }
    }

    private addPosMethods(payment: ProviderPaymentEntity, dto: CreatePaymentDto, manager?: EntityManager) {
        if (dto.pos?.length) {
            payment.pos = dto.pos
                .filter(posDto => posDto.isEnabled)
                .map(posDto => {
                    const data = { ...posDto } as any;
                    return manager ? manager.create(PaymentPosEntity, data) : Object.assign(new PaymentPosEntity(), data);
                });
        }
    }

    private addChequeMethods(payment: ProviderPaymentEntity, dto: CreatePaymentDto, manager?: EntityManager) {
        if (dto.cheque?.isEnabled) {
            const data = { ...dto.cheque } as any;
            payment.cheque = manager ? manager.create(PaymentChequeEntity, data) : Object.assign(new PaymentChequeEntity(), data);
        }
    }

    private addPaymentLinkMethods(payment: ProviderPaymentEntity, dto: CreatePaymentDto, manager?: EntityManager) {
        if (dto.paymentLink?.length) {
            payment.paymentLink = dto.paymentLink
                .filter(linkDto => linkDto.isEnabled)
                .map(linkDto => {
                    const data = { ...linkDto } as any;
                    return manager ? manager.create(PaymentLinkEntity, data) : Object.assign(new PaymentLinkEntity(), data);
                });
        }
    }

    private createBankAccount(data: BankTransferMethodDto | SanadMethodDto, manager?: EntityManager): BankAccountEntity {
        const bankData = {
            bankName: data.bankName,
            accountHolderName: data.accountHolderName,
            accountNumber: data.accountNumber,
            iban: data.iban,
            swiftCode: data.swiftCode,
        } as any;
        return manager ? manager.create(BankAccountEntity, bankData) : Object.assign(new BankAccountEntity(), bankData);
    }
}
