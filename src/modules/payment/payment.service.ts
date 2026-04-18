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

    async syncPayment(userId: string, updatePaymentDto: UpdatePaymentDto) {
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

            // Singleton Sync
            await this.syncRecords(manager, payment, 'cash', updatePaymentDto.cash, PaymentCashEntity);
            await this.syncRecords(manager, payment, 'cheque', updatePaymentDto.cheque, PaymentChequeEntity);

            // Collection Sync
            await this.syncRecords(manager, payment, 'bankTransfer', updatePaymentDto.bankTransfer, PaymentBankTransferEntity,
                async (e, d) => this.handleBankDetails(manager, payment, e, d));

            await this.syncRecords(manager, payment, 'sanad', updatePaymentDto.sanad, PaymentSanadEntity,
                async (e, d) => this.handleBankDetails(manager, payment, e, d));

            await this.syncRecords(manager, payment, 'pos', updatePaymentDto.pos, PaymentPosEntity);
            await this.syncRecords(manager, payment, 'paymentLink', updatePaymentDto.paymentLink, PaymentLinkEntity);

            return await manager.save(ProviderPaymentEntity, payment);
        });
    }

    /**
     * Core logic for synchronizing any payment method (Singleton or Collection).
     * Handles Create, Update, and Delete based on ID and isEnabled status.
     */
    private async syncRecords<T extends { id?: string; isEnabled?: boolean }>(
        manager: EntityManager,
        payment: ProviderPaymentEntity,
        key: keyof ProviderPaymentEntity,
        dtos: T | T[] | undefined,
        entityClass: any,
        extraLogic?: (entity: any, dto: T) => Promise<void>,
    ) {
        if (!dtos) return;
        const items = Array.isArray(dtos) ? dtos : [dtos];
        const currentData = (payment as any)[key];

        for (const dto of items) {
            if (dto.id) {
                const existing = Array.isArray(currentData)
                    ? (currentData as any[]).find((i) => i.id === dto.id)
                    : currentData;

                if (existing && (existing as any).id === dto.id) {
                    if (dto.isEnabled === false) {
                        await manager.remove(existing as any);
                        if (Array.isArray(currentData)) {
                            currentData.splice(currentData.indexOf(existing), 1);
                        } else {
                            (payment as any)[key] = null;
                        }
                        if ((existing as any).bankAccount) {
                            await this.safeDeleteBankAccount(manager, payment, (existing as any).bankAccount.id);
                        }
                    } else {
                        Object.assign(existing, dto);
                        if (extraLogic) await extraLogic(existing, dto);
                    }
                }
            } else if (dto.isEnabled === true) {
                const entity = manager.create(entityClass, { ...dto, providerPayment: { id: payment.id } });
                if (extraLogic) await extraLogic(entity, dto);

                if (Array.isArray(currentData)) {
                    currentData.push(entity);
                } else {
                    (payment as any)[key] = entity;
                }
            }
        }
    }

    /**
     * Logic for methods that require bank account handling (Bank Transfer & Sanad).
     */
    private async handleBankDetails(manager: EntityManager, payment: ProviderPaymentEntity, entity: any, dto: any) {
        const oldBankAccountId = entity.bankAccount?.id;

        if (dto.isUsingBankTransferData === true) {
            // JOIN: Switch to using shared bank transfer data
            const firstBt = payment.bankTransfer.find(bt => bt.isEnabled);
            if (!firstBt) throw new BadRequestException('No enabled bank transfer found to use for Sanad');

            const sharedBankAccountId = firstBt.bankAccount.id;
            entity.bankAccount = firstBt.bankAccount;

            // Cleanup old private account if it was switched out
            if (oldBankAccountId && oldBankAccountId !== sharedBankAccountId) {
                await this.safeDeleteBankAccount(manager, payment, oldBankAccountId);
            }
        } else if (dto.isUsingBankTransferData === false || dto.bankName || dto.iban) {
            // FORK/UPDATE: Use private bank account
            const isCurrentlyShared = payment.bankTransfer.some(bt => bt.bankAccount?.id === oldBankAccountId);

            if (isCurrentlyShared || !entity.bankAccount) {
                // Create a NEW private account to avoid mutating shared ones
                entity.bankAccount = this.createBankAccount(dto, manager);
                entity.bankAccount.providerPayment = { id: payment.id } as any;
            } else {
                // Update the already existing private account
                Object.assign(entity.bankAccount, dto);
            }
        }
    }

    private async safeDeleteBankAccount(manager: EntityManager, payment: ProviderPaymentEntity, bankAccountId: string) {
        const isUsedByBT = payment.bankTransfer.some(bt => bt.bankAccount?.id === bankAccountId);
        const isUsedBySanad = payment.sanad.some(s => s.bankAccount?.id === bankAccountId);

        if (!isUsedByBT && !isUsedBySanad) {
            await manager.delete(BankAccountEntity, bankAccountId);
        }
    }
}
