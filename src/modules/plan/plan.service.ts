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

    async getPlanViews(lang: string = 'en') {
        const isAr = lang === 'ar';
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
            label: isAr ? cycle.labelAr : cycle.labelEn,
            months: cycle.months,
            discountPercentage: cycle.discountPercentage,
            badge: isAr ? cycle.badgeAr : cycle.badgeEn,
            plans: cycle.prices
                .filter(priceEntity => priceEntity.plan.isActive)
                .map(priceEntity => ({
                    id: priceEntity.plan.id,
                    name: isAr ? priceEntity.plan.nameAr : priceEntity.plan.nameEn,
                    description: isAr ? priceEntity.plan.descriptionAr : priceEntity.plan.descriptionEn,
                    tag: isAr ? priceEntity.plan.tagAr : priceEntity.plan.tagEn,
                    price: priceEntity.price,
                    displayOrder: priceEntity.plan.displayOrder,
                    features: priceEntity.plan.features
                        .filter(pf => pf.feature?.isActive)
                        .map(pf => ({
                            id: pf.feature?.id,
                            name: isAr ? pf.feature.nameAr : pf.feature.nameEn,
                            value: pf.value,
                            displayOrder: pf.feature.displayOrder,
                        }))
                        .sort((a, b) => a.displayOrder - b.displayOrder),
                }))
                .sort((a, b) => (a.displayOrder - b.displayOrder) || (Number(a.price) - Number(b.price))),
        }));
    }

}
