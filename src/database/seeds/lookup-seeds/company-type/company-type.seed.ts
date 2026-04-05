import { LookUpCompanyTypeEntity } from "../../../../modules/lookups/entities/lookup-company-type.entity";
import { DataSource, In } from "typeorm";
import { companyTypeObjects } from "./company-type.objects";

export async function companyTypeSeed(dataSource: DataSource) {
    const companyTypeRepo = dataSource.getRepository(LookUpCompanyTypeEntity);

    // save objects (will update if exists by ID or insert if not)
    await companyTypeRepo.save(companyTypeObjects);
}