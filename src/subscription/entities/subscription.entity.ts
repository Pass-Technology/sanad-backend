import { BaseEntity } from "../../database/base-entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { PlanPriceEntity } from "../../modules/plan/entities/plan-price.entity";
import { UserEntity } from "../../modules/user/entities/user.entity";


@Entity('subscriptions')
export class SubscriptionEntity extends BaseEntity {

    @Column({ type: 'timestamp' })
    startDate: Date;

    @Column({ type: 'timestamp', nullable: true })
    endDate: Date;

    @Column({ default: 'active' })
    status: string;

    @ManyToOne(() => PlanPriceEntity)
    @JoinColumn({ name: 'plan_price_id' })
    planPrice: PlanPriceEntity;

    @ManyToOne(() => UserEntity, (user) => user.subscriptions)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
}