import { Column, Entity, OneToMany } from "typeorm";
import { LookupBaseEntity } from "./lookup-base.entity";
// import { ProviderSubscriptionEntity } from "../../entities/provider-subscription.entity";

@Entity('lookup_billing_cycle')
export class LookUpBillingCycleEntity extends LookupBaseEntity {
    @Column({ type: 'int' })
    months: number;

    @Column({ type: 'int', default: 0 })
    discountPercent: number;

    @Column({ type: 'varchar', nullable: true })
    badgeEn: string | null;

    @Column({ type: 'varchar', nullable: true })
    badgeAr: string | null;

    // @OneToMany(() => ProviderSubscriptionEntity, (sub) => sub.billingCycleId)
    // subscriptions: ProviderSubscriptionEntity[];


    subscriptions: string[];
}
