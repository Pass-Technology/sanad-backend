import { DataSource } from "typeorm";
import { BillingCycleEntity } from "../../../modules/plan/entities/billing-cycle.entity";
import { LookUpProviderTypeEntity } from "../../../modules/profile/lookup-tables/entities/lookup-provider-type.entity";
import { ProviderTypeStaticCode } from "../../../modules/profile/lookup-tables/enums/lookup-static-codes.enum";

export const billingCycles = [
    {
        id: '2e7e891c-8b2c-4b6e-827c-36b5674c9351',
        labelEn: 'Monthly',
        labelAr: 'شهري',
        months: 1,
        discountPercentage: 0,
        badgeEn: null,
        badgeAr: null,
        staticCode: 'monthly'
    },
    {
        id: '8cbf916c-4821-4f7b-951c-4b3d872c65fe',
        labelEn: '3 Months',
        labelAr: '3 أشهر',
        months: 3,
        discountPercentage: 10,
        badgeEn: 'Save 10%',
        badgeAr: 'وفر 10%',
        staticCode: '3_months'
    },
    {
        id: 'bf2e896c-d2c6-4b8a-81a2-5c9b74d6821e',
        labelEn: '6 Months',
        labelAr: '6 أشهر',
        months: 6,
        discountPercentage: 25,
        badgeEn: 'Save 25%',
        badgeAr: 'وفر 25%',
        staticCode: '6_months'
    },
    {
        id: 'df5e8c1b-e2a4-4f9e-bc16-d3b5c742819a',
        labelEn: 'Yearly',
        labelAr: 'سنوي',
        months: 12,
        discountPercentage: 15,
        badgeEn: 'Save 15%',
        badgeAr: 'وفر 15%',
        staticCode: 'yearly'
    }
];

export async function billingCycleSeed(dataSource: DataSource) {
    const ptRepo = dataSource.getRepository(LookUpProviderTypeEntity);
    const repo = dataSource.getRepository(BillingCycleEntity);

    const individual = await ptRepo.findOne({ where: { staticCode: ProviderTypeStaticCode.INDIVIDUAL } });
    const company = await ptRepo.findOne({ where: { staticCode: ProviderTypeStaticCode.COMPANY } });

    for (const data of billingCycles) {
        let entry = await repo.findOne({ where: { id: data.id }, relations: ['providerTypes'] });
        
        if (entry) {
            Object.assign(entry, data);
        } else {
            entry = repo.create(data);
        }
        
        // Link to both provider types
        entry.providerTypes = [individual, company].filter((pt): pt is LookUpProviderTypeEntity => !!pt);
        await repo.save(entry);
    }
}
