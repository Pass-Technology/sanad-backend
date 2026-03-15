import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from './entities/plan.entity';
import { FeatureEntity } from './entities/feature.entity';
import { PlanFeatureEntity } from './entities/plan-feature.entity';
import { PlanPriceEntity } from './entities/plan-price.entity';
import { LookUpBillingCycleEntity } from '../profile/lookup-tables/entities/lookup-biling-cycle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlanEntity,
      FeatureEntity,
      PlanFeatureEntity,
      PlanPriceEntity,
      LookUpBillingCycleEntity,
    ]),
  ],
  providers: [PlanService],
  controllers: [PlanController],
})
export class PlanModule {}
