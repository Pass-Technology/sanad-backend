import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindOptionsWhere, FindOptionsRelations, DataSource, Not } from 'typeorm';
import { ClientServiceRequestEntity } from '../marketplace/entities/client-service-request.entity';
import { OfferEntity } from '../marketplace/entities/offer.entity';
import { JobEntity } from '../marketplace/entities/job.entity';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';

import { RequestStatus } from '../marketplace/enums/request-status.enum';
import { OfferStatus } from '../marketplace/enums/offer-status.enum';
import { JobStatus, JOB_TRANSITIONS } from '../marketplace/enums/job-status.enum';
import { ClientService } from '../client/client.service';
import { ServiceManagementService } from '../service-management/service-management.service';
import { GetClientRequestsQueryDto } from './dto/get-client-requests-query.dto';
import { GetClientJobsQueryDto } from './dto/get-client-jobs-query.dto';

@Injectable()
export class ClientRequestsService {
    constructor(
        @InjectRepository(ClientServiceRequestEntity)
        private readonly requestRepository: Repository<ClientServiceRequestEntity>,
        @InjectRepository(OfferEntity)
        private readonly offerRepository: Repository<OfferEntity>,
        @InjectRepository(JobEntity)
        private readonly jobRepository: Repository<JobEntity>,
        private readonly clientService: ClientService,
        private readonly serviceManagement: ServiceManagementService,
        private readonly dataSource: DataSource,
    ) { }

    // ═══════════════════════════════════════════════════════
    // SERVICE REQUESTS
    // ═══════════════════════════════════════════════════════

    async createClientServiceRequest(userId: string, dto: CreateServiceRequestDto) {
        const client = await this.getClientByUserId(userId);
        const service = await this.serviceManagement.getServiceOrThrow(dto.serviceId);

        const request = this.requestRepository.create({
            client,
            service,
            status: RequestStatus.OPEN,
            description: dto.description,
            scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
            address: dto.addressId ? { id: dto.addressId } : undefined,
            isUrgent: dto.isUrgent,
            paymentMethod: dto.paymentMethod,
            budgetEstimate: dto.budgetEstimate,
            estimatedDurationMinutes: dto.estimatedDurationMinutes,
            details: dto.details,
        });

        return await this.requestRepository.save(request);
    }

    async getClientServiceRequests(userId: string, query: GetClientRequestsQueryDto) {
        const client = await this.getClientByUserId(userId);

        const where: FindOptionsWhere<ClientServiceRequestEntity> = { client: { id: client.id } };

        if (query.serviceId) where.service = { id: query.serviceId };
        if (query.status) where.status = query.status;

        return this.requestRepository.find({
            where,
            relations: {
                service: true,
                address: true,
                offers: { provider: true },
                job: true,
            },
            order: { createdAt: 'DESC' },
        });
    }

    async getClientRequestById(userId: string, requestId: string) {
        const client = await this.getClientByUserId(userId);
        const request = await this.getRequestOrThrow(requestId, {
            client: true,
            service: true,
            address: true,
            offers: { provider: true },
            job: { assignedWorker: true, provider: true },
        });

        if (request.client.id !== client.id) {
            throw new ForbiddenException('You are not authorized to view this request');
        }

        return request;
    }

    async cancelRequest(userId: string, requestId: string) {
        const client = await this.getClientByUserId(userId);
        const request = await this.getRequestOrThrow(requestId, { client: true });

        if (request.client.id !== client.id) {
            throw new ForbiddenException('You are not authorized to cancel this request');
        }

        if (request.status !== RequestStatus.OPEN && request.status !== RequestStatus.RECEIVING_OFFERS) {
            throw new BadRequestException('Request cannot be cancelled in its current status');
        }

        request.status = RequestStatus.CANCELLED;
        return await this.requestRepository.save(request);
    }

    async deleteRequest(userId: string, requestId: string) {
        const client = await this.getClientByUserId(userId);
        const request = await this.getRequestOrThrow(requestId, { client: true });

        if (request.client.id !== client.id) {
            throw new ForbiddenException('You are not authorized to delete this request');
        }

        if (request.status !== RequestStatus.OPEN && request.status !== RequestStatus.CANCELLED) {
            throw new BadRequestException('Only open or cancelled requests can be deleted');
        }

        return await this.requestRepository.softRemove(request);
    }

    // ═══════════════════════════════════════════════════════
    // ACCEPT OFFER
    // ═══════════════════════════════════════════════════════

