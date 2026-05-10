import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In, ILike, FindOptionsWhere, FindOptionsRelations, DataSource } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { OfferEntity } from './entities/offer.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOfferDto } from './dto/create-offer.dto';
import { GetOrdersQueryDto } from './dto/get-orders-query.dto';
import { OrderStatus, OfferStatus } from './enums/order-status.enum';
import { ClientService } from '../client/client.service';
import { ProfileService } from '../provider-profile/profile.service';
import { ServiceManagementService } from '../service-management/service-management.service';
import { ProviderWorkerEntity } from '../provider-profile/entities/provider-worker.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
        @InjectRepository(OfferEntity)
        private readonly offerRepository: Repository<OfferEntity>,
        private readonly clientService: ClientService,
        private readonly profileService: ProfileService,
        private readonly serviceManagement: ServiceManagementService,
        private readonly dataSource: DataSource,
    ) { }

    async createOrder(userId: string, createOrderDto: CreateOrderDto) {
        const client = await this.getClientByUserId(userId);
        const service = await this.getServiceById(createOrderDto.serviceId);

        const order = this.orderRepository.create({
            ...createOrderDto,
            client,
            service,
            status: OrderStatus.PENDING,
        });

        return await this.orderRepository.save(order);
    }

    async createOffer(userId: string, createOfferDto: CreateOfferDto) {
        const provider = await this.getProviderByUserId(userId);

        const order = await this.getOrderOrThrow(createOfferDto.orderId, {
            offers: {
                provider: true
            }
        });

        const existingOffer = order.offers.find(o => o.provider.id === provider.id);
        if (existingOffer) {
            throw new BadRequestException('You have already made an offer for this order');
        }

        let worker: ProviderWorkerEntity | undefined;
        if (createOfferDto.workerId) {
            worker = await this.profileService.getWorkerOrThrow(createOfferDto.workerId, provider.id);
        }

        const offer = this.offerRepository.create({
            price: createOfferDto.price,
            notes: createOfferDto.notes,
            order,
            provider,
            worker,
            status: OfferStatus.PENDING,
        });

        const savedOffer = await this.offerRepository.save(offer);

        if (order.status === OrderStatus.PENDING) {
            order.status = OrderStatus.SEARCHING;
            await this.orderRepository.save(order);
        }

        return savedOffer;
    }

    async acceptOffer(userId: string, offerId: string) {
        const client = await this.getClientByUserId(userId);

        return await this.dataSource.transaction(async (manager) => {
            const offer = await manager.findOne(OfferEntity, {
                where: { id: offerId },
                relations: {
                    order: {
                        client: true
                    }
                }
            });

            if (!offer) {
                throw new NotFoundException('Offer not found');
            }

            if (offer.order.client.id !== client.id) {
                throw new ForbiddenException('You are not authorized to accept this offer');
            }

            if (offer.order.status !== OrderStatus.PENDING && offer.order.status !== OrderStatus.SEARCHING) {
                throw new BadRequestException('Order is no longer accepting offers');
            }

            offer.status = OfferStatus.ACCEPTED;
            offer.order.acceptedOffer = offer;
            offer.order.status = OrderStatus.ACCEPTED;

            await manager.save(offer);
            await manager.save(offer.order);

            await manager.update(
                OfferEntity,
                { order: { id: offer.order.id }, status: OfferStatus.PENDING, id: Not(offer.id) },
                { status: OfferStatus.REJECTED }
            );

            return offer;
        });
    }

    async cancelOrder(userId: string, orderId: string) {
        const client = await this.getClientByUserId(userId);
        const order = await this.getOrderOrThrow(orderId, { client: true });

        if (order.client.id !== client.id) {
            throw new ForbiddenException('You are not authorized to cancel this order');
        }

        if (order.status === OrderStatus.COMPLETED || order.status === OrderStatus.CANCELLED) {
            throw new BadRequestException('Order cannot be cancelled in its current status');
        }

        order.status = OrderStatus.CANCELLED;
        return await this.orderRepository.save(order);
    }

    async deleteOrder(userId: string, orderId: string) {
        const client = await this.getClientByUserId(userId);
        const order = await this.getOrderOrThrow(orderId, { client: true });

        if (order.client.id !== client.id) {
            throw new ForbiddenException('You are not authorized to delete this order');
        }

        if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.CANCELLED) {
            throw new BadRequestException('Only pending or cancelled orders can be deleted');
        }

        return await this.orderRepository.softRemove(order);
    }

    async getOrdersForClient(userId: string, query: GetOrdersQueryDto) {
        const client = await this.getClientByUserId(userId);

        const { serviceId, status, search } = query;
        const where: FindOptionsWhere<OrderEntity> = { client: { id: client.id } };

        if (serviceId) where.service = { id: serviceId };
        if (status) where.status = status;
        if (search) where.address = ILike(`%${search}%`);

        return this.orderRepository.find({
            where,
            relations: {
                service: true,
                offers: {
                    provider: true
                },
                acceptedOffer: {
                    provider: true
                }
            },
            order: { createdAt: 'DESC' }
        });
    }

    async getAvailableOrdersForProvider(userId: string, query: GetOrdersQueryDto) {
        const provider = await this.getProviderByUserId(userId);
        return this.getAvailableOrdersForProviderById(provider.id, query);
    }

    private async getAvailableOrdersForProviderById(providerId: string, query?: GetOrdersQueryDto) {
        const provider = await this.profileService.getProfileById(providerId);
        if (!provider) return [];

        const serviceIds = provider.providerServices.map(ps => ps.service.id);
        if (serviceIds.length === 0) return [];

        const { serviceId, search } = query || {};

        const qb = this.orderRepository.createQueryBuilder('order')
            .leftJoinAndSelect('order.service', 'service')
            .leftJoinAndSelect('order.client', 'client')
            .leftJoin('order.offers', 'my_offer', 'my_offer.provider_id = :providerId', { providerId })
            .leftJoin('order.rejectedByProviders', 'my_rejection', 'my_rejection.id = :providerId')
            .where('order.service_id IN (:...serviceIds)', { serviceIds })
            .andWhere('order.status IN (:...statuses)', { statuses: [OrderStatus.PENDING, OrderStatus.SEARCHING] })
            .andWhere('my_offer.id IS NULL')
            .andWhere('my_rejection.id IS NULL');

        if (serviceId) {
            qb.andWhere('order.service_id = :serviceId', { serviceId });
        }

        if (search) {
            qb.andWhere('order.address ILIKE :search', { search: `%${search}%` });
        }

        return qb.orderBy('order.createdAt', 'DESC').getMany();
    }

    async getProviderDashboardStats(userId: string) {
        const provider = await this.getProviderByUserId(userId);

        const availableOrdersCount = (await this.getAvailableOrdersForProviderById(provider.id)).length;

        const activeJobsCount = await this.orderRepository.count({
            where: {
                acceptedOffer: { provider: { id: provider.id } },
                status: In([OrderStatus.ACCEPTED, OrderStatus.IN_PROGRESS])
            }
        });

        const completedJobsCount = await this.orderRepository.count({
            where: {
                acceptedOffer: { provider: { id: provider.id } },
                status: OrderStatus.COMPLETED
            }
        });

        const cancelledJobsCount = await this.orderRepository.count({
            where: {
                acceptedOffer: { provider: { id: provider.id } },
                status: OrderStatus.CANCELLED
            }
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const earningsTodayResult = await this.offerRepository
            .createQueryBuilder('offer')
            .leftJoin('offer.order', 'order')
            .select('SUM(offer.price)', 'total')
            .where('offer.provider_id = :providerId', { providerId: provider.id })
            .andWhere('order.status = :status', { status: OrderStatus.COMPLETED })
            .andWhere('order.updatedAt >= :today', { today })
            .getRawOne();

        return {
            availableOrders: availableOrdersCount,
            activeJobs: activeJobsCount,
            completedJobs: completedJobsCount,
            cancelledJobs: cancelledJobsCount,
            earningsToday: parseFloat(earningsTodayResult.total || 0)
        };
    }

    async getProviderJobs(userId: string, type: string, query: GetOrdersQueryDto) {
        const provider = await this.getProviderByUserId(userId);

        if (type === 'available') {
            return this.getAvailableOrdersForProviderById(provider.id, query);
        }

        const { serviceId, status, search } = query;
        let statuses: OrderStatus[] = [];
        if (type === 'active') statuses = [OrderStatus.ACCEPTED, OrderStatus.IN_PROGRESS];
        else if (type === 'completed') statuses = [OrderStatus.COMPLETED];
        else if (type === 'cancelled') statuses = [OrderStatus.CANCELLED];
        else throw new BadRequestException('Invalid job type');

        const where: FindOptionsWhere<OrderEntity> = {
            acceptedOffer: { provider: { id: provider.id } },
            status: In(statuses)
        };

        if (serviceId) where.service = { id: serviceId };
        if (status) where.status = status;
        if (search) where.address = ILike(`%${search}%`);

        return this.orderRepository.find({
            where,
            relations: {
                service: true,
                client: true,
                acceptedOffer: {
                    worker: true
                }
            },
            order: { updatedAt: 'DESC' }
        });
    }

    async rejectOrder(userId: string, orderId: string) {
        const provider = await this.getProviderByUserId(userId);

        const order = await this.getOrderOrThrow(orderId, {
            rejectedByProviders: true
        });

        if (!order.rejectedByProviders.find(p => p.id === provider.id)) {
            order.rejectedByProviders.push(provider);
            await this.orderRepository.save(order);
        }

        return { success: true };
    }

    async updateJobStatus(userId: string, orderId: string, status: OrderStatus) {
        const provider = await this.getProviderByUserId(userId);

        const order = await this.getOrderOrThrow(orderId, {
            acceptedOffer: {
                provider: true
            }
        });

        if (!order || !order.acceptedOffer || order.acceptedOffer.provider.id !== provider.id) {
            throw new ForbiddenException('You are not authorized to update this job');
        }

        order.status = status;
        return await this.orderRepository.save(order);
    }

    async getProviderWorkers(userId: string) {
        const provider = await this.getProviderByUserId(userId);

        return this.profileService.getWorkersByProvider(provider.id);
    }

    async getOrderById(orderId: string) {
        return await this.getOrderOrThrow(orderId, {
            client: true,
            service: true,
            offers: {
                provider: true
            },
            acceptedOffer: {
                provider: true
            }
        });
    }

    private async getClientByUserId(userId: string) {
        return await this.clientService.getProfile(userId);
    }

    private async getProviderByUserId(userId: string) {
        return await this.profileService.getMyProfile(userId);
    }

    private async getServiceById(id: string) {
        return await this.serviceManagement.getServiceOrThrow(id);
    }

    private async getOrderOrThrow(id: string, relations?: FindOptionsRelations<OrderEntity>) {
        const order = await this.orderRepository.findOne({ where: { id }, relations });
        if (!order) throw new NotFoundException('Order not found');
        return order;
    }

    private async getOfferOrThrow(id: string, relations?: FindOptionsRelations<OfferEntity>) {
        const offer = await this.offerRepository.findOne({ where: { id }, relations });
        if (!offer) throw new NotFoundException('Offer not found');
        return offer;
    }
}
