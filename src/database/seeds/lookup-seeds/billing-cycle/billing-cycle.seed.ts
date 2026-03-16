import { LookUpBillingCycleEntity } from "src/modules/profile/lookup-tables/entities/lookup-biling-cycle.entity";
import { DataSource, In } from "typeorm";
import { billingCycleObjects } from "./billing-cycle.objects";


export async function billingCycleSeed(dataSource: DataSource) {
    const billingCycleRepo = dataSource.getRepository(LookUpBillingCycleEntity);

    // save objects (will update if exists by ID or insert if not)
    await billingCycleRepo.save(billingCycleObjects);
}