    async acceptOffer(userId: string, offerId: string) {
        const client = await this.getClientByUserId(userId);

        return await this.dataSource.transaction(async (manager) => {
            const offer = await manager.findOne(OfferEntity, {
                where: { id: offerId },
                relations: {
                    clientServiceRequest: { client: true },
                    provider: true,
                },
            });

            if (!offer) throw new NotFoundException('Offer not found');

            if (offer.clientServiceRequest.client.id !== client.id) {
                throw new ForbiddenException('You are not authorized to accept this offer');
            }

            if (
                offer.clientServiceRequest.status !== RequestStatus.OPEN &&
                offer.clientServiceRequest.status !== RequestStatus.RECEIVING_OFFERS
            ) {
                throw new BadRequestException('Request is no longer accepting offers');
            }

            if (offer.status !== OfferStatus.PENDING) {
                throw new BadRequestException('This offer is no longer pending');
            }

            if (offer.expiresAt && new Date() > offer.expiresAt) {
                throw new BadRequestException('This offer has expired');
            }

            offer.status = OfferStatus.ACCEPTED;
            await manager.save(offer);

            await manager.update(
                OfferEntity,
                {
                    clientServiceRequest: { id: offer.clientServiceRequest.id },
                    status: OfferStatus.PENDING,
                    id: Not(offer.id),
                },
                { status: OfferStatus.REJECTED },
            );

            offer.clientServiceRequest.status = RequestStatus.MATCHED;
            await manager.save(offer.clientServiceRequest);

            const job = manager.create(JobEntity, {
                serviceRequest: offer.clientServiceRequest,
                client: offer.clientServiceRequest.client,
                provider: offer.provider,
                acceptedOffer: offer,
                finalPrice: offer.price,
                status: JobStatus.ASSIGNED,
            });

            return await manager.save(job);
        });
    }

    // ═══════════════════════════════════════════════════════
    // CLIENT JOBS
    // ═══════════════════════════════════════════════════════

    async getClientJobs(userId: string, type?: string, query?: GetClientJobsQueryDto) {
        const client = await this.getClientByUserId(userId);
        const statuses = this.resolveJobStatuses(type);

        const where: FindOptionsWhere<JobEntity> = {
            client: { id: client.id },
            status: In(statuses),
        };

        if (query?.serviceId) where.serviceRequest = { service: { id: query.serviceId } };
        if (query?.status) where.status = query.status;

        return this.jobRepository.find({
            where,
            relations: {
                serviceRequest: { service: true, address: true },
                provider: { userInfo: true },
                assignedWorker: true,
            },
            order: { updatedAt: 'DESC' },
        });
    }

    async getClientJobById(userId: string, jobId: string) {
        const client = await this.getClientByUserId(userId);
        const job = await this.getJobOrThrow(jobId, {
            serviceRequest: { service: true, address: true },
            client: true,
            provider: { userInfo: true },
            acceptedOffer: true,
            assignedWorker: true,
        });

        if (job.client.id !== client.id) {
            throw new ForbiddenException('You are not authorized to view this job');
        }

        return job;
    }

    async cancelClientJob(userId: string, jobId: string) {
        const client = await this.getClientByUserId(userId);
        const job = await this.getJobOrThrow(jobId, { client: true });

        if (job.client.id !== client.id) {
            throw new ForbiddenException('You are not authorized to cancel this job');
        }

        const allowed = JOB_TRANSITIONS[job.status];
        if (!allowed.includes(JobStatus.CANCELLED)) {
            throw new BadRequestException(`Job cannot be cancelled in its current status: ${job.status}`);
        }

        job.status = JobStatus.CANCELLED;
        return await this.jobRepository.save(job);
    }

    // ═══════════════════════════════════════════════════════
    // PRIVATE HELPERS
    // ═══════════════════════════════════════════════════════

    private resolveJobStatuses(type?: string): JobStatus[] {
        const t = type?.toLowerCase() || 'all';
        switch (t) {
            case 'all':
                return [
                    JobStatus.ASSIGNED,
                    JobStatus.PROVIDER_ON_THE_WAY,
                    JobStatus.PROVIDER_ARRIVED,
                    JobStatus.IN_PROGRESS,
                    JobStatus.COMPLETED,
                    JobStatus.CANCELLED,
                ];
            case 'active':
                return [JobStatus.PROVIDER_ON_THE_WAY, JobStatus.PROVIDER_ARRIVED, JobStatus.IN_PROGRESS];
            case 'scheduled':
                return [JobStatus.ASSIGNED];
            case 'completed':
                return [JobStatus.COMPLETED];
            case 'cancelled':
                return [JobStatus.CANCELLED];
            default:
                throw new BadRequestException(
                    `Invalid job type: ${type}. Use: all, active, scheduled, completed, cancelled`,
                );
        }
    }

    private async getClientByUserId(userId: string) {
        return await this.clientService.getProfile(userId);
    }

    private async getRequestOrThrow(id: string, relations?: FindOptionsRelations<ClientServiceRequestEntity>) {
        const request = await this.requestRepository.findOne({ where: { id }, relations });
        if (!request) throw new NotFoundException('Service request not found');
        return request;
    }

    private async getJobOrThrow(id: string, relations?: FindOptionsRelations<JobEntity>) {
        const job = await this.jobRepository.findOne({ where: { id }, relations });
        if (!job) throw new NotFoundException('Job not found');
        return job;
    }
}
