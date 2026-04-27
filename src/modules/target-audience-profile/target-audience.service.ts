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
import { BasicInfo, CustomerProfile, NumericRange, Operations, PurchasingBehavior, Services, Strategy } from "./types/target-audience-profile-sections.types";
import { UpdateTargetAudienceDto } from "./dto/UpdateTargetAudience.dto";

@Injectable()
export class TargetAudienceService {

    constructor(
        @InjectRepository(TargetAudienceProfile)
        private readonly targetAudienceProfileRepository: Repository<TargetAudienceProfile>,
        private readonly profileRepository: ProfileRepository,
    ) { }

    private async getOrCreateProfile(userId: string): Promise<TargetAudienceProfile> {
        const targetAudienceProfile = await this.targetAudienceProfileRepository.findOne({
            where: { providerProfile: { user: { id: userId } } },
            relations: ['providerProfile']
        });

        if (targetAudienceProfile) return targetAudienceProfile;

        const providerProfile = await this.profileRepository.findProfileByUserId(userId);
        if (!providerProfile) {
            throw new NotFoundException('Provider profile not found');
        }

        const newProfile = this.targetAudienceProfileRepository.create({
            providerProfile,
            basicInfo: {} as BasicInfo,
            services: {} as Services,
            operations: {} as Operations,
            customer: {} as CustomerProfile,
            purchasing: {} as PurchasingBehavior,
            strategy: { status: 'Later' } as Strategy,
        });

        return await this.targetAudienceProfileRepository.save(newProfile);
    }

    async getProfile(userId: string) {
        return await this.getOrCreateProfile(userId);
    }

    async updateProfile(userId: string, dto: UpdateTargetAudienceDto) {
        const profile = await this.getOrCreateProfile(userId);

        if (dto.basicInfo) this.updateBasicInfoSection(profile, dto.basicInfo);
        if (dto.services) this.updateServicesSection(profile, dto.services);
        if (dto.operations) this.updateOperationsSection(profile, dto.operations);
        if (dto.customer) this.updateCustomerSection(profile, dto.customer);
        if (dto.purchasing) this.updatePurchasingSection(profile, dto.purchasing);
        if (dto.strategy) {
            profile.strategy = {
                ...profile.strategy,
                ...dto.strategy
            };
        }
        return await this.targetAudienceProfileRepository.save(profile);
    }


    private updateBasicInfoSection(profile: TargetAudienceProfile, dto: UpdateBasicInfoDto) {
        profile.basicInfo = {
            ...profile.basicInfo,
            ageGroups: {
                from: dto.age_from !== undefined ? dto.age_from : (profile.basicInfo?.ageGroups?.from || 0),
                to: dto.age_to !== undefined ? dto.age_to : (profile.basicInfo?.ageGroups?.to || 0)
            },
            ...(dto.gender !== undefined && { gender: dto.gender }),
            ...(dto.residency_status !== undefined && { residencyStatus: dto.residency_status }),
            ...(dto.education_level !== undefined && { educationLevel: dto.education_level }),
            ...(dto.income_level !== undefined && { incomeLevel: dto.income_level })
        };
    }

    private updateServicesSection(profile: TargetAudienceProfile, dto: UpdateServicesDto) {
        profile.services = {
            ...profile.services,
            ...(dto.home_service !== undefined && { homeService: dto.home_service }),
            ...(dto.product_delivery !== undefined && { productDelivery: dto.product_delivery })
        };
    }

    private updateOperationsSection(profile: TargetAudienceProfile, dto: UpdateOperationsDto) {
        profile.operations = {
            ...profile.operations,
            ...(dto.daily_capacity !== undefined && { dailyCapacity: dto.daily_capacity }),
            ...(dto.working_hours !== undefined && { workingHours: dto.working_hours }),
            ...(dto.work_structure !== undefined && { workStructure: dto.work_structure }),
            ...(dto.has_transportation !== undefined && { hasTransportation: dto.has_transportation })
        };
    }

    private updateCustomerSection(profile: TargetAudienceProfile, dto: UpdateCustomerProfileDto) {
        profile.customer = {
            ...profile.customer,
            ...(dto.categories !== undefined && { categories: dto.categories }),
            ...(dto.dominant_gender !== undefined && { dominantGender: dto.dominant_gender }),
            ...(dto.age_range !== undefined && { ageRange: dto.age_range }),
            ...(dto.nationalities !== undefined && { nationalities: dto.nationalities }),
            ...(dto.delivery_locations !== undefined && { deliveryLocations: dto.delivery_locations }),
            ...(dto.income_level !== undefined && { incomeLevel: dto.income_level }),
            ...(dto.highest_demand_cities !== undefined && { highestDemandCities: dto.highest_demand_cities }),
            ...(dto.lead_sources !== undefined && { leadSources: dto.lead_sources })
        };
    }

    private updatePurchasingSection(profile: TargetAudienceProfile, dto: UpdatePurchasingDto) {
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
            ...(dto.reason_for_choosing !== undefined && { reasonsForChoosing: dto.reason_for_choosing }),
            ...(dto.peak_demand_time !== undefined && { peakDemandTime: dto.peak_demand_time }),
            ...(dto.is_seasonal !== undefined && { isSeasonal: dto.is_seasonal }),
            ...(dto.customer_retention !== undefined && { customerRetention: dto.customer_retention }),
            ...(dto.response_to_price_increase !== undefined && { responseToPriceIncrease: dto.response_to_price_increase })
        };
    }
}