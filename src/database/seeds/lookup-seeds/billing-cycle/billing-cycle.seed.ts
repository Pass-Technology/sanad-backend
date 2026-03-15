import { LookUpBillingCycleEntity } from "src/modules/profile/lookup-tables/entities/lookup-biling-cycle.entity";
import { DataSource, In } from "typeorm";
import { billingCycleObjects } from "./billing-cycle.objects";


export async function billingCycleSeed(dataSource: DataSource) {
    const billingCycleRepo = dataSource.getRepository(LookUpBillingCycleEntity);

    const billingCycleKeys = billingCycleObjects.map(cycle => cycle.labelEn);

    for (const object of billingCycleObjects) {
        let cycle = await billingCycleRepo.findOne({ where: { labelEn: object.labelEn } });
        if (cycle) {
            // Update existing record with the standard UUID
            Object.assign(cycle, object);
            await billingCycleRepo.save(cycle);
        } else {
            // Create new record
            await billingCycleRepo.save(billingCycleRepo.create(object));
        }
    }
}