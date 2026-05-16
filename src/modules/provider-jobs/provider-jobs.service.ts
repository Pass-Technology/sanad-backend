import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindOptionsWhere, FindOptionsRelations, MoreThanOrEqual } from 'typeorm';
import { ClientServiceRequestEntity } from '../marketplace/entities/client-service-request.entity';
import { OfferEntity } from '../marketplace/entities/offer.entity';
import { JobEntity } from '../marketplace/entities/job.entity';
import { CreateProviderOfferDto } from './dto/create-provider-offer.dto';

import { RequestStatus } from '../marketplace/enums/request-status.enum';
import { OfferStatus } from '../marketplace/enums/offer-status.enum';
import { JobStatus, JOB_TRANSITIONS } from '../marketplace/enums/job-status.enum';
import { ProfileService } from '../provider-profile/profile.service';
import { AssignWorkerDto } from './dto/assign-worker.dto';
import { GetProviderJobsQueryDto } from './dto/get-provider-jobs-query.dto';
import { UpdateJobProgressDto } from './dto/update-job-progress.dto';

@Injectable()
export class ProviderJobsService {
    constructor(
        @InjectRepository(ClientServiceRequestEntity)
        private readonly requestRepository: Repository<ClientServiceRequestEntity>,
        @InjectRepository(OfferEntity)
        private readonly offerRepository: Repository<OfferEntity>,
        @InjectRepository(JobEntity)
        private readonly jobRepository: Repository<JobEntity>,
        private readonly profileService: ProfileService,
    ) { }

    // ═══════════════════════════════════════════════════════
    // AVAILABLE REQUESTS
    // ═══════════════════════════════════════════════════════

    async getAvailableRequests(userId: string, serviceId?: string, search?: string) {
        const provider = await this.getProviderByUserId(userId);
        return this.getAvailableRequestsForProvider(provider.id, serviceId, search);
    }

    async getAvailableRequestsForProvider(providerId: string, serviceId?: string, search?: string) {
        const provider = await this.profileService.getProfileById(providerId);
        if (!provider) return [];

        const serviceIds = provider.providerServices.map((ps) => ps.service.id);
        if (serviceIds.length === 0) return [];

        const qb = this.requestRepository
            .createQueryBuilder('request')
            .leftJoinAndSelect('request.service', 'service')
            .leftJoinAndSelect('request.client', 'client')
            .leftJoinAndSelect('request.address', 'address')
            .leftJoin('request.offers', 'my_offer', 'my_offer.provider_id = :providerId', { providerId })
            .leftJoin('request.rejectedByProviders', 'my_rejection', 'my_rejection.id = :providerId')
            .where('request.service_id IN (:...serviceIds)', { serviceIds })
            .andWhere('request.status IN (:...statuses)', {
                statuses: [RequestStatus.OPEN, RequestStatus.RECEIVING_OFFERS],
            })
            .andWhere('my_offer.id IS NULL')
            .andWhere('my_rejection.id IS NULL');

        if (serviceId) {
            qb.andWhere('request.service_id = :serviceId', { serviceId });
        }

        if (search) {
            qb.andWhere('(address.address ILIKE :search OR client.name ILIKE :search)', { search: `%${search}%` });
        }

        return qb.orderBy('request.createdAt', 'DESC').getMany();
    }

    async getRequestById(userId: string, requestId: string) {
        const provider = await this.getProviderByUserId(userId);
        const request = await this.getRequestOrThrow(requestId, {
            client: true,
            service: true,
            address: true,
            offers: { provider: true },
            job: { assignedWorker: true, provider: true },
        });

        const providerProfile = await this.profileService.getProfileById(provider.id);
        const providesService = providerProfile.providerServices.some(
            (ps) => ps.service.id === request.service.id,
        );

        const hasOffer = request.offers.some((o) => o.provider.id === provider.id);
        const isJobProvider = request.job?.provider?.id === provider.id;

        if (!providesService && !hasOffer && !isJobProvider) {
            throw new ForbiddenException('You are not authorized to view this request');
        }

        // Provider only sees their own offer
        request.offers = request.offers.filter((o) => o.provider.id === provider.id);

        return request;
    }

    async rejectRequest(userId: string, requestId: string) {
        const provider = await this.getProviderByUserId(userId);
        const request = await this.getRequestOrThrow(requestId, { rejectedByProviders: true });

        if (!request.rejectedByProviders.find((p) => p.id === provider.id)) {
            request.rejectedByProviders.push(provider);
            await this.requestRepository.save(request);
        }

        return { success: true };
    }

    // ═══════════════════════════════════════════════════════
    // OFFERS
    // ═══════════════════════════════════════════════════════

