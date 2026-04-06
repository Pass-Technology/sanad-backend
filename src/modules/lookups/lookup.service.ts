import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LookUpProfileStatusEntity } from "./entities/lookup-profile-status.entity";
import { LookUpProviderTypeEntity } from "./entities/lookup-provider-type.entity";
import { LookUpCompanyTypeEntity } from "./entities/lookup-company-type.entity";
import { LookupLanguagesEntity } from "./entities/lookup-languages.entity";
import { LookUpPaymentEntity } from "./entities/lookup-payment.entity";
import { LookUpPaymentCategoryEntity } from "./entities/lookup-payment-category.entity";
import { LookupCacheService } from "./lookup-cache.service";
import { localize } from '../../shared/localization.util'

@Injectable()
export class LookUpService {
    constructor(
        @InjectRepository(LookUpProfileStatusEntity)
        private readonly profileStatusrRepo: Repository<LookUpProfileStatusEntity>,
        @InjectRepository(LookUpProviderTypeEntity)
        private readonly providerTypeRepo: Repository<LookUpProviderTypeEntity>,
        @InjectRepository(LookUpCompanyTypeEntity)
        private readonly companyTypeRepo: Repository<LookUpCompanyTypeEntity>,
        @InjectRepository(LookupLanguagesEntity)
        private readonly languagesRepo: Repository<LookupLanguagesEntity>,
        @InjectRepository(LookUpPaymentEntity)
        private readonly paymentRepo: Repository<LookUpPaymentEntity>,
        @InjectRepository(LookUpPaymentCategoryEntity)
        private readonly paymentCategoryRepo: Repository<LookUpPaymentCategoryEntity>,
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

    async getLanguages(lang: string = 'en') {
        const cached = await this.lookupCacheService.get<LookupLanguagesEntity[]>('lookup:languages');
        let data: LookupLanguagesEntity[];

        if (cached) {
            data = cached;
        } else {
            data = await this.languagesRepo.find();
            await this.lookupCacheService.set('lookup:languages', data);
        }
        return localize(data, lang)
    }

    async getPaymentLookups(lang: string = 'en') {
        const cacheKey = `lookup:payments:hierarchical`;
        const cached = await this.lookupCacheService.get<any>(cacheKey);

        if (cached) {
            return cached;
        }

        const categories = await this.paymentCategoryRepo.find({
            relations: { payments: true }
        });

        const response = localize(categories, lang);

        await this.lookupCacheService.set(cacheKey, response);
        return response;
    }


    private localize(entity: any, lang: string) {
        return localize(entity, lang);
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