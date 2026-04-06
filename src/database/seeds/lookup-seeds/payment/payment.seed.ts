import { LookUpPaymentEntity } from "../../../../modules/lookups/entities/lookup-payment.entity";
import { DataSource } from "typeorm";
import { paymentLookupObjects } from "./payment.objects";

export async function paymentLookupSeed(dataSource: DataSource) {
    const paymentRepo = dataSource.getRepository(LookUpPaymentEntity);

    // save objects (will update if exists by ID or insert if not)
    await paymentRepo.save(paymentLookupObjects);
}
