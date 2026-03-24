import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { LookUpProfileStatusEntity } from "./entities/lookup-profile-status.entity";
import { LookUpProviderTypeEntity } from "./entities/lookup-provider-type.entity";
import { LookUpCompanyTypeEntity } from "./entities/lookup-company-type.entity";
// import { LookUpBillingCycleEntity } from "./entities/lookup-biling-cycle.entity";
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
        // @InjectRepository(LookUpBillingCycleEntity)
        // private readonly billingCycleRepo: Repository<LookUpBillingCycleEntity>,
        private readonly lookupCacheService: LookupCacheService,
    ) { }

    async getProfileStatus(lang: string = 'en') {
        const cached = await this.lookupCacheService.get<LookUpProfileStatusEntity[]>('lookup:profile-status');
        let data: LookUpProfileStatusEntity[];

        if (cached) {
            data = cached;
        } else {
            data = await this.profileStatusrRepo.find();
            await this.lookupCacheService.set('lookup:profile-status', data);
        }

        return data.map(item => this.localize(item, lang));
    }

    async getProviderTypes(lang: string = 'en') {
        const cached = await this.lookupCacheService.get<LookUpProviderTypeEntity[]>('lookup:provider-types');
        let data: LookUpProviderTypeEntity[];

        if (cached) {
            data = cached;
        } else {
            data = await this.providerTypeRepo.find();
            await this.lookupCacheService.set('lookup:provider-types', data);
        }

        return data.map(item => this.localize(item, lang));
    }

    async getCompanyTypes(lang: string = 'en') {
        const cached = await this.lookupCacheService.get<LookUpCompanyTypeEntity[]>('lookup:company-types');
        let data: LookUpCompanyTypeEntity[];

        if (cached) {
            data = cached;
        } else {
            data = await this.companyTypeRepo.find();
            await this.lookupCacheService.set('lookup:company-types', data);
        }

        return data.map(item => this.localize(item, lang));
    }


    private localize(entity: any, lang: string) {
        const { labelEn, labelAr, badgeEn, badgeAr, ...rest } = entity;
        return {
            ...rest,
            label: lang === 'ar' ? labelAr : labelEn,
            ...(badgeEn !== undefined && { badge: lang === 'ar' ? badgeAr : badgeEn })
        };
    }

    async validateProviderTypeId(id: string): Promise<boolean> {
        const data = await this.getProviderTypes('en');
        return data.some(t => t.id === id);
    }


    async isProviderTypeExist(id: string): Promise<boolean> {
        return this.providerTypeRepo.exists({ where: { id } })
    }

    async validateCompanyTypeId(id: string): Promise<boolean> {
        const data = await this.getCompanyTypes('en');
        return data.some(t => t.id === id);
    }

    async isCompanyTypeExist(id: string): Promise<boolean> {
        return this.companyTypeRepo.exists({ where: { id } })
    }


    async getDraftStatus() {
        return await this.profileStatusrRepo.findOne({ where: { labelEn: 'Draft' } });
    }
}