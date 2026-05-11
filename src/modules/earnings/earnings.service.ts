import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { OrderEntity } from '../orders/entities/order.entity';
import { PayoutEntity } from './entities/payout.entity';
import { OrderStatus } from '../orders/enums/order-status.enum';
import { PayoutStatus } from './enums/payout-status.enum';
import { ProfileService } from '../provider-profile/profile.service';
import { EarningsQueryDto, TimePeriod } from './dto/earnings-query.dto';

@Injectable()
export class EarningsService {
    private readonly PLATFORM_FEE_PERCENT = 0.10;

    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
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

        // Get all completed orders for this provider within date range
        const completedOrders = await this.orderRepository.find({
            where: {
                status: OrderStatus.COMPLETED,
                acceptedOffer: {
                    provider: { id: providerId }
                },
                updatedAt: Between(dateRange.start, dateRange.end)
            },
            relations: {
                acceptedOffer: true
            }
        });

        const grossEarnings = completedOrders.reduce((sum, order) => {
            return sum + Number(order.acceptedOffer?.price || 0);
        }, 0);

        const platformFee = grossEarnings * this.PLATFORM_FEE_PERCENT;
        const netEarnings = grossEarnings - platformFee;

        // Get payout stats
        const payouts = await this.payoutRepository.find({
            where: { provider: { id: providerId } }
        });

        const completedPayouts = payouts
            .filter(p => p.status === PayoutStatus.PAID)
            .reduce((sum, p) => sum + Number(p.amount), 0);

        const processingPayouts = payouts
            .filter(p => p.status === PayoutStatus.PROCESSING || p.status === PayoutStatus.PENDING)
            .reduce((sum, p) => sum + Number(p.amount), 0);

        const totalBalance = netEarnings - completedPayouts;
        const availableToWithdraw = netEarnings - (completedPayouts + processingPayouts);

        // Pending Balance - assuming everythig is not paid yet is pending
        const pendingBalance = availableToWithdraw;

        return {
            totalBalance,
            availableToWithdraw,
            pendingBalance,
            grossEarnings,
            platformFee,
            netEarnings,
            pendingPayout: processingPayouts,
            completedPayouts,
            currency: 'AED'
        };
    }

    async getPayoutHistory(userId: string) {
        const provider = await this.providerProfileService.getMyProfile(userId);
        if (!provider) throw new NotFoundException('Provider profile not found');

        return await this.payoutRepository.find({
            where: { provider: { id: provider.id } },
            order: { createdAt: 'DESC' },
            relations: {
                bankAccount: true
            }
        });
    }

    async getEarningsTrend(userId: string, query: EarningsQueryDto) {
        const dateRange = this.getDateRange(query);
        // In a real app, you would aggregate data by day/week/month
        // For now, returning mock data that aligns with the requested period
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map(day => ({
            label: day,
            amount: Math.floor(Math.random() * 1000) + 500
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
            // Default: This Week
            start = new Date();
            const day = start.getDay();
            const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust to start of week (Monday)
            start.setDate(diff);
            start.setHours(0, 0, 0, 0);
        }

        return { start, end };
    }
}
