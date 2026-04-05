import { LookUpProviderTypeEntity } from "../../../../modules/lookups/entities/lookup-provider-type.entity";
import { DataSource, In } from "typeorm";
import { providerTypeObjects } from "./provider-type.objects";

export async function providerTypeSeed(dataSource: DataSource) {
    const providerTypeRepo = dataSource.getRepository(LookUpProviderTypeEntity);

    // save objects (will update if exists by ID or insert if not)
    await providerTypeRepo.save(providerTypeObjects);
}