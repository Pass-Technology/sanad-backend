import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In, Between, DataSource } from 'typeorm';
import { JobEntity } from './entities/job.entity';
import { OfferEntity } from './entities/offer.entity';
import { ContractEntity } from './entities/contract.entity';
import { ReviewEntity } from './entities/review.entity';
import { ProviderJobDismissalEntity } from './entities/provider-job-dismissal.entity';
import { ClientAddressEntity } from '../client/entity/client-address.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { AssignWorkerDto } from './dto/assign-worker.dto';
import { GetProviderRequestsQueryDto } from './dto/get-provider-requests-query.dto';
import { JobStatus } from './enums/job-status.enum';
import { OfferStatus } from './enums/offer-status.enum';
import { ContractStatus } from './enums/contract-status.enum';
import { ProviderRequestTab } from './enums/provider-request-tab.enum';
import { ProviderArchivedRequestItem } from './types/provider-archived-request.type';
import { ClientService } from '../client/client.service';
import { ProfileService } from '../provider-profile/profile.service';
import { WorkerService } from '../worker/worker.service';

@Injectable()
export class JobsService {
    constructor(
        @InjectRepository(JobEntity)
        private readonly jobRepository: Repository<JobEntity>,
        @InjectRepository(OfferEntity)
        private readonly offerRepository: Repository<OfferEntity>,
        @InjectRepository(ContractEntity)
        private readonly contractRepository: Repository<ContractEntity>,
        @InjectRepository(ReviewEntity)
        private readonly reviewRepository: Repository<ReviewEntity>,
        @InjectRepository(ProviderJobDismissalEntity)
        private readonly dismissalRepository: Repository<ProviderJobDismissalEntity>,
        @InjectRepository(ClientAddressEntity)
        private readonly clientAddressRepository: Repository<ClientAddressEntity>,
        private readonly clientService: ClientService,
        private readonly profileService: ProfileService,
        private readonly workerService: WorkerService,
        private readonly dataSource: DataSource,
    ) {}

    async createJob(clientUserId: string, dto: CreateJobDto): Promise<JobEntity> {
        const client = await this.clientService.getProfile(clientUserId);
        let clientAddress: ClientAddressEntity | null = null;

        if (dto.clientAddressId) {
            clientAddress = await this.clientAddressRepository.findOne({
                where: { id: dto.clientAddressId, client: { id: client.id } },
            });
            if (!clientAddress) {
                throw new BadRequestException('Invalid client address');
            }
        }

        const job = this.jobRepository.create({
            title: dto.title,
            description: dto.description,
            budget: dto.budget,
            isUrgent: dto.isUrgent ?? false,
            category: dto.category,
            location: dto.location ?? clientAddress?.label,
            serviceAddress: dto.serviceAddress ?? clientAddress?.address,
            requestedScheduledAt: dto.requestedScheduledAt ? new Date(dto.requestedScheduledAt) : null,
            client,
            clientAddress,
            status: JobStatus.OPEN,
        });

        return await this.jobRepository.save(job);
    }

    async getOpenJobsForProvider(providerUserId: string): Promise<JobEntity[]> {
        const provider = await this.profileService.getMyProfile(providerUserId);
        const dismissed = await this.dismissalRepository.find({
            where: { provider: { id: provider.id } },
            select: { job: { id: true } },
            relations: { job: true },
        });
        const dismissedJobIds = dismissed.map((d) => d.job.id);

        const existingOffers = await this.offerRepository.find({
            where: {
                provider: { id: provider.id },
                status: In([OfferStatus.PENDING, OfferStatus.ACCEPTED]),
            },
            relations: { job: true },
        });
        const excludedJobIds = [
            ...dismissedJobIds,
            ...existingOffers.map((o) => o.job.id),
        ];

        const qb = this.jobRepository
            .createQueryBuilder('job')
            .leftJoinAndSelect('job.client', 'client')
            .leftJoinAndSelect('client.user', 'user')
            .leftJoinAndSelect('job.clientAddress', 'clientAddress')
            .where('job.status = :status', { status: JobStatus.OPEN });

        if (excludedJobIds.length) {
            qb.andWhere('job.id NOT IN (:...excludedJobIds)', { excludedJobIds });
        }

        return qb.orderBy('job.createdAt', 'DESC').getMany();
    }

