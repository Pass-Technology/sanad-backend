import { LookUpBillingCycleEntity } from "src/modules/profile/lookup-tables/entities/lookup-biling-cycle.entity";
import { DataSource, In } from "typeorm";
import { billingCycleObjects } from "./billing-cycle.objects";


export async function billingCycleSeed(dataSource: DataSource) {
    const billingCycleRepo = dataSource.getRepository(LookUpBillingCycleEntity);

    const billingCycleKeys = billingCycleObjects.map(cycle => cycle.labelEn);

    // find all cycles
    const dbcycles = await billingCycleRepo.find({ where: { labelEn: In(billingCycleKeys) } });

    // filter objects that are not in db
    const objectsToInsert = billingCycleObjects.filter(cycle => !dbcycles.some(dbcycle => dbcycle.labelEn === cycle.labelEn));

    // insert objects
    await billingCycleRepo.insert(objectsToInsert);
}