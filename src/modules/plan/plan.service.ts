import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanEntity } from './entities/plan.entity';
import { BillingCycleEntity } from './entities/billing-cycle.entity';
import { LookUpProviderTypeEntity } from '../profile/lookup-tables/entities/lookup-provider-type.entity';
import { localize } from '../../shared/localization.util';

@Injectable()
export class PlanService {
    constructor(
        @InjectRepository(PlanEntity)
        private readonly planRepo: Repository<PlanEntity>,
        @InjectRepository(BillingCycleEntity)
        private readonly billingCycleRepo: Repository<BillingCycleEntity>,

        @InjectRepository(LookUpProviderTypeEntity)
        private readonly lookUpProviderTypeRepo: Repository<LookUpProviderTypeEntity>,
    ) { }

    async getPlanViews(lang: string = 'en') {

        const queryBuilder = this.lookUpProviderTypeRepo
            .createQueryBuilder('pt')
            .leftJoinAndSelect('pt.billingCycles', 'bc')
            .leftJoinAndSelect('bc.prices', 'pp')
            .innerJoinAndSelect('pp.plan', 'p', 'p.providerType = pt.id')
            .leftJoinAndSelect('p.features', 'f')
            .orderBy('pt.id', 'ASC')
            .addOrderBy('bc.months', 'ASC')
            .addOrderBy('p.id', 'ASC');

        const providerTypes = await queryBuilder.getMany();

        // const providerTypes = await this.lookUpProviderTypeRepo.find({
        //     relations: {
        //         plans: {
        //             features: true,
        //             prices: {
        //                 billingCycle: true
        //             }
        //         },
        //         // billingCycles: true
        //     }
        // });
        return localize(providerTypes, lang);


        // const cycles = await this.billingCycleRepo.find({
        //     where: { isActive: true },
        //     relations: {
        //         prices: {
        //             plan: {
        //                 features: true,
        //             },
        //         },
        //     },
        //     order: {
        //         displayOrder: 'ASC',
        //         months: 'ASC',
        //     },
        // });

        // return cycles.map(cycle => ({
        //     id: cycle.id,
        //     label: isAr ? cycle.labelAr : cycle.labelEn,
        //     months: cycle.months,
        //     discountPercentage: cycle.discountPercentage,
        //     badge: isAr ? cycle.badgeAr : cycle.badgeEn,
        //     plans: cycle.prices
        //         .filter(priceEntry => priceEntry.plan.isActive)
        //         .map(priceEntry => ({
        //             id: priceEntry.plan.id,
        //             name: isAr ? priceEntry.plan.nameAr : priceEntry.plan.nameEn,
        //             description: isAr ? priceEntry.plan.descriptionAr : priceEntry.plan.descriptionEn,
        //             tag: isAr ? priceEntry.plan.tagAr : priceEntry.plan.tagEn,
        //             price: priceEntry.price,
        //             displayOrder: priceEntry.plan.displayOrder,
        //             features: priceEntry.plan.features
        //                 .filter(pf => pf.isActive)
        //                 .map(pf => ({
        //                     id: pf.id,
        //                     name: isAr ? pf.nameAr : pf.nameEn,
        //                     value: isAr ? pf.valueAr : pf.valueEn,
        //                     displayOrder: pf.displayOrder,
        //                 }))
        //                 .sort((a, b) => a.displayOrder - b.displayOrder),
        //         }))
        //         .sort((a, b) => (a.displayOrder - b.displayOrder) || (Number(a.price) - Number(b.price))),
        // }));
    }

}