    async getOpenJobForProvider(providerUserId: string, jobId: string): Promise<JobEntity> {
        const provider = await this.profileService.getMyProfile(providerUserId);
        const job = await this.getJobById(jobId);

        if (job.status !== JobStatus.OPEN) {
            throw new NotFoundException('Job not found');
        }

        const dismissed = await this.dismissalRepository.findOne({
            where: { provider: { id: provider.id }, job: { id: jobId } },
        });

        if (dismissed) {
            throw new NotFoundException('Job not found');
        }

        return job;
    }

    async dismissJob(providerUserId: string, jobId: string): Promise<{ message: string }> {
        const provider = await this.profileService.getMyProfile(providerUserId);
        const job = await this.getJobById(jobId);

        if (job.status !== JobStatus.OPEN) {
            throw new BadRequestException('Only open jobs can be dismissed');
        }

        const existing = await this.dismissalRepository.findOne({
            where: { provider: { id: provider.id }, job: { id: jobId } },
        });

        if (!existing) {
            await this.dismissalRepository.save(
                this.dismissalRepository.create({ provider, job }),
            );
        }

        return { message: 'Request dismissed successfully' };
    }

    async getProviderRequests(providerUserId: string, query: GetProviderRequestsQueryDto) {
        const tab = query.tab ?? ProviderRequestTab.NEW;

        switch (tab) {
            case ProviderRequestTab.NEW:
                return this.filterJobs(await this.getOpenJobsForProvider(providerUserId), query);
            case ProviderRequestTab.AWAITING:
                return this.filterOffers(await this.getMyOffers(providerUserId, OfferStatus.PENDING), query);
            case ProviderRequestTab.SCHEDULED:
                return this.filterContracts(
                    await this.getProviderContracts(providerUserId, [ContractStatus.ACTIVE]),
                    query,
                );
            case ProviderRequestTab.IN_PROGRESS:
                return this.filterContracts(
                    await this.getProviderContracts(providerUserId, [
                        ContractStatus.IN_PROGRESS,
                        ContractStatus.PROVIDER_COMPLETED,
                    ]),
                    query,
                );
            case ProviderRequestTab.COMPLETED:
                return this.filterContracts(
                    await this.getProviderContracts(providerUserId, [ContractStatus.COMPLETED]),
                    query,
                );
            case ProviderRequestTab.ARCHIVED:
                return this.getArchivedProviderRequests(providerUserId, query);
            default:
                return [];
        }
    }

    private async getArchivedProviderRequests(
        providerUserId: string,
        query: GetProviderRequestsQueryDto,
    ): Promise<ProviderArchivedRequestItem[]> {
        const withdrawnOffers = this.filterOffers(
            await this.getMyOffers(providerUserId, OfferStatus.WITHDRAWN),
            query,
        );
        const cancelledContracts = this.filterContracts(
            await this.getProviderContracts(providerUserId, [ContractStatus.CANCELLED]),
            query,
        );

        return [
            ...withdrawnOffers.map((item) => ({ kind: 'withdrawn_offer' as const, item })),
            ...cancelledContracts.map((item) => ({ kind: 'cancelled_contract' as const, item })),
        ].sort((a, b) => b.item.updatedAt.getTime() - a.item.updatedAt.getTime());
    }

    async getClientJobs(clientUserId: string, status?: JobStatus): Promise<JobEntity[]> {
        const client = await this.clientService.getProfile(clientUserId);
        const where: { client: { id: string }; status?: JobStatus } = { client: { id: client.id } };
        if (status) where.status = status;

        return await this.jobRepository.find({
            where,
            relations: { offers: { provider: true } },
            order: { createdAt: 'DESC' },
        });
    }

    async getJobById(id: string): Promise<JobEntity> {
        const job = await this.jobRepository.findOne({
            where: { id },
            relations: {
                client: { user: true },
                clientAddress: true,
                offers: { provider: { user: true }, assignedWorker: { user: true } },
            },
        });

        if (!job) {
            throw new NotFoundException('Job not found');
        }

        return job;
    }

