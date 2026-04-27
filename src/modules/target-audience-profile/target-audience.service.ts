import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TargetAudienceProfile } from "./entities/target-audience.entity";
import { ProfileRepository } from "../profile/profile.repository";
import { UpdateBasicInfoDto } from "./dto/update-basic-info.dto";
import { UpdateServicesDto } from "./dto/update-services.dto";
import { UpdateOperationsDto } from "./dto/update-operations.dto";
import { UpdateCustomerProfileDto } from "./dto/update-customer-profile.dto";
import { UpdatePurchasingDto } from "./dto/update-purchasing.dto";
import { BasicInfo, CustomerProfile, Operations, PurchasingBehavior, Services, NumericRange } from "./types/target-audience-profile-sections.types";

@Injectable()
export class TargetAudienceService {

    constructor(
        @InjectRepository(TargetAudienceProfile)
        private readonly targetAudienceProfileRepository: Repository<TargetAudienceProfile>,
        private readonly profileRepository: ProfileRepository,
    ) { }

    private async getOrCreateProfile(userId: string): Promise<TargetAudienceProfile> {
        const profile = await this.targetAudienceProfileRepository.findOne({
            where: { providerProfile: { user: { id: userId } } },
            relations: {
                providerProfile: true
            }
        });

        if (profile) return profile;

        const providerProfile = await this.profileRepository.findProfileByUserId(userId);
        if (!providerProfile) {
            throw new NotFoundException('Provider profile not found');
        }

        const newProfile = this.targetAudienceProfileRepository.create({
            providerProfile,
            basicInfo: {} as any,
            services: {} as any,
            operations: {} as any,
            customer: {} as any,
            purchasing: {} as any,
            strategy: {} as any,
        });

        return await this.targetAudienceProfileRepository.save(newProfile);
    }

    async getProfile(userId: string) {
        const profile = await this.getOrCreateProfile(userId);
        return {
            ...profile,
            completionPercentage: this.calculateCompletion(profile)
        };
    }

    async updateBasicInfo(userId: string, dto: UpdateBasicInfoDto) {
        const profile = await this.getOrCreateProfile(userId);
        profile.basicInfo = {
            ...profile.basicInfo,
            ageGroups: { 
                from: dto.age_from !== undefined ? dto.age_from : (profile.basicInfo?.ageGroups?.from || 0), 
                to: dto.age_to !== undefined ? dto.age_to : (profile.basicInfo?.ageGroups?.to || 0) 
            },
            ...(dto.gender !== undefined && { gender: dto.gender as any }),
            ...(dto.residency_status !== undefined && { residencyStatus: dto.residency_status as any }),
            ...(dto.education_level !== undefined && { educationLevel: dto.education_level as any }),
            ...(dto.income_level !== undefined && { incomeLevel: dto.income_level as any })
        };
        return await this.saveAndCalculateCompletion(profile);
    }

    async updateServices(userId: string, dto: UpdateServicesDto) {
        const profile = await this.getOrCreateProfile(userId);
        profile.services = {
            ...profile.services,
            ...(dto.home_service !== undefined && { homeService: dto.home_service }),
            ...(dto.product_delivery !== undefined && { productDelivery: dto.product_delivery })
        };
        return await this.saveAndCalculateCompletion(profile);
    }

    async updateOperations(userId: string, dto: UpdateOperationsDto) {
        const profile = await this.getOrCreateProfile(userId);
        profile.operations = {
            ...profile.operations,
            ...(dto.daily_capacity !== undefined && { dailyCapacity: dto.daily_capacity }),
            ...(dto.working_hours !== undefined && { workingHours: dto.working_hours as any }),
            ...(dto.work_structure !== undefined && { workStructure: dto.work_structure as any }),
            ...(dto.has_transportation !== undefined && { hasTransportation: dto.has_transportation })
        };
        return await this.saveAndCalculateCompletion(profile);
    }

    async updateCustomerProfile(userId: string, dto: UpdateCustomerProfileDto) {
        const profile = await this.getOrCreateProfile(userId);
        profile.customer = {
            ...profile.customer,
            ...(dto.categories !== undefined && { categories: dto.categories as any }),
            ...(dto.dominant_gender !== undefined && { dominantGender: dto.dominant_gender as any }),
            ...(dto.age_range !== undefined && { ageRange: dto.age_range as any }),
            ...(dto.nationalities !== undefined && { nationalities: dto.nationalities as any }),
            ...(dto.delivery_locations !== undefined && { deliveryLocations: dto.delivery_locations as any }),
            ...(dto.income_level !== undefined && { incomeLevel: dto.income_level as any }),
            ...(dto.highest_demand_cities !== undefined && { highestDemandCities: dto.highest_demand_cities as any }),
            ...(dto.lead_sources !== undefined && { leadSources: dto.lead_sources as any })
        };
        return await this.saveAndCalculateCompletion(profile);
    }

    async updatePurchasing(userId: string, dto: UpdatePurchasingDto) {
        const profile = await this.getOrCreateProfile(userId);

        let avgOrderValueRange: NumericRange | undefined;
        if (dto.avg_order_value) {
            const mappings: Record<string, NumericRange> = {
                '<100': { min: 0, max: 100, label: '<100' },
                '100-300': { min: 100, max: 300, label: '100-300' },
                '300-700': { min: 300, max: 700, label: '300-700' },
                '>700': { min: 700, max: undefined, label: '>700' },
            };
            avgOrderValueRange = mappings[dto.avg_order_value];
        }

        profile.purchasing = {
            ...profile.purchasing,
            ...(avgOrderValueRange && { avgOrderValue: avgOrderValueRange }),
            ...(dto.reason_for_choosing !== undefined && { reasonsForChoosing: dto.reason_for_choosing as any }),
            ...(dto.peak_demand_time !== undefined && { peakDemandTime: dto.peak_demand_time as any }),
            ...(dto.is_seasonal !== undefined && { isSeasonal: dto.is_seasonal }),
            ...(dto.customer_retention !== undefined && { customerRetention: dto.customer_retention as any }),
            ...(dto.response_to_price_increase !== undefined && { responseToPriceIncrease: dto.response_to_price_increase as any })
        };
        return await this.saveAndCalculateCompletion(profile);
    }

    private async saveAndCalculateCompletion(profile: TargetAudienceProfile) {
        const savedProfile = await this.targetAudienceProfileRepository.save(profile);
        return {
            ...savedProfile,
            completionPercentage: this.calculateCompletion(savedProfile)
        };
    }

    private calculateCompletion(profile: TargetAudienceProfile): number {
        const sections = [
            profile.basicInfo,
            profile.services,
            profile.operations,
            profile.customer,
            profile.purchasing
        ];

        const filledSections = sections.filter(s => s && Object.keys(s).length > 0).length;
        return Math.round((filledSections / sections.length) * 100);
    }
}