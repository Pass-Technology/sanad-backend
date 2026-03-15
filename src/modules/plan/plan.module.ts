import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from './entities/plan.entity';
import { PlanPriceEntity } from './entities/plan-price.entity';
import { PlanFeatureEntity } from './entities/plan-feature.entity';
import { FeatureEntity } from './entities/features.entity';
import { BillingCycleEntity } from '../billing-cycle/entities/billing-cycle.entity';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
// import { PlanService } from './plan.service';
// import { PlanController } from './plan.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PlanEntity,
            PlanPriceEntity,
            PlanFeatureEntity,
            FeatureEntity,
            BillingCycleEntity,
        ]),
    ],
    providers: [PlanService],
    controllers: [PlanController],
    exports: [PlanService],
})
export class PlanModule { }