    async getClientJobById(clientUserId: string, jobId: string): Promise<JobEntity> {
        const client = await this.clientService.getProfile(clientUserId);
        const job = await this.getJobById(jobId);

        if (job.client.id !== client.id) {
            throw new ForbiddenException('You are not authorized to view this job');
        }

        return job;
    }

    async cancelJob(clientUserId: string, jobId: string): Promise<JobEntity> {
        const client = await this.clientService.getProfile(clientUserId);
        const job = await this.getJobById(jobId);

        if (job.client.id !== client.id) {
            throw new ForbiddenException('You are not authorized to cancel this job');
        }

        if (job.status !== JobStatus.OPEN) {
            throw new BadRequestException('Only open jobs can be cancelled');
        }

        job.status = JobStatus.CANCELLED;
        return await this.jobRepository.save(job);
    }

    async submitOffer(providerUserId: string, dto: CreateOfferDto): Promise<OfferEntity> {
        const provider = await this.profileService.getMyProfile(providerUserId);
        const job = await this.getJobById(dto.jobId);

        if (job.status !== JobStatus.OPEN) {
            throw new BadRequestException('Job is no longer open for offers');
        }

        if (dto.assignSelf && dto.workerId) {
            throw new BadRequestException('Provide either workerId or assignSelf, not both');
        }

        const existing = await this.offerRepository.findOne({
            where: {
                job: { id: dto.jobId },
                provider: { id: provider.id },
                status: In([OfferStatus.PENDING, OfferStatus.ACCEPTED]),
            },
        });
        if (existing) {
            throw new BadRequestException('You have already submitted an offer for this job');
        }

        const usesRequestedSchedule = dto.usesRequestedSchedule ?? true;
        const scheduledAt = this.resolveOfferSchedule(job, usesRequestedSchedule, dto.proposedScheduledAt);
        const assignedWorker = await this.resolveWorkerAssignment(
            provider.id,
            { workerId: dto.workerId, assignSelf: dto.assignSelf },
            scheduledAt,
        );

        const offer = this.offerRepository.create({
            price: dto.price,
            notes: dto.notes,
            estimatedDuration: dto.estimatedDuration,
            usesRequestedSchedule,
            proposedScheduledAt: scheduledAt,
            assignedWorker,
            job,
            provider,
            status: OfferStatus.PENDING,
        });

        return await this.offerRepository.save(offer);
    }

    async updateOffer(providerUserId: string, offerId: string, dto: UpdateOfferDto): Promise<OfferEntity> {
        const provider = await this.profileService.getMyProfile(providerUserId);
        const offer = await this.offerRepository.findOne({
            where: { id: offerId },
            relations: { provider: true, job: true, assignedWorker: true },
        });

        if (!offer) {
            throw new NotFoundException('Offer not found');
        }

        if (offer.provider.id !== provider.id) {
            throw new ForbiddenException('You are not authorized to update this offer');
        }

        if (offer.status !== OfferStatus.PENDING) {
            throw new BadRequestException('Only pending offers can be updated');
        }

        if (dto.price !== undefined) offer.price = dto.price;
        if (dto.notes !== undefined) offer.notes = dto.notes;
        if (dto.estimatedDuration !== undefined) offer.estimatedDuration = dto.estimatedDuration;

        const usesRequestedSchedule = dto.usesRequestedSchedule ?? offer.usesRequestedSchedule;
        offer.usesRequestedSchedule = usesRequestedSchedule;

        const proposedAt = dto.proposedScheduledAt ?? offer.proposedScheduledAt?.toISOString();
        offer.proposedScheduledAt = this.resolveOfferSchedule(offer.job, usesRequestedSchedule, proposedAt);

        if (dto.assignSelf && dto.workerId) {
            throw new BadRequestException('Provide either workerId or assignSelf, not both');
        }

        if (dto.assignSelf) {
            offer.assignedWorker = await this.resolveWorkerAssignment(
                provider.id,
                { assignSelf: true },
                offer.proposedScheduledAt,
                offer.id,
            );
        } else if (dto.workerId !== undefined) {
            offer.assignedWorker = dto.workerId
                ? await this.resolveWorkerAssignment(
                      provider.id,
                      { workerId: dto.workerId },
                      offer.proposedScheduledAt,
                      offer.id,
                  )
                : null;
        } else if (offer.assignedWorker && offer.proposedScheduledAt) {
            await this.assertWorkerAvailable(offer.assignedWorker.id, offer.proposedScheduledAt, offer.id);
        }

        return await this.offerRepository.save(offer);
    }

