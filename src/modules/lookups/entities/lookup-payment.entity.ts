import { Entity, ManyToOne, JoinColumn, Column } from "typeorm";
import { LookUpPaymentCategoryEntity } from "./lookup-payment-category.entity";
import { LookupBaseEntity } from "./lookup-base.entity";

@Entity('lookup_payment')
export class LookUpPaymentEntity extends LookupBaseEntity {
    @Column({ name: 'category_id', nullable: true })
    categoryId: string;

    @ManyToOne(() => LookUpPaymentCategoryEntity, (category) => category.payments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'category_id' })
    category: LookUpPaymentCategoryEntity;
}
