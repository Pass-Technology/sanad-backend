import AppDataSource from '../data-source';
import { profileStatusSeed, providerTypeSeed, companyTypeSeed, billingCycleSeed } from './lookup.seed';
import { LookUpProfileStatusEntity } from '../../modules/profile/lookup-tables/entities/lookup-profile-status.entity';
import { LookUpProviderTypeEntity } from '../../modules/profile/lookup-tables/entities/lookup-provider-type.entity';
import { LookUpCompanyTypeEntity } from '../../modules/profile/lookup-tables/entities/lookup-company-type.entity';
import { LookUpBillingCycleEntity } from 'src/modules/profile/lookup-tables/entities/lookup-biling-cycle.entity';


async function runSeed() {
    const dataSource = await AppDataSource.initialize();

    const profileStatusRepo = dataSource.getRepository(LookUpProfileStatusEntity);
    const providerTypeRepo = dataSource.getRepository(LookUpProviderTypeEntity);
    const companyTypeRepo = dataSource.getRepository(LookUpCompanyTypeEntity);
    const billingCycleRepo = dataSource.getRepository(LookUpBillingCycleEntity);

    await profileStatusRepo.upsert(profileStatusSeed, ['id']);
    await providerTypeRepo.upsert(providerTypeSeed, ['id']);
    await companyTypeRepo.upsert(companyTypeSeed, ['id']);
    await billingCycleRepo.upsert(billingCycleSeed, ['id']);

    console.log('Lookup tables seeded successfully');

    await dataSource.destroy();
    process.exit(0);
}

runSeed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});