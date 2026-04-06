import { Entity, OneToMany } from "typeorm";
import { LookUpPaymentEntity } from "./lookup-payment.entity";
import { LookupBaseEntity } from "./lookup-base.entity";

@Entity('lookup_payment_category')
export class LookUpPaymentCategoryEntity extends LookupBaseEntity {
    @OneToMany(() => LookUpPaymentEntity, (payment) => payment.category)
    payments: LookUpPaymentEntity[];
}
