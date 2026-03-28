import { DataSource } from "typeorm";
import { PlanPriceEntity } from "../../../modules/plan/entities/plan-price.entity";
import { billingCycles } from "./billing-cycle.seed";
import { individualPlans, companyPlans } from "./plan.seed";

export async function planPriceSeed(dataSource: DataSource) {
    const repo = dataSource.getRepository(PlanPriceEntity);

    const basePrices = [
        // Individual Plans
        { planId: individualPlans[0].id, monthlyPrice: 199 },
        { planId: individualPlans[1].id, monthlyPrice: 499 },
        { planId: individualPlans[2].id, monthlyPrice: 999 },
        // Company Plans
        { planId: companyPlans[0].id, monthlyPrice: 299 },
        { planId: companyPlans[1].id, monthlyPrice: 699 },
        { planId: companyPlans[2].id, monthlyPrice: 1499 },
    ];

    for (const base of basePrices) {
        for (const cycle of billingCycles) {
            // Apply discount
            const discountedPrice = base.monthlyPrice * (1 - cycle.discountPercentage / 100);
            const totalForCycle = discountedPrice * cycle.months;

            let entry = await repo.findOne({ 
                where: { 
                    plan: { id: base.planId }, 
                    billingCycle: { id: cycle.id } 
                } 
            });
            if (entry) {
                entry.price = discountedPrice; 
                await repo.save(entry);
            } else {
                await repo.save(repo.create({
                    plan: { id: base.planId },
                    billingCycle: { id: cycle.id },
                    price: discountedPrice
                }));
            }

        }
    }
}
