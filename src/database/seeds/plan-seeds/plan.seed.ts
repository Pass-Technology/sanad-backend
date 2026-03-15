import { DataSource, In } from 'typeorm';
import { PlanEntity } from '../../../modules/plan/entities/plan.entity';
import { FeatureEntity } from '../../../modules/plan/entities/feature.entity';
import { PlanFeatureEntity } from '../../../modules/plan/entities/plan-feature.entity';
import { PlanPriceEntity } from '../../../modules/plan/entities/plan-price.entity';
import { plansObjects, featuresObjects, planFeaturesObjects, planPricesObjects } from './plan.objects';

export async function planSeed(dataSource: DataSource) {
  const planRepo = dataSource.getRepository(PlanEntity);
  const featureRepo = dataSource.getRepository(FeatureEntity);
  const planFeatureRepo = dataSource.getRepository(PlanFeatureEntity);
  const planPriceRepo = dataSource.getRepository(PlanPriceEntity);

  // Seed Features
  const featureIds = featuresObjects.map((f) => f.id);
  const dbFeatures = await featureRepo.find({ where: { id: In(featureIds) } });
  const featuresToInsert = featuresObjects.filter((f) => !dbFeatures.some((dbF) => dbF.id === f.id));
  if (featuresToInsert.length > 0) {
    await featureRepo.insert(featuresToInsert);
  }

  // Seed Plans
  const planIds = plansObjects.map((p) => p.id);
  const dbPlans = await planRepo.find({ where: { id: In(planIds) } });
  const plansToInsert = plansObjects.filter((p) => !dbPlans.some((dbP) => dbP.id === p.id));
  if (plansToInsert.length > 0) {
    await planRepo.insert(plansToInsert);
  }

  // Seed Plan Features
  const planFeatureIds = planFeaturesObjects.map((pf) => pf.id);
  const dbPlanFeatures = await planFeatureRepo.find({ where: { id: In(planFeatureIds) } });
  const planFeaturesToInsert = planFeaturesObjects.filter((pf) => !dbPlanFeatures.some((dbPF) => dbPF.id === pf.id));
  if (planFeaturesToInsert.length > 0) {
    await planFeatureRepo.insert(planFeaturesToInsert);
  }

  // Seed Plan Prices
  const planPriceIds = planPricesObjects.map((pp) => pp.id);
  const dbPlanPrices = await planPriceRepo.find({ where: { id: In(planPriceIds) } });
  const planPricesToInsert = planPricesObjects.filter((pp) => !dbPlanPrices.some((dbPP) => dbPP.id === pp.id));
  if (planPricesToInsert.length > 0) {
    await planPriceRepo.insert(planPricesToInsert);
  }
}