    async getProviderOfferById(providerUserId: string, offerId: string): Promise<OfferEntity> {
        const provider = await this.profileService.getMyProfile(providerUserId);
        const offer = await this.offerRepository.findOne({
            where: { id: offerId },
            relations: {
                job: { client: { user: true }, clientAddress: true },
                provider: true,
                assignedWorker: { user: true },
            },
        });

        if (!offer) {
            throw new NotFoundException('Offer not found');
        }

        if (offer.provider.id !== provider.id) {
            throw new ForbiddenException('You are not authorized to view this offer');
        }

        return offer;
    }

    async acceptOffer(clientUserId: string, offerId: string): Promise<ContractEntity> {
        const client = await this.clientService.getProfile(clientUserId);

        const offer = await this.offerRepository.findOne({
            where: { id: offerId },
            relations: { job: { client: true }, provider: true, assignedWorker: true },
        });

        if (!offer) {
            throw new NotFoundException('Offer not found');
        }

        if (offer.job.client.id !== client.id) {
            throw new ForbiddenException('Only the job poster can accept offers');
        }

        if (offer.status !== OfferStatus.PENDING) {
            throw new BadRequestException('Offer is no longer pending');
        }

        return this.dataSource.transaction(async (manager) => {
            const jobRepo = manager.getRepository(JobEntity);
            const offerRepo = manager.getRepository(OfferEntity);
            const contractRepo = manager.getRepository(ContractEntity);

            const job = await jobRepo.findOne({
                where: { id: offer.job.id },
                lock: { mode: 'pessimistic_write' },
            });

            if (!job || job.status !== JobStatus.OPEN) {
                throw new BadRequestException('Job is already assigned or completed');
            }

            const pendingOffer = await offerRepo.findOne({ where: { id: offerId } });
            if (!pendingOffer || pendingOffer.status !== OfferStatus.PENDING) {
                throw new BadRequestException('Offer is no longer pending');
            }

            pendingOffer.status = OfferStatus.ACCEPTED;
            await offerRepo.save(pendingOffer);

            await offerRepo.update(
                { job: { id: job.id }, status: OfferStatus.PENDING, id: Not(offerId) },
                { status: OfferStatus.REJECTED },
            );

            job.status = JobStatus.CONTRACTED;
            await jobRepo.save(job);

            const contract = contractRepo.create({
                price: pendingOffer.price,
                status: ContractStatus.ACTIVE,
                scheduledAt: pendingOffer.proposedScheduledAt,
                job,
                acceptedOffer: pendingOffer,
                client: offer.job.client,
                provider: offer.provider,
                assignedWorker: offer.assignedWorker,
            });

            return contractRepo.save(contract);
        });
    }

    async getMyOffers(providerUserId: string, status?: OfferStatus): Promise<OfferEntity[]> {
        const provider = await this.profileService.getMyProfile(providerUserId);

        const where: { provider: { id: string }; status?: OfferStatus } = { provider: { id: provider.id } };
        if (status) where.status = status;

        return await this.offerRepository.find({
            where,
            relations: {
                job: { client: { user: true }, clientAddress: true },
                assignedWorker: { user: true },
            },
            order: { createdAt: 'DESC' },
        });
    }

    async withdrawOffer(providerUserId: string, offerId: string): Promise<OfferEntity> {
        const provider = await this.profileService.getMyProfile(providerUserId);
        const offer = await this.offerRepository.findOne({
            where: { id: offerId },
            relations: { provider: true },
        });

        if (!offer) {
            throw new NotFoundException('Offer not found');
        }

        if (offer.provider.id !== provider.id) {
            throw new ForbiddenException('You are not authorized to withdraw this offer');
        }

        if (offer.status !== OfferStatus.PENDING) {
            throw new BadRequestException('Only pending offers can be withdrawn');
        }

        offer.status = OfferStatus.WITHDRAWN;
        return await this.offerRepository.save(offer);
    }

