import AppDataSource from '../data-source';
import { LookUpProfileStatusEntity } from '../../modules/profile/lookup-tables/entities/lookup-profile-status.entity';
import { LookUpProviderTypeEntity } from '../../modules/profile/lookup-tables/entities/lookup-provider-type.entity';
import { LookUpCompanyTypeEntity } from '../../modules/profile/lookup-tables/entities/lookup-company-type.entity';
import { LookUpBillingCycleEntity } from 'src/modules/profile/lookup-tables/entities/lookup-biling-cycle.entity';

import { billingCycleSeed } from './lookup-seeds/billing-cycle/billing-cycle.seed';
import { profileStatusSeed } from './lookup-seeds/profile-status/profile-status.seed';
import { providerTypeSeed } from './lookup-seeds/provider-type/provider-type.seed';
import { companyTypeSeed } from './lookup-seeds/company-type/company-type.seed';



async function runSeed() {
    const dataSource = await AppDataSource.initialize();

    // const subscriptionPlanRepo = dataSource.getRepository(SubscriptionPlanEntity);
    // const subscriptionPlanFeatureRepo = dataSource.getRepository(SubscriptionPlanFeatureEntity);

    console.log('Lookup tables starting to seed');

    // Lookup seeds
    await billingCycleSeed(dataSource);
    await profileStatusSeed(dataSource);
    await providerTypeSeed(dataSource);
    await companyTypeSeed(dataSource);


    console.log('Lookup tables seeded successfully');

    await dataSource.destroy();
    process.exit(0);
}

runSeed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});