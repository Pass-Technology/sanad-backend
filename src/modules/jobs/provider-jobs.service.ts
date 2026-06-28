import { Injectable } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { WorkerService } from '../worker/worker.service';
import { ProfileService } from '../provider-profile/profile.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { GetProviderContractsQueryDto } from './dto/get-provider-contracts-query.dto';
import { GetProviderRequestsQueryDto } from './dto/get-provider-requests-query.dto';
import { AssignWorkerDto } from './dto/assign-worker.dto';
import { AddContractAssetsDto } from './dto/add-contract-assets.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { ContractStatus } from './enums/contract-status.enum';
import { OfferStatus } from './enums/offer-status.enum';

@Injectable()
export class ProviderJobsService {
    constructor(
        private readonly jobsService: JobsService,
        private readonly workerService: WorkerService,
        private readonly profileService: ProfileService,
    ) {}

    getOpenJobs(userId: string) {
        return this.jobsService.getOpenJobsForProvider(userId);
    }

    getOpenJobById(jobId: string) {
        return this.jobsService.getJobById(jobId);
    }

    getRequests(userId: string, query: GetProviderRequestsQueryDto) {
        return this.jobsService.getProviderRequests(userId, query);
    }

    dismissJob(userId: string, jobId: string) {
        return this.jobsService.dismissJob(userId, jobId);
    }

    submitOffer(userId: string, dto: CreateOfferDto) {
        return this.jobsService.submitOffer(userId, dto);
    }

    updateOffer(userId: string, offerId: string, dto: UpdateOfferDto) {
        return this.jobsService.updateOffer(userId, offerId, dto);
    }

    getOfferById(userId: string, offerId: string) {
        return this.jobsService.getProviderOfferById(userId, offerId);
    }

    withdrawOffer(userId: string, offerId: string) {
        return this.jobsService.withdrawOffer(userId, offerId);
    }

    async getMyOffers(userId: string, status?: OfferStatus) {
        const offers = await this.jobsService.getMyOffers(userId, status);
        return status ? offers : offers;
    }

    getWorkerAvailability(userId: string, jobId: string, scheduledAt?: string) {
        return this.jobsService.getWorkerAvailability(userId, jobId, scheduledAt);
    }

    assignWorker(userId: string, contractId: string, dto: AssignWorkerDto) {
        return this.jobsService.assignWorker(userId, contractId, dto);
    }

    startContract(userId: string, contractId: string) {
        return this.jobsService.startContract(userId, contractId);
    }

    completeContract(userId: string, contractId: string, dto: CreateReviewDto) {
        return this.jobsService.completeContractByProvider(userId, contractId, dto);
    }

    cancelContract(userId: string, contractId: string) {
        return this.jobsService.cancelContract(userId, contractId);
    }

    addContractAssets(userId: string, contractId: string, dto: AddContractAssetsDto) {
        return this.jobsService.addContractAssets(userId, contractId, dto);
    }

    getContracts(userId: string, type: string, query: GetProviderContractsQueryDto) {
        const statuses = this.resolveContractStatuses(type);
        if (query.status) {
            return this.jobsService.getProviderContracts(userId, [query.status]);
        }
        return this.jobsService.getProviderContracts(userId, statuses);
    }

    getContractById(userId: string, contractId: string) {
        return this.jobsService.getContractById(contractId, userId);
    }

    getDashboardStats(userId: string) {
        return this.jobsService.getProviderDashboardStats(userId);
    }

    async getWorkers(userId: string) {
        const provider = await this.profileService.getMyProfile(userId);
        return this.workerService.getWorkersByProvider(provider.id);
    }

    async getSelfWorker(userId: string) {
        const provider = await this.profileService.getMyProfile(userId);
        return this.workerService.getOrCreateSelfWorker(provider.id);
    }

    private resolveContractStatuses(type: string): ContractStatus[] {
        switch (type) {
            case 'scheduled':
                return [ContractStatus.ACTIVE];
            case 'in_progress':
                return [ContractStatus.IN_PROGRESS, ContractStatus.PROVIDER_COMPLETED];
            case 'active':
                return [ContractStatus.ACTIVE, ContractStatus.IN_PROGRESS, ContractStatus.PROVIDER_COMPLETED];
            case 'completed':
                return [ContractStatus.COMPLETED];
            case 'cancelled':
            case 'archived':
                return [ContractStatus.CANCELLED];
            default:
                return [ContractStatus.ACTIVE, ContractStatus.IN_PROGRESS, ContractStatus.PROVIDER_COMPLETED, ContractStatus.COMPLETED, ContractStatus.CANCELLED];
        }
    }
}
