import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
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
    constructor(private readonly dataSource: DataSource) { }

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

    private createBankAccount(data: any, manager?: EntityManager): BankAccountEntity {
        const bankData = {
            bankName: data.bankName,
            accountHolderName: data.accountHolderName,
            accountNumber: data.accountNumber,
            iban: data.iban,
            swiftCode: data.swiftCode,
        } as any;
        return manager ? manager.create(BankAccountEntity, bankData) : Object.assign(new BankAccountEntity(), bankData);
    }

    async syncPayment(userId: string, dto: UpdatePaymentDto) {
        return await this.dataSource.transaction(async (manager) => {
            const payment = await manager.findOne(ProviderPaymentEntity, {
                where: { providerProfile: { user: { id: userId } } },
                relations: {
                    cash: true,
                    bankTransfer: { bankAccount: true },
                    paymentLink: true,
                    sanad: { bankAccount: true },
                    pos: true,
                    cheque: true,
                    bankAccounts: true,
                }
            });

            if (!payment) throw new NotFoundException('Payment configuration not found');

            // 1. Singletons (Cash, Cheque)
            if (dto.cash) {
                if (payment.cash) {
                    Object.assign(payment.cash, dto.cash);
                } else {
                    payment.cash = manager.create(PaymentCashEntity, { ...dto.cash, providerPayment: { id: payment.id } } as any);
                }
            }

            if (dto.cheque) {
                if (payment.cheque) {
                    Object.assign(payment.cheque, dto.cheque);
                } else {
                    payment.cheque = manager.create(PaymentChequeEntity, { ...dto.cheque, providerPayment: { id: payment.id } } as any);
                }
            }

            // 2. Collections (BankTransfer, Sanad, POS, Link)
            if (dto.bankTransfer) {
                for (const btDto of dto.bankTransfer) {
                    if (btDto.id) {
                        const existing = payment.bankTransfer.find(b => b.id === btDto.id);
                        if (existing) {
                            if (btDto.isEnabled !== undefined) existing.isEnabled = btDto.isEnabled;
                            Object.assign(existing.bankAccount, btDto);
                        }
                    } else {
                        const bankAccount = this.createBankAccount(btDto, manager);
                        bankAccount.providerPayment = { id: payment.id } as any;
                        const entity = manager.create(PaymentBankTransferEntity, {
                            isEnabled: btDto.isEnabled,
                            bankAccount,
                            providerPayment: { id: payment.id }
                        } as any);
                        payment.bankTransfer.push(entity);
                    }
                }
            }

            if (dto.sanad) {
                for (const sDto of dto.sanad) {
                    if (sDto.id) {
                        const existing = payment.sanad.find(s => s.id === sDto.id);
                        if (existing) {
                            Object.assign(existing, sDto);
                            if (sDto.bankName) Object.assign(existing.bankAccount, sDto);
                        }
                    } else {
                        let bankAccount: BankAccountEntity;
                        if (sDto.isUsingBankTransferData) {
                            const firstBt = payment.bankTransfer.find(bt => bt.isEnabled);
                            if (!firstBt) throw new BadRequestException('No enabled bank transfer found to use for Sanad');
                            bankAccount = firstBt.bankAccount;
                        } else {
                            bankAccount = this.createBankAccount(sDto, manager);
                            bankAccount.providerPayment = { id: payment.id } as any;
                        }

                        const entity = manager.create(PaymentSanadEntity, {
                            ...sDto,
                            bankAccount,
                            providerPayment: { id: payment.id }
                        } as any);
                        payment.sanad.push(entity);
                    }
                }
            }

            if (dto.pos) {
                for (const pDto of dto.pos) {
                    if (pDto.id) {
                        const existing = payment.pos.find(p => p.id === pDto.id);
                        if (existing) Object.assign(existing, pDto);
                    } else {
                        payment.pos.push(manager.create(PaymentPosEntity, { ...pDto, providerPayment: { id: payment.id } } as any));
                    }
                }
            }

            if (dto.paymentLink) {
                for (const lDto of dto.paymentLink) {
                    if (lDto.id) {
                        const existing = payment.paymentLink.find(l => l.id === lDto.id);
                        if (existing) Object.assign(existing, lDto);
                    } else {
                        payment.paymentLink.push(manager.create(PaymentLinkEntity, { ...lDto, providerPayment: { id: payment.id } } as any));
                    }
                }
            }

            return await manager.save(ProviderPaymentEntity, payment);
        });
    }
}
