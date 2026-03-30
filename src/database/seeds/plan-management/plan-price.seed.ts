import { DataSource } from "typeorm";
import { PlanPriceEntity } from "../../../modules/plan/entities/plan-price.entity";
import { billingCycles } from "./billing-cycle.seed";
import { individualPlans, companyPlans } from "./plan.seed";

export async function planPriceSeed(dataSource: DataSource) {
    const repo = dataSource.getRepository(PlanPriceEntity);

    // Clear existing prices to avoid duplicates from previous seeds
    // Use CASCADE for a clean start in dev environments
    await repo.query('TRUNCATE TABLE plan_prices RESTART IDENTITY CASCADE');

    const individualBasePrices = [
        // Individual Plans
        { planId: individualPlans[0].id, monthlyPrice: 199 },
        { planId: individualPlans[1].id, monthlyPrice: 499 },
        { planId: individualPlans[2].id, monthlyPrice: 999 },

    ];

    const companyBasePrices = [
        // Company Plans
        // Company Plans
        { planId: companyPlans[0].id, monthlyPrice: 299 },
        { planId: companyPlans[1].id, monthlyPrice: 699 },
        { planId: companyPlans[2].id, monthlyPrice: 1499 },
    ];

    // for (const individualPlan of individualPlans) {
    //     for (const billingCycle of billingCycles) {
    //         const discountedPrice = individualPlan.price * (1 - (billingCycle.discountPercentage || 0) / 100);
    //         await repo.save(repo.create({
    //             plan: { id: individualPlan.id },
    //             billingCycle: { id: billingCycle.id },
    //             price: discountedPrice
    //         }));
    //     }
    // }
    const prices: PlanPriceEntity[] = [];
    for (const cycle of billingCycles) {

        for (const base of individualBasePrices) {
            const discountedPrice = base.monthlyPrice * (1 - (cycle.discountPercentage || 0) / 100);

            const price = repo.create({
                plan: { id: base.planId },
                billingCycle: { id: cycle.id },
                price: discountedPrice
            });
            prices.push(price);
        }

        for (const base of companyBasePrices) {
            const discountedPrice = base.monthlyPrice * (1 - (cycle.discountPercentage || 0) / 100);

            const price = repo.create({
                plan: { id: base.planId },
                billingCycle: { id: cycle.id },
                price: discountedPrice
            });
            prices.push(price);
        }

    }

    await repo.save(prices);
}
