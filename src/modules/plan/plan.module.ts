import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from './entities/plan.entity';
import { PlanPriceEntity } from './entities/plan-price.entity';
import { PlanFeatureEntity } from './entities/plan-feature.entity';
import { FeatureEntity } from './entities/features.entity';
import { BillingCycleEntity } from './entities/billing-cycle.entity';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { SubscriptionEntity } from 'src/subscription/entities/subscription.entity';
// import { PlanService } from './plan.service';
// import { PlanController } from './plan.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PlanEntity, // what the plan is with its prices and features
            PlanPriceEntity, // the prices of each plan and billing cycles
            PlanFeatureEntity, // the specific features of each plan
            FeatureEntity, // what each feature is (name-discription- ...etc)
            BillingCycleEntity, // what are the billing cycles
            SubscriptionEntity, // what what is subscriptoin with its owner (user) and price 
        ]),
    ],
    providers: [PlanService],
    controllers: [PlanController],
    exports: [PlanService],
})
export class PlanModule { }
