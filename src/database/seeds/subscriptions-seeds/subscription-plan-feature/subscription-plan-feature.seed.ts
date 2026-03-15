import { SubscriptionPlanFeatureEntity } from "../../../../modules/subscription/entity/subscription-plan-feature.entity";
import { DataSource } from "typeorm";
import { subscriptionPlanFeatureObjects } from "./subscription-plan-feature.objects";

export async function subscriptionPlanFeatureSeed(dataSource: DataSource) {
    const featureRepo = dataSource.getRepository(SubscriptionPlanFeatureEntity);

    for (const featureObj of subscriptionPlanFeatureObjects) {
        const existing = await featureRepo.findOne({
            where: {
                plan: { id: featureObj.planId },
                featureText: featureObj.featureText
            }
        });

        if (!existing) {
            await featureRepo.save(
                featureRepo.create({
                    plan: { id: featureObj.planId },
                    featureText: featureObj.featureText,
                    displayOrder: featureObj.displayOrder
                })
            );
        }
    }
}
