import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ContractEntity } from '../jobs/entities/contract.entity';
import { PayoutEntity } from './entities/payout.entity';
import { ContractStatus } from '../jobs/enums/contract-status.enum';
import { PayoutStatus } from './enums/payout-status.enum';
import { ProfileService } from '../provider-profile/profile.service';
import { EarningsQueryDto, TimePeriod } from './dto/earnings-query.dto';
import { RequestPayoutDto } from './dto/request-payout.dto';

@Injectable()
export class EarningsService {
    private readonly PLATFORM_FEE_PERCENT = 0.10;

    constructor(
        @InjectRepository(ContractEntity)
        private readonly contractRepository: Repository<ContractEntity>,
        @InjectRepository(PayoutEntity)
        private readonly payoutRepository: Repository<PayoutEntity>,
        private readonly providerProfileService: ProfileService,
    ) { }

    async getProviderStats(userId: string, query: EarningsQueryDto) {
        const provider = await this.providerProfileService.getMyProfile(userId);
        if (!provider) {
            throw new NotFoundException('Provider profile not found');
        }

        const providerId = provider.id;
        const dateRange = this.getDateRange(query);

        const completedContracts = await this.contractRepository.find({
            where: {
                status: ContractStatus.COMPLETED,
                provider: { id: providerId },
                completedAt: Between(dateRange.start, dateRange.end),
            },
        });

        const grossEarnings = completedContracts.reduce((sum, contract) => {
            return sum + Number(contract.price || 0);
        }, 0);

        const platformFee = grossEarnings * this.PLATFORM_FEE_PERCENT;
        const netEarnings = grossEarnings - platformFee;

        const payouts = await this.payoutRepository.find({
            where: { provider: { id: providerId } },
            relations: { bankAccount: true },
        });

        const completedPayouts = payouts
            .filter(p => p.status === PayoutStatus.PAID)
            .reduce((sum, p) => sum + Number(p.amount), 0);

        const processingPayouts = payouts
            .filter(p => p.status === PayoutStatus.PROCESSING || p.status === PayoutStatus.PENDING)
            .reduce((sum, p) => sum + Number(p.amount), 0);

        const availableToWithdraw = netEarnings - (completedPayouts + processingPayouts);

        const primaryBankAccount = payouts.find(p => p.bankAccount)?.bankAccount || null;
        const bankAccountInfo = primaryBankAccount ? {
            bankName: primaryBankAccount.bankName,
            last4: primaryBankAccount.iban ? primaryBankAccount.iban.slice(-4) : (primaryBankAccount.accountNumber ? primaryBankAccount.accountNumber.slice(-4) : '****'),
        } : null;

        const now = new Date();
        const nextPayoutDate = new Date();
        if (now.getDate() < 15) {
            nextPayoutDate.setDate(15);
        } else {
            const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            nextPayoutDate.setDate(lastDayOfMonth);
        }
        nextPayoutDate.setHours(0, 0, 0, 0);

        return {
            totalBalance: availableToWithdraw,
            availableToWithdraw,
            pendingBalance: processingPayouts,
            grossEarnings,
            platformFee,
            netEarnings,
            pendingPayout: processingPayouts,
            completedPayouts,
            bankAccount: bankAccountInfo,
            nextPayout: {
                estimatedDate: nextPayoutDate,
                estimatedAmount: availableToWithdraw > 0 ? availableToWithdraw : 0,
            },
            currency: 'AED',
        };
    }

    async getPayoutHistory(userId: string) {
        const provider = await this.providerProfileService.getMyProfile(userId);
        if (!provider) throw new NotFoundException('Provider profile not found');

        return await this.payoutRepository.find({
            where: { provider: { id: provider.id } },
            order: { createdAt: 'DESC' },
            relations: { bankAccount: true },
        });
    }

    async requestPayout(userId: string, dto: RequestPayoutDto) {
        const provider = await this.providerProfileService.getMyProfile(userId);
        if (!provider) throw new NotFoundException('Provider profile not found');

        const stats = await this.getProviderStats(userId, { period: TimePeriod.WEEK });

        if (dto.amount > stats.availableToWithdraw) {
            throw new BadRequestException('Insufficient balance for payout');
        }

        const profile = await this.providerProfileService.getProfileById(provider.id);
        const bankAccount = profile.payment?.bankAccounts?.[0];

        if (!bankAccount) {
            throw new BadRequestException('No bank account found for payout. Please add one first.');
        }

        const payout = this.payoutRepository.create({
            provider,
            amount: dto.amount,
            status: PayoutStatus.PENDING,
            bankAccount,
            method: 'Bank Transfer',
        });

        return await this.payoutRepository.save(payout);
    }

    async getEarningsTrend(userId: string, query: EarningsQueryDto) {
        const provider = await this.providerProfileService.getMyProfile(userId);
        if (!provider) throw new NotFoundException('Provider profile not found');

        const dateRange = this.getDateRange(query);

        const completedContracts = await this.contractRepository.find({
            where: {
                status: ContractStatus.COMPLETED,
                provider: { id: provider.id },
                completedAt: Between(dateRange.start, dateRange.end),
            },
            order: { completedAt: 'ASC' },
        });

        const trendMap = new Map<string, number>();

        const current = new Date(dateRange.start);
        while (current <= dateRange.end) {
            const label = current.toLocaleDateString('en-US', { weekday: 'short' });
            trendMap.set(label, 0);
            current.setDate(current.getDate() + 1);
        }

        completedContracts.forEach(contract => {
            if (!contract.completedAt) return;
            const label = new Date(contract.completedAt).toLocaleDateString('en-US', { weekday: 'short' });
            const netAmount = Number(contract.price || 0) * (1 - this.PLATFORM_FEE_PERCENT);
            trendMap.set(label, (trendMap.get(label) || 0) + netAmount);
        });

        return Array.from(trendMap.entries()).map(([label, amount]) => ({
            label,
            amount: parseFloat(amount.toFixed(2)),
        }));
    }

    private getDateRange(query: EarningsQueryDto): { start: Date, end: Date } {
        const end = query.endDate ? new Date(query.endDate) : new Date();
        let start: Date;

        if (query.period === TimePeriod.CUSTOM && query.startDate) {
            start = new Date(query.startDate);
        } else if (query.period === TimePeriod.TODAY) {
            start = new Date();
            start.setHours(0, 0, 0, 0);
        } else if (query.period === TimePeriod.MONTH) {
            start = new Date();
            start.setMonth(start.getMonth() - 1);
        } else {
            start = new Date();
            const day = start.getDay();
            const diff = start.getDate() - day + (day === 0 ? -6 : 1);
            start.setDate(diff);
            start.setHours(0, 0, 0, 0);
        }

        return { start, end };
    }
}
