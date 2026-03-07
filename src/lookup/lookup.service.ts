import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LookUpProfileStatus } from "./entities/lookup-profile-status.entity";
import { LookUpProviderType } from "./entities/lookup-provider-type.entity";
import { LookUpCompanyType } from "./entities/lookup-company-type.entity";
import { LookUpBillingCycle } from "./entities/lookup-biling-cycle.entity";
import { LookupCacheService } from "./lookup-cache.service";

@Injectable()
export class LookUpService {
    constructor(
        @InjectRepository(LookUpProfileStatus)
        private readonly profileStatusrRepo: Repository<LookUpProfileStatus>,
        @InjectRepository(LookUpProviderType)
        private readonly providerTypeRepo: Repository<LookUpProviderType>,
        @InjectRepository(LookUpCompanyType)
        private readonly companyTypeRepo: Repository<LookUpCompanyType>,
        @InjectRepository(LookUpBillingCycle)
        private readonly billingCycleRepo: Repository<LookUpBillingCycle>,
        private readonly lookupCacheService: LookupCacheService,
    ) { }

    async getProfileStatus() {
        const cached = await this.lookupCacheService.get('lookup:profile-status');
        if (cached) return cached;

        const data = await this.profileStatusrRepo.find();
        await this.lookupCacheService.set('lookup:profile-status', data);
        return data;
    }

    async getProviderTypes() {
        const cached = await this.lookupCacheService.get('lookup:provider-types');
        if (cached) return cached;

        const data = await this.providerTypeRepo.find();
        await this.lookupCacheService.set('lookup:provider-types', data);
        return data;
    }

    async getCompanyTypes() {
        const cached = await this.lookupCacheService.get('lookup:company-types');
        if (cached) return cached;

        const data = await this.companyTypeRepo.find();
        await this.lookupCacheService.set('lookup:company-types', data);
        return data;
    }

    async getBillingCycles() {
        const cached = await this.lookupCacheService.get('lookup:billing-cycles');
        if (cached) return cached;

        const data = await this.billingCycleRepo.find();
        await this.lookupCacheService.set('lookup:billing-cycles', data);
        return data;
    }

    async validateProviderTypeId(id: string): Promise<boolean> {
        const types = await this.getProviderTypes() as { id: string }[];
        return types.some(t => t.id === id);
    }

    async validateCompanyTypeId(id: string): Promise<boolean> {
        const types = await this.getCompanyTypes() as { id: string }[];
        return types.some(t => t.id === id);
    }
}