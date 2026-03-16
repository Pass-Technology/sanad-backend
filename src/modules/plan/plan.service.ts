import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanEntity } from './entities/plan.entity';
import { BillingCycleEntity } from './entities/billing-cycle.entity';

@Injectable()
export class PlanService {
    constructor(
        @InjectRepository(PlanEntity)
        private readonly planRepo: Repository<PlanEntity>,
        @InjectRepository(BillingCycleEntity)
        private readonly billingCycleRepo: Repository<BillingCycleEntity>,
    ) { }

    async getPlanViews() {
        const cycles = await this.billingCycleRepo.find({
            where: { isActive: true },
            relations: {
                prices: {
                    plan: {
                        features: {
                            feature: true,
                        },
                    },
                },
            },
            order: {
                displayOrder: 'ASC',
                months: 'ASC',
            },
        });

        return cycles.map(cycle => ({
            id: cycle.id,
            labelEn: cycle.labelEn,
            labelAr: cycle.labelAr,
            months: cycle.months,
            discountPercentage: cycle.discountPercentage,
            badgeEn: cycle.badgeEn,
            badgeAr: cycle.badgeAr,
            plans: cycle.prices
                .filter(priceEntry => priceEntry.plan.isActive)
                .map(priceEntry => ({
                    id: priceEntry.plan.id,
                    nameEn: priceEntry.plan.nameEn,
                    nameAr: priceEntry.plan.nameAr,
                    descriptionEn: priceEntry.plan.descriptionEn,
                    descriptionAr: priceEntry.plan.descriptionAr,
                    tagEn: priceEntry.plan.tagEn,
                    tagAr: priceEntry.plan.tagAr,
                    price: priceEntry.price,
                    displayOrder: priceEntry.plan.displayOrder,
                    features: priceEntry.plan.features
                        .filter(pf => pf.feature?.isActive)
                        .map(pf => ({
                            id: pf.feature?.id,
                            nameEn: pf.feature.nameEn,
                            nameAr: pf.feature.nameAr,
                            value: pf.value,
                            displayOrder: pf.feature.displayOrder,
                        }))
                        .sort((a, b) => a.displayOrder - b.displayOrder),
                }))
                .sort((a, b) => (a.displayOrder - b.displayOrder) || (Number(a.price) - Number(b.price))),
        }));
    }

}
