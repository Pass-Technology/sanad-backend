import { LookUpPaymentEntity } from "../../../../modules/lookups/entities/lookup-payment.entity";
import { LookUpPaymentCategoryEntity } from "../../../../modules/lookups/entities/lookup-payment-category.entity";
import { DataSource } from "typeorm";
import { paymentLookupObjects, paymentLookupCategories } from "./payment.objects";

export async function paymentLookupSeed(dataSource: DataSource) {
    const categoryRepo = dataSource.getRepository(LookUpPaymentCategoryEntity);
    const paymentRepo = dataSource.getRepository(LookUpPaymentEntity);

    // save categories
    await categoryRepo.save(paymentLookupCategories);

    // save objects (will update if exists by ID or insert if not)
    await paymentRepo.save(paymentLookupObjects);
}
