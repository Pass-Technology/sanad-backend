import AppDataSource from '../data-source';
import { LookUpProfileStatusEntity } from '../../modules/profile/lookup-tables/entities/lookup-profile-status.entity';
import { LookUpProviderTypeEntity } from '../../modules/profile/lookup-tables/entities/lookup-provider-type.entity';
import { LookUpCompanyTypeEntity } from '../../modules/profile/lookup-tables/entities/lookup-company-type.entity';
import { LookUpBillingCycleEntity } from 'src/modules/profile/lookup-tables/entities/lookup-biling-cycle.entity';
import { billingCycleSeed } from './lookup-seeds/billing-cycle.seed';
import { companyTypeSeed } from './lookup-seeds/company-type.seed';
import { profileStatusSeed } from './lookup-seeds/profile-status.seed';
import { providerTypeSeed } from './lookup-seeds/provider-type.seed';
import { SubscriptionPlanFeatureEntity } from 'src/modules/subscription/entity/subscription-plan-feature.entity';
import { SubscriptionPlanEntity } from 'src/modules/subscription/entity/subscription-plan.entity';
import { subscriptionPlanFeaturesSeed } from './subscriptions-seeds/subscription-plan-feature.seed';
import { subscriptionPlansSeed } from './subscriptions-seeds/subscription-plan.seed';


async function runSeed() {
    const dataSource = await AppDataSource.initialize();

    const profileStatusRepo = dataSource.getRepository(LookUpProfileStatusEntity);
    const providerTypeRepo = dataSource.getRepository(LookUpProviderTypeEntity);
    const companyTypeRepo = dataSource.getRepository(LookUpCompanyTypeEntity);
    const billingCycleRepo = dataSource.getRepository(LookUpBillingCycleEntity);
    const subscriptionPlanRepo = dataSource.getRepository(SubscriptionPlanEntity);
    const subscriptionPlanFeatureRepo = dataSource.getRepository(SubscriptionPlanFeatureEntity);

    // Lookup seeds
    await profileStatusRepo.upsert(profileStatusSeed, ['id']);
    await providerTypeRepo.upsert(providerTypeSeed, ['id']);
    await companyTypeRepo.upsert(companyTypeSeed, ['id']);
    await billingCycleRepo.upsert(billingCycleSeed, ['id']);

    console.log('Lookup tables seeded successfully');

    // Subscription seeds
    await subscriptionPlanRepo.upsert(subscriptionPlansSeed, ['id']);
    await subscriptionPlanFeatureRepo.upsert(subscriptionPlanFeaturesSeed, ['planId', 'featureText']);

    console.log('Subscription plans seeded successfully');


    await dataSource.destroy();
    process.exit(0);
}

runSeed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});