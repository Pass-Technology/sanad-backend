import { LookUpProviderTypeEntity } from "src/modules/profile/lookup-tables/entities/lookup-provider-type.entity";
import { DataSource, In } from "typeorm";
import { providerTypeObjects } from "./provider-type.objects";

export async function providerTypeSeed(dataSource: DataSource) {
    const providerTypeRepo = dataSource.getRepository(LookUpProviderTypeEntity);

    const providerTypeKeys = providerTypeObjects.map(cycle => cycle.labelEn);

    // find all cycles
    const dbcycles = await providerTypeRepo.find({ where: { labelEn: In(providerTypeKeys) } });

    // filter objects that are not in db
    const objectsToInsert = providerTypeObjects.filter(cycle => !dbcycles.some(dbcycle => dbcycle.labelEn === cycle.labelEn));

    // insert objects
    await providerTypeRepo.insert(objectsToInsert);
}