    async getWorkerAvailability(
        providerUserId: string,
        jobId: string,
        scheduledAtOverride?: string,
    ) {
        const provider = await this.profileService.getMyProfile(providerUserId);
        const job = await this.getJobById(jobId);
        const scheduledAt = scheduledAtOverride
            ? new Date(scheduledAtOverride)
            : job.requestedScheduledAt;

        if (!scheduledAt) {
            throw new BadRequestException('A schedule is required to check worker availability');
        }

        const workers = await this.workerService.getWorkersByProvider(provider.id);

        return Promise.all(
            workers.map(async (worker) => {
                const available = await this.isWorkerAvailable(worker.id, scheduledAt);
                return {
                    workerId: worker.id,
                    name: worker.name,
                    available,
                    status: available ? 'available' : 'booked',
                    message: available
                        ? 'Available at requested time'
                        : 'Already booked at requested time',
                };
            }),
        );
    }

    async getProviderContracts(providerUserId: string, statuses: ContractStatus[]): Promise<ContractEntity[]> {
        const provider = await this.profileService.getMyProfile(providerUserId);

        return await this.contractRepository.find({
            where: { provider: { id: provider.id }, status: In(statuses) },
            relations: {
                job: { clientAddress: true },
                client: { user: true },
                assignedWorker: { user: true },
                acceptedOffer: true,
            },
            order: { updatedAt: 'DESC' },
        });
    }

    async getClientContracts(clientUserId: string, statuses: ContractStatus[]): Promise<ContractEntity[]> {
        const client = await this.clientService.getProfile(clientUserId);

        return await this.contractRepository.find({
            where: { client: { id: client.id }, status: In(statuses) },
            relations: {
                job: true,
                provider: { user: true },
                assignedWorker: { user: true },
                acceptedOffer: true,
            },
            order: { updatedAt: 'DESC' },
        });
    }

    async getWorkerContracts(workerUserId: string, statuses: ContractStatus[]): Promise<ContractEntity[]> {
        const worker = await this.workerService.getProfile(workerUserId);

        return await this.contractRepository.find({
            where: { assignedWorker: { id: worker.id }, status: In(statuses) },
            relations: {
                job: true,
                client: { user: true },
                provider: { user: true },
                acceptedOffer: true,
            },
            order: { updatedAt: 'DESC' },
        });
    }

    async getContractById(id: string, userId: string): Promise<ContractEntity> {
        const contract = await this.contractRepository.findOne({
            where: { id },
            relations: {
                client: { user: true, addresses: true },
                provider: { user: true },
                assignedWorker: { user: true },
                job: { clientAddress: true },
                acceptedOffer: { assignedWorker: { user: true } },
                reviews: { reviewer: true, reviewee: true },
            },
        });

        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        const isClient = contract.client.user.id === userId;
        const isProvider = contract.provider.user.id === userId;
        const isWorker = contract.assignedWorker?.user?.id === userId;

        if (!isClient && !isProvider && !isWorker) {
            throw new ForbiddenException('You are not authorized to view this contract');
        }

        return contract;
    }

    async assignWorker(providerUserId: string, contractId: string, dto: AssignWorkerDto): Promise<ContractEntity> {
        const provider = await this.profileService.getMyProfile(providerUserId);
        const contract = await this.contractRepository.findOne({
            where: { id: contractId },
            relations: { provider: true },
        });

        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        if (contract.provider.id !== provider.id) {
            throw new ForbiddenException('Only the assigned provider can assign a worker');
        }

        if (contract.status !== ContractStatus.ACTIVE) {
            throw new BadRequestException('Workers can only be assigned to ACTIVE contracts');
        }

        if (!dto.assignSelf && !dto.workerId) {
            throw new BadRequestException('Either workerId or assignSelf must be provided');
        }

        if (dto.assignSelf && dto.workerId) {
            throw new BadRequestException('Provide either workerId or assignSelf, not both');
        }

        const worker = await this.resolveWorkerAssignment(
            provider.id,
            { workerId: dto.workerId, assignSelf: dto.assignSelf },
            contract.scheduledAt,
            undefined,
            contract.id,
        );
        contract.assignedWorker = worker;
        return await this.contractRepository.save(contract);
    }

