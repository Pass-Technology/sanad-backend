import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LookUpProfileStatusEntity } from "./entities/lookup-profile-status.entity";
import { LookUpProviderTypeEntity } from "./entities/lookup-provider-type.entity";
import { LookUpCompanyTypeEntity } from "./entities/lookup-company-type.entity";
import { LookUpBillingCycleEntity } from "./entities/lookup-biling-cycle.entity";
import { LookupCacheService } from "./lookup-cache.service";

@Injectable()
export class LookUpService {
    constructor(
        @InjectRepository(LookUpProfileStatusEntity)
        private readonly profileStatusrRepo: Repository<LookUpProfileStatusEntity>,
        @InjectRepository(LookUpProviderTypeEntity)
        private readonly providerTypeRepo: Repository<LookUpProviderTypeEntity>,
        @InjectRepository(LookUpCompanyTypeEntity)
        private readonly companyTypeRepo: Repository<LookUpCompanyTypeEntity>,
        @InjectRepository(LookUpBillingCycleEntity)
        private readonly billingCycleRepo: Repository<LookUpBillingCycleEntity>,
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