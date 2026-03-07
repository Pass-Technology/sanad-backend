import AppDataSource from '../data-source';
import { profileStatusSeed, providerTypeSeed, companyTypeSeed, billingCycleSeed } from './lookup.seed';
import { LookUpProfileStatus } from '../../lookup/entities/lookup-profile-status.entity';
import { LookUpProviderType } from '../../lookup/entities/lookup-provider-type.entity';
import { LookUpCompanyType } from '../../lookup/entities/lookup-company-type.entity';
import { LookUpBillingCycle } from 'src/lookup/entities/lookup-biling-cycle.entity';


async function runSeed() {
    const dataSource = await AppDataSource.initialize();

    const profileStatusRepo = dataSource.getRepository(LookUpProfileStatus);
    const providerTypeRepo = dataSource.getRepository(LookUpProviderType);
    const companyTypeRepo = dataSource.getRepository(LookUpCompanyType);
    const billingCycleRepo = dataSource.getRepository(LookUpBillingCycle);

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