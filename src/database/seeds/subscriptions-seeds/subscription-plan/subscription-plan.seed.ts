import { SubscriptionPlanEntity } from "../../../../modules/subscription/entity/subscription-plan.entity";
import { DataSource, In } from "typeorm";
import { subscriptionPlanObjects } from "./subscription-plan.objects";

export async function subscriptionPlanSeed(dataSource: DataSource) {
    const subscriptionPlanRepo = dataSource.getRepository(SubscriptionPlanEntity);

    const planIds = subscriptionPlanObjects.map(plan => plan.id);

    // find all plans
    const dbPlans = await subscriptionPlanRepo.find({ where: { id: In(planIds) } });

    // filter objects that are not in db
    const objectsToInsert = subscriptionPlanObjects.filter(plan => !dbPlans.some(dbPlan => dbPlan.id === plan.id));

    // insert objects
    if (objectsToInsert.length > 0) {
        await subscriptionPlanRepo.insert(objectsToInsert);
    }
}
