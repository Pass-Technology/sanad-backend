import AppDataSource from '../data-source';
import { LookUpProfileStatusEntity } from '../../modules/profile/lookup-tables/entities/lookup-profile-status.entity';
import { LookUpProviderTypeEntity } from '../../modules/profile/lookup-tables/entities/lookup-provider-type.entity';
import { LookUpCompanyTypeEntity } from '../../modules/profile/lookup-tables/entities/lookup-company-type.entity';
import { LookUpBillingCycleEntity } from 'src/modules/profile/lookup-tables/entities/lookup-biling-cycle.entity';

import { billingCycleSeed } from './plan-management/billing-cycle.seed';
import { featureSeed } from './plan-management/feature.seed';
import { planSeed } from './plan-management/plan.seed';
import { planFeatureSeed } from './plan-management/plan-feature.seed';
import { planPriceSeed } from './plan-management/plan-price.seed';
import { profileStatusSeed } from './lookup-seeds/profile-status/profile-status.seed';
import { providerTypeSeed } from './lookup-seeds/provider-type/provider-type.seed';
import { companyTypeSeed } from './lookup-seeds/company-type/company-type.seed';

async function runSeed() {
    const dataSource = await AppDataSource.initialize();

    console.log('Lookup tables starting to seed');

    await billingCycleSeed(dataSource);
    await profileStatusSeed(dataSource);
    await providerTypeSeed(dataSource);
    await companyTypeSeed(dataSource);

    console.log('Plans starting to seed');

    await planSeed(dataSource);
    await featureSeed(dataSource);
    await planFeatureSeed(dataSource);
    await planPriceSeed(dataSource);

    console.log('All seeds finished successfully');


    await dataSource.destroy();
    process.exit(0);
}

runSeed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});