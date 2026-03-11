import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LookUpBillingCycleEntity } from "../profile/lookup-tables/entities/lookup-biling-cycle.entity";
import { SubscriptionPlanFeatureEntity } from "./entity/subscription-plan-feature.entity";
import { SubscriptionPlanEntity } from "./entity/subscription-plan.entity";
import { CreatePlanDto } from "./dtos/create-plan.dto";
import { UpdatePlanDto } from "./dtos/update-plan.dto";
import { AddFeatureDto } from "./dtos/create-feature.dto";

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectRepository(SubscriptionPlanEntity)
        private planRepo: Repository<SubscriptionPlanEntity>,

        @InjectRepository(SubscriptionPlanFeatureEntity)
        private featureRepo: Repository<SubscriptionPlanFeatureEntity>,

        @InjectRepository(LookUpBillingCycleEntity)
        private billingRepo: Repository<LookUpBillingCycleEntity>,
    ) { }


    async getPlans() {

        const plans = await this.planRepo.find({
            where: { isActive: true },
            relations: ['features'],
            order: {
                features: {
                    displayOrder: 'ASC'
                }
            }
        });

        const billingCycles = await this.billingRepo.find({
            order: { months: 'ASC' }
        });

        const formattedPlans = plans.map(plan => ({
            id: plan.id,
            name: plan.name,
            monthlyPrice: Number(plan.monthlyPrice),
            bookingLimit: plan.bookingLimit,
            commissionPercent: plan.commissionPercent,
            isMostPopular: plan.isMostPopular,
            features: plan.features.map(f => f.featureText)
        }));

        return {
            plans: formattedPlans,
            billingCycles
        };
    }
    async createPlan(dto: CreatePlanDto) {
        const plan = this.planRepo.create(dto);
        return this.planRepo.save(plan);
    }

    async updatePlan(id: string, dto: UpdatePlanDto) {
        const plan = await this.planRepo.findOneBy({ id });
        if (!plan) {
            throw new NotFoundException(`Subscription plan with ID ${id} not found`);
        }
        await this.planRepo.update(id, dto);
        return this.planRepo.findOneBy({ id });
    }

    async deactivatePlan(id: string) {
        const plan = await this.planRepo.findOneBy({ id });
        if (!plan) {
            throw new NotFoundException(`Subscription plan with ID ${id} not found`);
        }
        await this.planRepo.update(id, { isActive: false });
    }

    async calculatePrice(planId: string, billingCycleId: string) {

        const plan = await this.planRepo.findOneBy({ id: planId });
        if (!plan) {
            throw new NotFoundException(`Subscription plan with ID ${planId} not found`);
        }

        const cycle = await this.billingRepo.findOneBy({ id: billingCycleId });
        if (!cycle) {
            throw new NotFoundException(`Billing cycle with ID ${billingCycleId} not found`);
        }

        const monthlyPrice = Number(plan.monthlyPrice);

        const basePrice = monthlyPrice * cycle.months;

        const discount = (basePrice * cycle.discountPercent) / 100;

        const finalPrice = basePrice - discount;

        return {
            planId,
            billingCycleId,
            months: cycle.months,
            monthlyPrice,
            basePrice,
            discountPercent: cycle.discountPercent,
            discount,
            finalPrice,
        };
    }

    async addFeature(planId: string, dto: AddFeatureDto) {
        const plan = await this.planRepo.findOneBy({ id: planId });
        if (!plan) {
            throw new NotFoundException(`Subscription plan with ID ${planId} not found`);
        }

        const feature = this.featureRepo.create({
            planId,
            featureText: dto.featureText,
            displayOrder: dto.displayOrder,
        });

        return this.featureRepo.save(feature);
    }

    async getPlan(id: string) {
        const plan = await this.planRepo.findOne({
            where: { id },
            relations: ['features']
        });

        if (!plan) {
            throw new NotFoundException(`Subscription plan with ID ${id} not found`);
        }

        return plan;
    }
}
