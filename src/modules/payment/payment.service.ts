import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import {
    UpdatePaymentDto,
    UpdateBankTransferMethodDto,
    UpdateSanadMethodDto,
    UpdateCashMethodDto,
    UpdateChequeMethodDto,
    UpdatePosMethodDto,
    UpdatePaymentLinkMethodDto
} from './dto/update-payment.dto';
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
        return this.dataSource.transaction(async (manager) => {
            const payment = await this.loadPayment(manager, userId);

            await this.syncCash(manager, payment, updatePaymentDto.cash);
            await this.syncCheque(manager, payment, updatePaymentDto.cheque);

            await this.syncBankTransfers(manager, payment, updatePaymentDto.bankTransfer);
            await this.syncSanad(manager, payment, updatePaymentDto.sanad);

            await this.syncPos(manager, payment, updatePaymentDto.pos);
            await this.syncPaymentLinks(manager, payment, updatePaymentDto.paymentLink);

            await this.cleanupBankAccounts(manager, payment);

            return payment;
        });
    }

    private async loadPayment(manager: EntityManager, userId: string): Promise<ProviderPaymentEntity> {
        const payment = await manager.findOne(ProviderPaymentEntity, {
            where: { providerProfile: { user: { id: userId } } },
            relations: {
                cash: true,
                cheque: true,
                bankTransfer: { bankAccount: true },
                sanad: { bankAccount: true },
                pos: true,
                paymentLink: true,
                bankAccounts: true,
            }
        });

        if (!payment) throw new NotFoundException('Payment configuration not found');
        return payment;
    }

    private async syncCash(manager: EntityManager, payment: ProviderPaymentEntity, dto?: UpdateCashMethodDto) {
        if (!dto) return;

        if (dto.id) {
            if (dto.isEnabled === false) {
                if (payment.cash) {
                    await manager.remove(payment.cash);
                    payment.cash = null as any;
                }
                return;
            }

            if (payment.cash) {
                Object.assign(payment.cash, dto);
                await manager.save(payment.cash);
            }
            return;
        }

        if (dto.isEnabled === true) {
            const entity = manager.create(PaymentCashEntity, dto);
            entity.providerPayment = payment;

            payment.cash = await manager.save(entity);
        }
    }

    private async syncCheque(manager: EntityManager, payment: ProviderPaymentEntity, dto?: UpdateChequeMethodDto) {
        if (!dto) return;

        if (dto.id) {
            if (dto.isEnabled === false) {
                if (payment.cheque) {
                    await manager.remove(payment.cheque);
                    payment.cheque = null as any;
                }
                return;
            }

            if (payment.cheque) {
                Object.assign(payment.cheque, dto);
                await manager.save(payment.cheque);
            }
            return;
        }

        if (dto.isEnabled === true) {
            const entity = manager.create(PaymentChequeEntity, dto);
            entity.providerPayment = payment;

            payment.cheque = await manager.save(entity);
        }
    }

    private async syncBankTransfers(
        manager: EntityManager,
        payment: ProviderPaymentEntity,
        dtos?: UpdateBankTransferMethodDto[],
    ) {
        if (!dtos) return;
        payment.bankTransfer = payment.bankTransfer || [];

        for (const dto of dtos) {
            // DELETE
            if (dto.id && dto.isEnabled === false) {
                await manager.delete(PaymentBankTransferEntity, dto.id);
                payment.bankTransfer = payment.bankTransfer.filter(bt => bt.id !== dto.id);
                continue;
            }

            // UPDATE
            if (dto.id) {
                const entity = payment.bankTransfer.find(bt => bt.id === dto.id)
                    || await manager.findOne(PaymentBankTransferEntity, {
                        where: { id: dto.id },
                        relations: ['bankAccount'],
                    });

                if (entity) {
                    Object.assign(entity, dto);
                    entity.bankAccount = await this.resolveBankAccount(manager, payment, dto, entity.bankAccount);
                    await manager.save(entity);

                    if (!payment.bankTransfer.some(bt => bt.id === entity.id)) {
                        payment.bankTransfer.push(entity);
                    }
                }
                continue;
            }

            // CREATE
            if (dto.isEnabled === true) {
                const entity = manager.create(PaymentBankTransferEntity, dto);
                entity.bankAccount = await this.resolveBankAccount(manager, payment, dto);
                entity.providerPayment = payment;
                const saved = await manager.save(entity);
                payment.bankTransfer.push(saved);
            }
        }
    }

    private async syncSanad(
        manager: EntityManager,
        payment: ProviderPaymentEntity,
        dtos?: UpdateSanadMethodDto[],
    ) {
        if (!dtos) return;
        payment.sanad = payment.sanad || [];

        for (const dto of dtos) {
            if (dto.id && dto.isEnabled === false) {
                await manager.delete(PaymentSanadEntity, dto.id);
                payment.sanad = payment.sanad.filter(s => s.id !== dto.id);
                continue;
            }

            if (dto.id) {
                const entity = payment.sanad.find(s => s.id === dto.id)
                    || await manager.findOne(PaymentSanadEntity, {
                        where: { id: dto.id },
                        relations: {
                            bankAccount: true
                        }
                    });

                if (entity) {
                    Object.assign(entity, dto);
                    entity.bankAccount = await this.resolveBankAccount(manager, payment, dto, entity.bankAccount);
                    await manager.save(entity);

                    if (!payment.sanad.some(s => s.id === entity.id)) {
                        payment.sanad.push(entity);
                    }
                }
                continue;
            }

            if (dto.isEnabled === true) {
                const entity = manager.create(PaymentSanadEntity, dto);
                entity.bankAccount = await this.resolveBankAccount(manager, payment, dto);
                entity.providerPayment = payment;
                const saved = await manager.save(entity);
                payment.sanad.push(saved);
            }
        }
    }

    private async syncPos(
        manager: EntityManager,
        payment: ProviderPaymentEntity,
        dtos?: UpdatePosMethodDto[],
    ) {
        if (!dtos) return;
        payment.pos = payment.pos || [];

        for (const dto of dtos) {
            if (dto.id && dto.isEnabled === false) {
                await manager.delete(PaymentPosEntity, dto.id);
                payment.pos = payment.pos.filter(p => p.id !== dto.id);
                continue;
            }

            if (dto.id) {
                const entity = payment.pos.find(p => p.id === dto.id)
                    || await manager.findOne(PaymentPosEntity, { where: { id: dto.id } });
                if (entity) {
                    Object.assign(entity, dto);
                    await manager.save(entity);

                    if (!payment.pos.some(p => p.id === entity.id)) {
                        payment.pos.push(entity);
                    }
                }
                continue;
            }

            if (dto.isEnabled === true) {
                const entity = manager.create(PaymentPosEntity, dto);
                entity.providerPayment = payment;
                const saved = await manager.save(entity);
                payment.pos.push(saved);
            }
        }
    }

    private async syncPaymentLinks(
        manager: EntityManager,
        payment: ProviderPaymentEntity,
        dtos?: UpdatePaymentLinkMethodDto[],
    ) {
        if (!dtos) return;
        payment.paymentLink = payment.paymentLink || [];

        for (const dto of dtos) {
            if (dto.id && dto.isEnabled === false) {
                await manager.delete(PaymentLinkEntity, dto.id);
                payment.paymentLink = payment.paymentLink.filter(pl => pl.id !== dto.id);
                continue;
            }

            if (dto.id) {
                const entity = payment.paymentLink.find(pl => pl.id === dto.id)
                    || await manager.findOne(PaymentLinkEntity, { where: { id: dto.id } });
                if (entity) {
                    Object.assign(entity, dto);
                    await manager.save(entity);

                    if (!payment.paymentLink.some(pl => pl.id === entity.id)) {
                        payment.paymentLink.push(entity);
                    }
                }
                continue;
            }

            if (dto.isEnabled === true) {
                const entity = manager.create(PaymentLinkEntity, dto);
                entity.providerPayment = payment;
                const saved = await manager.save(entity);
                payment.paymentLink.push(saved);
            }
        }
    }


    private async resolveBankAccount(
        manager: EntityManager,
        payment: ProviderPaymentEntity,
        dto: any,
        existingAccount?: BankAccountEntity,
    ): Promise<BankAccountEntity> {

        //use shared bank transfer account
        if (dto.isUsingBankTransferData === true) {
            const shared = payment.bankTransfer?.find(bt => bt.isEnabled);

            if (!shared) {
                throw new BadRequestException('No enabled bank transfer found');
            }

            return shared.bankAccount;
        }

        //update existing account
        if (existingAccount) {
            this.applyBankDetails(existingAccount, dto);
            return await manager.save(existingAccount);
        }

        //create new account
        if (dto.bankName || dto.iban) {
            const account = manager.create(BankAccountEntity, {
                bankName: dto.bankName,
                accountHolderName: dto.accountHolderName,
                accountNumber: dto.accountNumber,
                iban: dto.iban,
                swiftCode: dto.swiftCode,
            });

            account.providerPayment = payment;

            const saved = await manager.save(account);
            payment.bankAccounts = payment.bankAccounts || [];
            payment.bankAccounts.push(saved);
            return saved;
        }

        throw new BadRequestException('Invalid bank data');
    }

    private async cleanupBankAccounts(manager: EntityManager, payment: ProviderPaymentEntity) {
        const usedAccountIds = new Set<string>();

        // Collect all bank account IDs currently referenced by payment methods
        payment.bankTransfer?.forEach(bt => {
            if (bt.bankAccount?.id) usedAccountIds.add(bt.bankAccount.id);
        });

        payment.sanad?.forEach(s => {
            if (s.bankAccount?.id) usedAccountIds.add(s.bankAccount.id);
        });

        // Identify accounts that are no longer referenced
        const accountsToDelete = (payment.bankAccounts || []).filter(ba => !usedAccountIds.has(ba.id));

        if (accountsToDelete.length > 0) {
            await manager.remove(accountsToDelete);
            payment.bankAccounts = payment.bankAccounts.filter(ba => usedAccountIds.has(ba.id));
        }
    }

    private applyBankDetails(bank: BankAccountEntity, dto: any) {
        if (dto.bankName !== undefined) bank.bankName = dto.bankName;
        if (dto.accountHolderName !== undefined) bank.accountHolderName = dto.accountHolderName;
        if (dto.accountNumber !== undefined) bank.accountNumber = dto.accountNumber;
        if (dto.iban !== undefined) bank.iban = dto.iban;
        if (dto.swiftCode !== undefined) bank.swiftCode = dto.swiftCode;
    }
}

