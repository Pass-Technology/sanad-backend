import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

import { SubscriptionPlanEntity } from './entity/subscription-plan.entity';
import { SubscriptionPlanFeatureEntity } from './entity/subscription-plan-feature.entity';
import { LookUpBillingCycleEntity } from '../profile/lookup-tables/entities/lookup-biling-cycle.entity';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SubscriptionPlanEntity,
            SubscriptionPlanFeatureEntity,
            LookUpBillingCycleEntity,
        ]),
        UserModule,
    ],
    controllers: [SubscriptionController],
    providers: [SubscriptionService],
    exports: [SubscriptionService],
})
export class SubscriptionModule { }