    async startContract(userId: string, contractId: string): Promise<ContractEntity> {
        const contract = await this.contractRepository.findOne({
            where: { id: contractId },
            relations: {
                provider: { user: true },
                assignedWorker: { user: true },
            },
        });

        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        const isProvider = contract.provider.user.id === userId;
        const isWorker = contract.assignedWorker?.user?.id === userId;

        if (!isProvider && !isWorker) {
            throw new ForbiddenException('Only the assigned provider or worker can start the contract');
        }

        if (contract.status === ContractStatus.IN_PROGRESS) {
            return contract;
        }

        if (contract.status !== ContractStatus.ACTIVE) {
            throw new BadRequestException('Contract must be ACTIVE to start');
        }

        contract.status = ContractStatus.IN_PROGRESS;
        contract.workerStartingDate = new Date();
        contract.hasBeenStarted = true;
        return await this.contractRepository.save(contract);
    }

    async acknowledgeClientStart(clientUserId: string, contractId: string): Promise<ContractEntity> {
        const client = await this.clientService.getProfile(clientUserId);
        const contract = await this.contractRepository.findOne({
            where: { id: contractId },
            relations: { client: true },
        });

        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        if (contract.client.id !== client.id) {
            throw new ForbiddenException('Only the client can acknowledge the service start');
        }

        if (contract.status !== ContractStatus.ACTIVE && contract.status !== ContractStatus.IN_PROGRESS) {
            throw new BadRequestException('Contract cannot be acknowledged in its current state');
        }

        if (contract.clientStartingDate) {
            throw new BadRequestException('Client start has already been recorded');
        }

        contract.clientStartingDate = new Date();
        return await this.contractRepository.save(contract);
    }

    async completeContractByProvider(userId: string, contractId: string, reviewDto: CreateReviewDto): Promise<ContractEntity> {
        const contract = await this.contractRepository.findOne({
            where: { id: contractId },
            relations: {
                client: { user: true },
                provider: { user: true },
                assignedWorker: { user: true },
            },
        });

        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        const isProvider = contract.provider.user.id === userId;
        const isWorker = contract.assignedWorker?.user?.id === userId;

        if (!isProvider && !isWorker) {
            throw new ForbiddenException('Only the assigned provider or worker can complete the contract');
        }

        if (contract.status !== ContractStatus.IN_PROGRESS) {
            throw new BadRequestException('Contract must be IN_PROGRESS to mark as complete');
        }

        return this.dataSource.transaction(async (manager) => {
            const contractRepo = manager.getRepository(ContractEntity);
            const reviewRepo = manager.getRepository(ReviewEntity);

            await this.assertNoExistingReview(reviewRepo, contractId, userId);

            contract.status = ContractStatus.PROVIDER_COMPLETED;
            contract.workerEndingDate = new Date();
            const savedContract = await contractRepo.save(contract);

            await reviewRepo.save(
                reviewRepo.create({
                    rating: reviewDto.rating,
                    comment: reviewDto.comment,
                    contract: savedContract,
                    reviewer: { id: userId } as ReviewEntity['reviewer'],
                    reviewee: contract.client.user,
                }),
            );

            return savedContract;
        });
    }

    async confirmContractCompletion(clientUserId: string, contractId: string, reviewDto: CreateReviewDto): Promise<ContractEntity> {
        const client = await this.clientService.getProfile(clientUserId);
        const contract = await this.contractRepository.findOne({
            where: { id: contractId },
            relations: { client: { user: true }, provider: { user: true } },
        });

        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        if (contract.client.id !== client.id) {
            throw new ForbiddenException('Only the client who posted the job can confirm completion');
        }

        if (contract.status !== ContractStatus.PROVIDER_COMPLETED) {
            throw new BadRequestException('Contract must be marked completed by provider first');
        }

        return this.dataSource.transaction(async (manager) => {
            const contractRepo = manager.getRepository(ContractEntity);
            const reviewRepo = manager.getRepository(ReviewEntity);

            await this.assertNoExistingReview(reviewRepo, contractId, client.user.id);

            contract.status = ContractStatus.COMPLETED;
            contract.clientEndingDate = new Date();
            contract.hasBeenCompleted = true;
            contract.completedAt = new Date();
            const savedContract = await contractRepo.save(contract);

            await reviewRepo.save(
                reviewRepo.create({
                    rating: reviewDto.rating,
                    comment: reviewDto.comment,
                    contract: savedContract,
                    reviewer: contract.client.user,
                    reviewee: contract.provider.user,
                }),
            );

            return savedContract;
        });
    }