    async createProviderOffer(userId: string, dto: CreateProviderOfferDto) {
        const provider = await this.getProviderByUserId(userId);

        const request = await this.getRequestOrThrow(dto.clientServiceRequestId, {
            offers: { provider: true },
        });

        const existingOffer = request.offers.find((o) => o.provider.id === provider.id);
        if (existingOffer) {
            throw new BadRequestException('You have already made an offer for this request');
        }

        if (request.status !== RequestStatus.OPEN && request.status !== RequestStatus.RECEIVING_OFFERS) {
            throw new BadRequestException('This request is no longer accepting offers');
        }

        const offer = this.offerRepository.create({
            price: dto.price,
            notes: dto.notes,
            estimatedDurationMinutes: dto.estimatedDurationMinutes,
            clientServiceRequest: request,
            provider,
            status: OfferStatus.PENDING,
        });

        const savedOffer = await this.offerRepository.save(offer);

        if (request.status === RequestStatus.OPEN) {
            request.status = RequestStatus.RECEIVING_OFFERS;
            await this.requestRepository.save(request);
        }

        return savedOffer;
    }

    async withdrawOffer(userId: string, offerId: string) {
        const provider = await this.getProviderByUserId(userId);
        const offer = await this.getOfferOrThrow(offerId, { provider: true });

        if (offer.provider.id !== provider.id) {
            throw new ForbiddenException('You are not authorized to withdraw this offer');
        }

        if (offer.status !== OfferStatus.PENDING) {
            throw new BadRequestException('Only pending offers can be withdrawn');
        }

        offer.status = OfferStatus.WITHDRAWN;
        return await this.offerRepository.save(offer);
    }

    async getMyOffers(userId: string, status?: OfferStatus) {
        const provider = await this.getProviderByUserId(userId);

        const where: FindOptionsWhere<OfferEntity> = { provider: { id: provider.id } };
        if (status) where.status = status;

        return this.offerRepository.find({
            where,
            relations: { clientServiceRequest: { service: true, client: true, address: true } },
            order: { createdAt: 'DESC' },
        });
    }

    // ═══════════════════════════════════════════════════════
    // JOBS
    // ═══════════════════════════════════════════════════════

    async assignWorker(userId: string, jobId: string, dto: AssignWorkerDto) {
        const provider = await this.getProviderByUserId(userId);
        const job = await this.getJobOrThrow(jobId, { provider: true });

        if (job.provider.id !== provider.id) {
            throw new ForbiddenException('You are not authorized to assign a worker to this job');
        }

        const worker = await this.profileService.getWorkerOrThrow(dto.workerId, provider.id);
        job.assignedWorker = worker;

        return await this.jobRepository.save(job);
    }

    async updateJobStatus(userId: string, jobId: string, dto: UpdateJobProgressDto) {
        const provider = await this.getProviderByUserId(userId);
        const job = await this.getJobOrThrow(jobId, { provider: true });

        if (job.provider.id !== provider.id) {
            throw new ForbiddenException('You are not authorized to update this job');
        }

        if (dto.status) {
            const allowed = JOB_TRANSITIONS[job.status];
            if (!allowed.includes(dto.status)) {
                throw new BadRequestException(
                    `Cannot transition from ${job.status} to ${dto.status}. Allowed: ${allowed.join(', ') || 'none'}`,
                );
            }

            job.status = dto.status;

            if (dto.status === JobStatus.IN_PROGRESS && !job.startedAt) {
                job.startedAt = new Date();
            }
            if (dto.status === JobStatus.COMPLETED) {
                job.completedAt = new Date();
            }
        }

        if (dto.beforeServicePhotos) job.beforeServicePhotos = dto.beforeServicePhotos;
        if (dto.afterServicePhotos) job.afterServicePhotos = dto.afterServicePhotos;
        if (dto.customerSignature) job.customerSignature = dto.customerSignature;
        if (dto.notes) job.providerNotes = { ...(job.providerNotes || {}), notes: dto.notes };

        return await this.jobRepository.save(job);
    }

    async cancelProviderJob(userId: string, jobId: string) {
        const provider = await this.getProviderByUserId(userId);
        const job = await this.getJobOrThrow(jobId, { provider: true });

        if (job.provider.id !== provider.id) {
            throw new ForbiddenException('You are not authorized to cancel this job');
        }

        const allowed = JOB_TRANSITIONS[job.status];
        if (!allowed.includes(JobStatus.CANCELLED)) {
            throw new BadRequestException(`Job cannot be cancelled in its current status: ${job.status}`);
        }

        job.status = JobStatus.CANCELLED;
        return await this.jobRepository.save(job);
    }

