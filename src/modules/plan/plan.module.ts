import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from './entities/plan.entity';
import { PlanPriceEntity } from './entities/plan-price.entity';
import { PlanFeatureEntity } from './entities/plan-feature.entity';
import { BillingCycleEntity } from './entities/billing-cycle.entity';
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
            BillingCycleEntity,
        ]),
    ],
    providers: [PlanService],
    controllers: [PlanController],
    exports: [PlanService],
})
export class PlanModule { }
