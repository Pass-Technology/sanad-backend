import AppDataSource from '../data-source';
import { billingCycleSeed } from './plan-management/billing-cycle.seed';
import { planSeed } from './plan-management/plan.seed';
import { planFeatureSeed } from './plan-management/plan-feature.seed';
import { planPriceSeed } from './plan-management/plan-price.seed';
import { profileStatusSeed } from './lookup-seeds/profile-status/profile-status.seed';
import { providerTypeSeed } from './lookup-seeds/provider-type/provider-type.seed';
import { companyTypeSeed } from './lookup-seeds/company-type/company-type.seed';
import { servicesSeed } from './profile-management/services.seed';

async function runSeed() {
    const dataSource = await AppDataSource.initialize();

    console.log('Lookup tables starting to seed');

    await profileStatusSeed(dataSource);
    await providerTypeSeed(dataSource);
    await companyTypeSeed(dataSource);
    await billingCycleSeed(dataSource);

    console.log('Plans starting to seed');

    await planSeed(dataSource);
    await planFeatureSeed(dataSource);
    await planPriceSeed(dataSource);

    console.log('Services starting to seed');
    await servicesSeed(dataSource);

    console.log('All seeds finished successfully');


    await dataSource.destroy();
    process.exit(0);
}

runSeed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});