    async cancelContract(userId: string, contractId: string): Promise<ContractEntity> {
        const contract = await this.contractRepository.findOne({
            where: { id: contractId },
            relations: { client: { user: true }, provider: { user: true }, job: true },
        });

        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        if (contract.client.user.id !== userId && contract.provider.user.id !== userId) {
            throw new ForbiddenException('You are not authorized to cancel this contract');
        }

        if (contract.status === ContractStatus.COMPLETED || contract.status === ContractStatus.CANCELLED) {
            throw new BadRequestException('Cannot cancel a completed or already cancelled contract');
        }

        return this.dataSource.transaction(async (manager) => {
            const contractRepo = manager.getRepository(ContractEntity);
            const jobRepo = manager.getRepository(JobEntity);

            contract.status = ContractStatus.CANCELLED;
            contract.job.status = JobStatus.CANCELLED;
            await jobRepo.save(contract.job);
            return contractRepo.save(contract);
        });
    }

    async getProviderDashboardStats(providerUserId: string) {
        const provider = await this.profileService.getMyProfile(providerUserId);
        const newJobs = await this.getOpenJobsForProvider(providerUserId);

        const awaitingResponse = await this.offerRepository.count({
            where: { provider: { id: provider.id }, status: OfferStatus.PENDING },
        });

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const scheduledTodayContracts = await this.contractRepository.find({
            where: {
                provider: { id: provider.id },
                status: ContractStatus.ACTIVE,
                scheduledAt: Between(startOfDay, endOfDay),
            },
        });

        const expectedRevenue = scheduledTodayContracts.reduce(
            (sum, contract) => sum + Number(contract.price),
            0,
        );

        return {
            needsYourOffer: newJobs.length,
            awaitingResponse,
            scheduledToday: scheduledTodayContracts.length,
            expectedRevenue,
        };
    }

    private async assertNoExistingReview(
        reviewRepo: Repository<ReviewEntity>,
        contractId: string,
        reviewerId: string,
    ): Promise<void> {
        const existing = await reviewRepo.findOne({
            where: { contract: { id: contractId }, reviewer: { id: reviewerId } },
        });

        if (existing) {
            throw new BadRequestException('Review already submitted for this contract');
        }
    }

    private resolveOfferSchedule(
        job: JobEntity,
        usesRequestedSchedule: boolean,
        proposedScheduledAt?: string | null,
    ): Date | null {
        if (usesRequestedSchedule) {
            if (!job.requestedScheduledAt) {
                throw new BadRequestException('Job has no requested schedule to use');
            }
            return job.requestedScheduledAt;
        }

        if (!proposedScheduledAt) {
            throw new BadRequestException('Proposed schedule is required when not using requested schedule');
        }

        return new Date(proposedScheduledAt);
    }

    private async resolveWorkerAssignment(
        providerProfileId: string,
        options: { workerId?: string; assignSelf?: boolean },
        scheduledAt: Date | null,
        excludeOfferId?: string,
        excludeContractId?: string,
    ) {
        if (options.assignSelf && options.workerId) {
            throw new BadRequestException('Provide either workerId or assignSelf, not both');
        }

        if (options.assignSelf) {
            const worker = await this.workerService.getOrCreateSelfWorker(providerProfileId);
            if (scheduledAt) {
                await this.assertWorkerAvailable(worker.id, scheduledAt, excludeOfferId, excludeContractId);
            }
            return worker;
        }

        if (!options.workerId) {
            return null;
        }

        const worker = await this.workerService.getWorkerOrThrow(options.workerId, providerProfileId);

        if (scheduledAt) {
            await this.assertWorkerAvailable(worker.id, scheduledAt, excludeOfferId, excludeContractId);
        }

        return worker;
    }

