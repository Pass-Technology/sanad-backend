import { Injectable } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { GetClientJobsQueryDto } from './dto/get-client-jobs-query.dto';
import { GetClientContractsQueryDto } from './dto/get-client-contracts-query.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { ContractStatus } from './enums/contract-status.enum';

@Injectable()
export class ClientJobsService {
    constructor(private readonly jobsService: JobsService) {}

    createJob(userId: string, dto: CreateJobDto) {
        return this.jobsService.createJob(userId, dto);
    }

    getMyJobs(userId: string, query: GetClientJobsQueryDto) {
        return this.jobsService.getClientJobs(userId, query.status);
    }

    getJobById(userId: string, jobId: string) {
        return this.jobsService.getClientJobById(userId, jobId);
    }

    cancelJob(userId: string, jobId: string) {
        return this.jobsService.cancelJob(userId, jobId);
    }

    acceptOffer(userId: string, offerId: string) {
        return this.jobsService.acceptOffer(userId, offerId);
    }

    getContracts(userId: string, type: string, query: GetClientContractsQueryDto) {
        const statuses = this.resolveContractStatuses(type);
        if (query.status) {
            return this.jobsService.getClientContracts(userId, [query.status]);
        }
        return this.jobsService.getClientContracts(userId, statuses);
    }

    getContractById(userId: string, contractId: string) {
        return this.jobsService.getContractById(contractId, userId);
    }

    cancelContract(userId: string, contractId: string) {
        return this.jobsService.cancelContract(userId, contractId);
    }

    confirmContractCompletion(userId: string, contractId: string, dto: CreateReviewDto) {
        return this.jobsService.confirmContractCompletion(userId, contractId, dto);
    }

    acknowledgeStart(userId: string, contractId: string) {
        return this.jobsService.acknowledgeClientStart(userId, contractId);
    }

    private resolveContractStatuses(type: string): ContractStatus[] {
        switch (type) {
            case 'active':
                return [ContractStatus.ACTIVE, ContractStatus.IN_PROGRESS, ContractStatus.PROVIDER_COMPLETED];
            case 'completed':
                return [ContractStatus.COMPLETED];
            case 'cancelled':
                return [ContractStatus.CANCELLED];
            default:
                return [ContractStatus.ACTIVE, ContractStatus.IN_PROGRESS, ContractStatus.PROVIDER_COMPLETED, ContractStatus.COMPLETED, ContractStatus.CANCELLED];
        }
    }
}
