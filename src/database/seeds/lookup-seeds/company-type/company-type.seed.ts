import { LookUpCompanyTypeEntity } from "src/modules/profile/lookup-tables/entities/lookup-company-type.entity";
import { DataSource, In } from "typeorm";
import { companyTypeObjects } from "./company-type.objects";

export async function companyTypeSeed(dataSource: DataSource) {
    const companyTypeRepo = dataSource.getRepository(LookUpCompanyTypeEntity);

    const companyTypeKeys = companyTypeObjects.map(cycle => cycle.labelEn);

    // find all cycles
    const dbcycles = await companyTypeRepo.find({ where: { labelEn: In(companyTypeKeys) } });

    // filter objects that are not in db
    const objectsToInsert = companyTypeObjects.filter(cycle => !dbcycles.some(dbcycle => dbcycle.labelEn === cycle.labelEn));

    // insert objects
    await companyTypeRepo.insert(objectsToInsert);
}