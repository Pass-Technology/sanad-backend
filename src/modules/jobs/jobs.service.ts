import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { JobEntity } from './entities/job.entity';
import { OfferEntity } from './entities/offer.entity';
import { ContractEntity } from './entities/contract.entity';
import { ReviewEntity } from './entities/review.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { CreateOfferDto } from './dto/create-offer.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { AssignWorkerDto } from './dto/assign-worker.dto';
import { JobStatus } from './enums/job-status.enum';
import { OfferStatus } from './enums/offer-status.enum';
import { ContractStatus } from './enums/contract-status.enum';
import { UserType } from '../user/enums/user-type.enum';

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
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async createJob(clientUserId: string, dto: CreateJobDto): Promise<JobEntity> {
        const client = await this.userRepository.findOne({ where: { id: clientUserId } });
        if (!client) {
            throw new NotFoundException('Client user not found');
        }

        const job = this.jobRepository.create({
            title: dto.title,
            description: dto.description,
            budget: dto.budget,
            client,
            status: JobStatus.OPEN,
        });

        return await this.jobRepository.save(job);
    }

    async getOpenJobs(): Promise<JobEntity[]> {
        return await this.jobRepository.find({
            where: { status: JobStatus.OPEN },
            relations: { client: true },
            order: { createdAt: 'DESC' },
        });
    }

    async getJobById(id: string, userId: string): Promise<JobEntity> {
        const job = await this.jobRepository.findOne({
            where: { id },
            relations: {
                client: true,
                offers: { provider: true },
            },
        });

        if (!job) {
            throw new NotFoundException('Job not found');
        }

        return job;
    }

    async submitOffer(providerUserId: string, jobId: string, dto: CreateOfferDto): Promise<OfferEntity> {
        const provider = await this.userRepository.findOne({ where: { id: providerUserId } });
        if (!provider) {
            throw new NotFoundException('Provider user not found');
        }

        const job = await this.jobRepository.findOne({ where: { id: jobId } });
        if (!job) {
            throw new NotFoundException('Job not found');
        }

        if (job.status !== JobStatus.OPEN) {
            throw new BadRequestException('Job is no longer open for offers');
        }

        // Check if provider already placed an offer
        const existing = await this.offerRepository.findOne({
            where: { job: { id: jobId }, provider: { id: providerUserId } },
        });
        if (existing) {
            throw new BadRequestException('You have already submitted an offer for this job');
        }

        const offer = this.offerRepository.create({
            price: dto.price,
            notes: dto.notes,
            estimatedDuration: dto.estimatedDuration,
            job,
            provider,
            status: OfferStatus.PENDING,
        });

        return await this.offerRepository.save(offer);
    }

    async acceptOffer(clientUserId: string, offerId: string): Promise<ContractEntity> {
        const offer = await this.offerRepository.findOne({
            where: { id: offerId },
            relations: { job: { client: true }, provider: true },
        });

        if (!offer) {
            throw new NotFoundException('Offer not found');
        }

        if (offer.job.client.id !== clientUserId) {
            throw new ForbiddenException('Only the job poster can accept offers');
        }

        if (offer.job.status !== JobStatus.OPEN) {
            throw new BadRequestException('Job is already assigned or completed');
        }

        if (offer.status !== OfferStatus.PENDING) {
            throw new BadRequestException('Offer is no longer pending');
        }

        // Accept this offer
        offer.status = OfferStatus.ACCEPTED;
        await this.offerRepository.save(offer);

        // Reject other pending offers
        await this.offerRepository.update(
            { job: { id: offer.job.id }, status: OfferStatus.PENDING, id: Not(offer.id) },
            { status: OfferStatus.REJECTED },
        );

        // Update Job status
        offer.job.status = JobStatus.CONTRACTED;
        await this.jobRepository.save(offer.job);

        // Create the Contract
        const contract = this.contractRepository.create({
            price: offer.price,
            status: ContractStatus.ACTIVE,
            job: offer.job,
            acceptedOffer: offer,
            client: offer.job.client,
            provider: offer.provider,
            assignedWorker: offer.provider, // Default to provider if not worker-assigned
        });

        return await this.contractRepository.save(contract);
    }

    async getContractById(id: string, userId: string): Promise<ContractEntity> {
        const contract = await this.contractRepository.findOne({
            where: { id },
            relations: {
                client: true,
                provider: true,
                assignedWorker: true,
                job: true,
                reviews: { reviewer: true, reviewee: true },
            },
        });

        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        if (
            contract.client.id !== userId &&
            contract.provider.id !== userId &&
            contract.assignedWorker?.id !== userId
        ) {
            throw new ForbiddenException('You are not authorized to view this contract');
        }

        return contract;
    }

    async assignWorker(providerUserId: string, contractId: string, dto: AssignWorkerDto): Promise<ContractEntity> {
        const contract = await this.contractRepository.findOne({
            where: { id: contractId },
            relations: { provider: true },
        });

        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        if (contract.provider.id !== providerUserId) {
            throw new ForbiddenException('Only the assigned provider can assign a worker');
        }

        if (contract.status !== ContractStatus.ACTIVE) {
            throw new BadRequestException('Workers can only be assigned to ACTIVE contracts');
        }

        const worker = await this.userRepository.findOne({
            where: { id: dto.workerId, type: UserType.WORKER },
        });

        if (!worker) {
            throw new NotFoundException('Worker user not found or is not a worker');
        }

        contract.assignedWorker = worker;
        return await this.contractRepository.save(contract);
    }

    async startContract(userId: string, contractId: string): Promise<ContractEntity> {
        const contract = await this.contractRepository.findOne({
            where: { id: contractId },
            relations: { provider: true, assignedWorker: true },
        });

        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        const isProvider = contract.provider.id === userId;
        const isWorker = contract.assignedWorker?.id === userId;

        if (!isProvider && !isWorker) {
            throw new ForbiddenException('Only the assigned provider or worker can start the contract');
        }

        if (contract.status !== ContractStatus.ACTIVE) {
            throw new BadRequestException('Contract must be ACTIVE to start');
        }

        contract.status = ContractStatus.IN_PROGRESS;
        return await this.contractRepository.save(contract);
    }

    async completeContractByProvider(userId: string, contractId: string, reviewDto: CreateReviewDto): Promise<ContractEntity> {
        const contract = await this.contractRepository.findOne({
            where: { id: contractId },
            relations: { client: true, provider: true, assignedWorker: true },
        });

        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        const isProvider = contract.provider.id === userId;
        const isWorker = contract.assignedWorker?.id === userId;

        if (!isProvider && !isWorker) {
            throw new ForbiddenException('Only the assigned provider or worker can complete the contract');
        }

        if (contract.status !== ContractStatus.IN_PROGRESS) {
            throw new BadRequestException('Contract must be IN_PROGRESS to mark as complete');
        }

        contract.status = ContractStatus.PROVIDER_COMPLETED;
        const savedContract = await this.contractRepository.save(contract);

        // Provider reviews the client
        const review = this.reviewRepository.create({
            rating: reviewDto.rating,
            comment: reviewDto.comment,
            contract: savedContract,
            reviewer: { id: userId } as any,
            reviewee: contract.client,
        });
        await this.reviewRepository.save(review);

        return savedContract;
    }

    async confirmContractCompletion(clientUserId: string, contractId: string, reviewDto: CreateReviewDto): Promise<ContractEntity> {
        const contract = await this.contractRepository.findOne({
            where: { id: contractId },
            relations: { client: true, provider: true },
        });

        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        if (contract.client.id !== clientUserId) {
            throw new ForbiddenException('Only the client who posted the job can confirm completion');
        }

        if (contract.status !== ContractStatus.PROVIDER_COMPLETED) {
            throw new BadRequestException('Contract must be marked completed by provider first');
        }

        contract.status = ContractStatus.COMPLETED;
        const savedContract = await this.contractRepository.save(contract);

        // Client reviews the provider
        const review = this.reviewRepository.create({
            rating: reviewDto.rating,
            comment: reviewDto.comment,
            contract: savedContract,
            reviewer: { id: clientUserId } as any,
            reviewee: contract.provider,
        });
        await this.reviewRepository.save(review);

        return savedContract;
    }

    async cancelContract(userId: string, contractId: string): Promise<ContractEntity> {
        const contract = await this.contractRepository.findOne({
            where: { id: contractId },
            relations: { client: true, provider: true },
        });

        if (!contract) {
            throw new NotFoundException('Contract not found');
        }

        if (contract.client.id !== userId && contract.provider.id !== userId) {
            throw new ForbiddenException('You are not authorized to cancel this contract');
        }

        if (contract.status === ContractStatus.COMPLETED || contract.status === ContractStatus.CANCELLED) {
            throw new BadRequestException('Cannot cancel a completed or already cancelled contract');
        }

        contract.status = ContractStatus.CANCELLED;
        return await this.contractRepository.save(contract);
    }

    async getMyOffers(providerUserId: string): Promise<OfferEntity[]> {
        return await this.offerRepository.find({
            where: { provider: { id: providerUserId } },
            relations: { job: true },
            order: { createdAt: 'DESC' },
        });
    }

    async withdrawOffer(providerUserId: string, offerId: string): Promise<OfferEntity> {
        const offer = await this.offerRepository.findOne({
            where: { id: offerId },
            relations: { provider: true },
        });

        if (!offer) {
            throw new NotFoundException('Offer not found');
        }

        if (offer.provider.id !== providerUserId) {
            throw new ForbiddenException('You are not authorized to withdraw this offer');
        }

        if (offer.status !== OfferStatus.PENDING) {
            throw new BadRequestException('Only pending offers can be withdrawn');
        }

        offer.status = OfferStatus.WITHDRAWN;
        return await this.offerRepository.save(offer);
    }
}