    private async assertWorkerAvailable(
        workerId: string,
        scheduledAt: Date,
        excludeOfferId?: string,
        excludeContractId?: string,
    ) {
        const available = await this.isWorkerAvailable(workerId, scheduledAt, excludeOfferId, excludeContractId);
        if (!available) {
            throw new BadRequestException('Selected worker is already booked at the requested time');
        }
    }

    private async isWorkerAvailable(
        workerId: string,
        scheduledAt: Date,
        excludeOfferId?: string,
        excludeContractId?: string,
    ): Promise<boolean> {
        const { start, end } = this.getScheduleWindow(scheduledAt);

        const offerQb = this.offerRepository
            .createQueryBuilder('offer')
            .where('offer.assigned_worker_id = :workerId', { workerId })
            .andWhere('offer.status = :status', { status: OfferStatus.PENDING })
            .andWhere('offer.proposed_scheduled_at BETWEEN :start AND :end', { start, end });

        if (excludeOfferId) {
            offerQb.andWhere('offer.id != :excludeOfferId', { excludeOfferId });
        }

        const conflictingOffer = await offerQb.getOne();

        if (conflictingOffer) {
            return false;
        }

        const contractQb = this.contractRepository
            .createQueryBuilder('contract')
            .where('contract.assigned_worker_id = :workerId', { workerId })
            .andWhere('contract.status IN (:...statuses)', {
                statuses: [ContractStatus.ACTIVE, ContractStatus.IN_PROGRESS, ContractStatus.PROVIDER_COMPLETED],
            })
            .andWhere('contract.scheduled_at BETWEEN :start AND :end', { start, end });

        if (excludeContractId) {
            contractQb.andWhere('contract.id != :excludeContractId', { excludeContractId });
        }

        const conflictingContract = await contractQb.getOne();

        return !conflictingContract;
    }

    private getScheduleWindow(scheduledAt: Date) {
        const start = new Date(scheduledAt);
        start.setMinutes(0, 0, 0);
        const end = new Date(start);
        end.setHours(end.getHours() + 1);
        return { start, end };
    }

    private filterJobs(jobs: JobEntity[], query: GetProviderRequestsQueryDto) {
        return jobs.filter((job) => this.matchesJobFilters(job, query));
    }

    private filterOffers(offers: OfferEntity[], query: GetProviderRequestsQueryDto) {
        return offers.filter((offer) => {
            if (!this.matchesJobFilters(offer.job, query)) return false;
            if (query.assigneeId && offer.assignedWorker?.id !== query.assigneeId) return false;
            if (query.date && offer.proposedScheduledAt) {
                if (!this.isSameDate(offer.proposedScheduledAt, query.date)) return false;
            }
            return true;
        });
    }

    private filterContracts(contracts: ContractEntity[], query: GetProviderRequestsQueryDto) {
        return contracts.filter((contract) => {
            if (!this.matchesJobFilters(contract.job, query)) return false;
            if (query.assigneeId && contract.assignedWorker?.id !== query.assigneeId) return false;
            if (query.date && contract.scheduledAt) {
                if (!this.isSameDate(contract.scheduledAt, query.date)) return false;
            }
            return true;
        });
    }

    private matchesJobFilters(job: JobEntity, query: GetProviderRequestsQueryDto): boolean {
        if (query.search) {
            const term = query.search.toLowerCase();
            const haystack = [job.title, job.category, job.location, job.serviceAddress]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            if (!haystack.includes(term)) return false;
        }

        if (query.category && job.category !== query.category) return false;
        if (query.location && job.location !== query.location) return false;
        if (query.minBudget !== undefined && Number(job.budget ?? 0) < query.minBudget) return false;
        if (query.maxBudget !== undefined && Number(job.budget ?? 0) > query.maxBudget) return false;

        return true;
    }

    private isSameDate(date: Date, isoDate: string): boolean {
        const d = new Date(date);
        const target = new Date(isoDate);
        return (
            d.getFullYear() === target.getFullYear() &&
            d.getMonth() === target.getMonth() &&
            d.getDate() === target.getDate()
        );
    }
}
