import { DataSource } from "typeorm";
import { PlanPriceEntity } from "../../../modules/plan/entities/plan-price.entity";
import { billingCycles } from "./billing-cycle.seed";

export async function planPriceSeed(dataSource: DataSource) {
    const repo = dataSource.getRepository(PlanPriceEntity);

    const starterId = '11111111-0000-0000-0000-000000000001';
    const profId = '22222222-0000-0000-0000-000000000002';
    const entId = '33333333-0000-0000-0000-000000000003';

    const basePrices = [
        { planId: starterId, monthlyPrice: 199 },
        { planId: profId, monthlyPrice: 499 },
        { planId: entId, monthlyPrice: 999 },
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