    async getProviderJobs(userId: string, type: string, query: GetProviderJobsQueryDto) {
        const provider = await this.getProviderByUserId(userId);
        const statuses = this.resolveJobStatuses(type);

        const qb = this.jobRepository.createQueryBuilder('job')
            .leftJoinAndSelect('job.serviceRequest', 'serviceRequest')
            .leftJoinAndSelect('serviceRequest.service', 'service')
            .leftJoinAndSelect('serviceRequest.address', 'address')
            .leftJoinAndSelect('job.client', 'client')
            .leftJoinAndSelect('job.assignedWorker', 'assignedWorker')
            .where('job.provider_id = :providerId', { providerId: provider.id })
            .andWhere('job.status IN (:...statuses)', { statuses });

        if (query.serviceId) {
            qb.andWhere('service.id = :serviceId', { serviceId: query.serviceId });
        }

        if (query.status) {
            qb.andWhere('job.status = :status', { status: query.status });
        }

        if (query.search) {
            qb.andWhere('(address.address ILIKE :search OR client.name ILIKE :search)', { search: `%${query.search}%` });
        }

        return qb.orderBy('job.updatedAt', 'DESC').getMany();
    }

    async getProviderJobById(userId: string, jobId: string) {
        const provider = await this.getProviderByUserId(userId);
        const job = await this.getJobOrThrow(jobId, {
            serviceRequest: { service: true, address: true },
            client: true,
            provider: true,
            acceptedOffer: true,
            assignedWorker: true,
        });

        if (job.provider.id !== provider.id) {
            throw new ForbiddenException('You are not authorized to view this job');
        }

        return job;
    }

    // ═══════════════════════════════════════════════════════
    // DASHBOARD
    // ═══════════════════════════════════════════════════════

    async getProviderDashboardStats(userId: string) {
        const provider = await this.getProviderByUserId(userId);

        const availableRequestsCount = (await this.getAvailableRequestsForProvider(provider.id)).length;

        const activeJobsCount = await this.jobRepository.count({
            where: {
                provider: { id: provider.id },
                status: In([JobStatus.ASSIGNED, JobStatus.PROVIDER_ON_THE_WAY, JobStatus.PROVIDER_ARRIVED, JobStatus.IN_PROGRESS]),
            },
        });

        const completedJobsCount = await this.jobRepository.count({
            where: { provider: { id: provider.id }, status: JobStatus.COMPLETED },
        });

        const cancelledJobsCount = await this.jobRepository.count({
            where: { provider: { id: provider.id }, status: JobStatus.CANCELLED },
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const completedTodayCount = await this.jobRepository.count({
            where: {
                provider: { id: provider.id },
                status: JobStatus.COMPLETED,
                completedAt: MoreThanOrEqual(today),
            },
        });

        const earningsTodayResult = await this.jobRepository
            .createQueryBuilder('job')
            .select('SUM(job.finalPrice)', 'total')
            .where('job.provider_id = :providerId', { providerId: provider.id })
            .andWhere('job.status = :status', { status: JobStatus.COMPLETED })
            .andWhere('job.completedAt >= :today', { today })
            .getRawOne();

        return {
            availableRequests: availableRequestsCount,
            activeJobs: activeJobsCount,
            completedJobs: completedJobsCount,
            completedToday: completedTodayCount,
            cancelledJobs: cancelledJobsCount,
            earningsToday: parseFloat(earningsTodayResult?.total || 0),
        };
    }

    async getProviderWorkers(userId: string) {
        const provider = await this.getProviderByUserId(userId);
        return this.profileService.getWorkersByProvider(provider.id);
    }

    // ═══════════════════════════════════════════════════════
    // PRIVATE HELPERS
    // ═══════════════════════════════════════════════════════

    private resolveJobStatuses(type: string): JobStatus[] {
        switch (type) {
            case 'active':
                return [JobStatus.ASSIGNED, JobStatus.PROVIDER_ON_THE_WAY, JobStatus.PROVIDER_ARRIVED, JobStatus.IN_PROGRESS];
            case 'completed':
                return [JobStatus.COMPLETED];
            case 'cancelled':
                return [JobStatus.CANCELLED];
            default:
                throw new BadRequestException(`Invalid job type: ${type}. Use: active, completed, cancelled`);
        }
    }

    private async getProviderByUserId(userId: string) {
        return await this.profileService.getMyProfile(userId);
    }

    private async getRequestOrThrow(id: string, relations?: FindOptionsRelations<ClientServiceRequestEntity>) {
        const request = await this.requestRepository.findOne({ where: { id }, relations });
        if (!request) throw new NotFoundException('Service request not found');
        return request;
    }

    private async getOfferOrThrow(id: string, relations?: FindOptionsRelations<OfferEntity>) {
        const offer = await this.offerRepository.findOne({ where: { id }, relations });
        if (!offer) throw new NotFoundException('Offer not found');
        return offer;
    }

    private async getJobOrThrow(id: string, relations?: FindOptionsRelations<JobEntity>) {
        const job = await this.jobRepository.findOne({ where: { id }, relations });
        if (!job) throw new NotFoundException('Job not found');
        return job;
    }
}
