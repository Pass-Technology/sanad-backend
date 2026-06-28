import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { ProfileRepository } from './profile.repository';
import { UserRepository } from '../user/user.repository';
import { ProfileChangeType } from './enums/profile-change-type.enum';
import { ProfileStatusStaticCode } from '../lookups/enums/lookup-static-codes.enum';
import { CreateFullProfileDto } from './dto/create-full-profile.dto';
import { CreateCompanyInfoDto } from './dto/create-company-info.dto';
import {
    UpdateCompanyInfoDto,
    UpdateUserInfoDto,
    UpdateComplianceDto,
    UpdateBranchDto,
    UpdateBranchesDto,
} from './dto/update-full-profile.dto';

import { ProviderProfileEntity } from './entities/provider-profile.entity';
import { ProviderUserInfoEntity } from './entities/provider-user-info.entity';
import { ProviderComplianceEntity } from './entities/provider-compliance.entity';
import { ProviderServiceEntity } from '../service-management/entities/provider-service.entity';
import { ProviderServicePricingEntity } from '../service-management/entities/provider-service-pricing.entity';
import { LookUpService } from '../lookups/lookup.service';
import { ServiceManagementService } from '../service-management/service-management.service';
import { PaymentService } from '../payment/payment.service';
import { LOOKUP_IDS } from '../../shared/constants/lookup-ids';
import { UpdatePaymentDto } from '../payment/dto/update-payment.dto';
import { CreateBranchDto } from './dto/create-branches.dto';
import { UpdateProviderServiceDto, UpdateProviderServicePricingDto } from './dto/update-provider-service.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProfileStagingService } from './profile-staging.service';
import { ProfileBranchService } from './profile-branch.service';
import { AvailabilityDto } from './dto/availability.dto';
import { success } from 'zod';

@Injectable()
export class ProfileService {
    constructor(
        private readonly profileRepo: ProfileRepository,
        private readonly lookupService: LookUpService,
        private readonly serviceManagement: ServiceManagementService,
        private readonly paymentService: PaymentService,
        private readonly stagingService: ProfileStagingService,
        private readonly branchService: ProfileBranchService,
        private readonly userRepo: UserRepository,
        private readonly dataSource: DataSource,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    // Unified DRY execution wrapper for mutations that require Staging checks
    private async runProfileMutation<T>(
        userId: string,
        changeType: ProfileChangeType,
        dto: T,
        mutateFn: (profile: ProviderProfileEntity, manager: EntityManager) => Promise<any>,
    ) {
        const profile = await this.profileRepo.findProfileByUserId(userId);

        // If profile is approved, divert changes to the staging system immediately (no transaction needed)
        if (profile.status?.staticCode === ProfileStatusStaticCode.APPROVED) {
            return await this.stagingService.stageChange(profile.id, changeType, dto);
        }

        // Only start a transaction if we are actually mutating the profile directly
        return await this.dataSource.transaction(async (manager) => {
            const transactionalProfile = await this.profileRepo.findProfileByUserId(userId, manager);
            const result = await mutateFn(transactionalProfile, manager);
            this.eventEmitter.emit('profile.updated', { userId });
            return result;
        });
    }

    async submitFullProfile(userId: string, profileDto: CreateFullProfileDto) {
        const hasProfile = await this.profileRepo.isUserHaveProfile(userId);
        if (hasProfile) {
            throw new BadRequestException('User already has a profile');
        }

        const { companyInfo, services } = profileDto;

        // 1. validate lookup ids and service ids
        await this.validateCompanyInfo(companyInfo);
        await this.validateServiceIds(services.selectedServiceIds);

        // 2. build and save the full profile in one step inside a transaction
        return await this.dataSource.transaction(async (manager) => {
            const profileData = await this.buildFullProfileObject(manager, userId, profileDto);

            // 3. Mark user profile as complete
            await this.userRepo.updateProfileCompletionStatus(userId, true, manager);

            // 4. Trigger initial score calculation
            this.eventEmitter.emit('profile.updated', { userId });

            return profileData;
        });
    }

    private async buildFullProfileObject(manager: EntityManager, userId: string, dto: CreateFullProfileDto) {
        const { companyInfo, userInfo, services, branches, payment, compliance, availability } = dto;

        return manager.save(ProviderProfileEntity, {
            user: { id: userId },
            status: { id: LOOKUP_IDS.PROFILE_STATUS.PENDING_REVIEW },
            referenceNumber: await this.generateReferenceNumber(),
            providerType: { id: companyInfo.providerTypeId },
            companyType: companyInfo.companyTypeId ? { id: companyInfo.companyTypeId } : null,
            tradeName: companyInfo.tradeName,
            companyRepresentativeName: companyInfo.companyRepresentativeName,
            companyDescription: companyInfo.companyDescription,
            socialMediaLink: companyInfo.socialMediaLink,
            websiteLink: companyInfo.websiteLink,
            languages: companyInfo.languageIds ? companyInfo.languageIds.map((id) => ({ id })) : [],
            providerServices: services.selectedServiceIds.map((id) => ({ service: { id } })),
            userInfo: manager.create(ProviderUserInfoEntity, userInfo),
            branches: this.branchService.buildBranchEntities(branches),
            payment: this.paymentService.buildPaymentEntity(payment, manager),
            compliance: manager.create(ProviderComplianceEntity, compliance),
            availability,
        });
    }

    async getMyProfile(userId: string): Promise<ProviderProfileEntity> {
        return await this.profileRepo.findProfileByUserId(userId);
    }

    async getProfileById(id: string): Promise<ProviderProfileEntity> {
        return await this.profileRepo.findProfileById(id);
    }

    async updateCompanyInfo(userId: string, updateCompanyInfoDto: UpdateCompanyInfoDto) {
        return this.runProfileMutation(
            userId,
            ProfileChangeType.COMPANY_INFO,
            updateCompanyInfoDto,
            async (profile, manager) => {
                const { languageIds, ...basicInfo } = updateCompanyInfoDto;

                if (languageIds) {
                    profile.languages = languageIds.map((id) => ({ id }) as any);
                }

                Object.assign(profile, basicInfo);
                await manager.save(ProviderProfileEntity, profile);
                return await this.profileRepo.findProfileByUserId(userId, manager);
            },
        );
    }

    async updateUserInfo(userId: string, updateUserInfoInfoDto: UpdateUserInfoDto) {
        return this.runProfileMutation(
            userId,
            ProfileChangeType.USER_INFO,
            updateUserInfoInfoDto,
            async (profile, manager) => {
                const userInfo = profile.userInfo;
                Object.assign(userInfo, updateUserInfoInfoDto);
                await manager.save(ProviderUserInfoEntity, userInfo);
                return await this.profileRepo.findProfileByUserId(userId, manager);
            },
        );
    }

    async addService(userId: string, dto: UpdateProviderServiceDto) {
        return this.runProfileMutation(userId, ProfileChangeType.SERVICES, dto, async (profile, manager) => {
            // Check if already exists
            const existing = profile.providerServices.find((ps) => ps.service.id === dto.serviceId);
            if (existing) {
                throw new BadRequestException('Service already added to profile');
            }

            const newProviderService = manager.create(ProviderServiceEntity, {
                profile: { id: profile.id },
                service: { id: dto.serviceId },
                description: dto.description,
                availability: dto.availability ?? profile.availability,
                minPrice: dto.minPrice,
                maxPrice: dto.maxPrice,
            });

            const saved = await manager.save(newProviderService);

            if (dto.pricingDetails && dto.pricingDetails.length > 0) {
                await this.syncPricingDetails(manager, saved, dto.pricingDetails);
            }

            return await this.profileRepo.findProfileByUserId(userId, manager);
        });
    }

    async updateService(userId: string, providerServiceId: string, dto: UpdateProviderServiceDto) {
        return this.runProfileMutation(
            userId,
            ProfileChangeType.SERVICES,
            { providerServiceId, ...dto },
            async (profile, manager) => {
                const providerService = await manager.findOne(ProviderServiceEntity, {
                    where: { id: providerServiceId, profile: { user: { id: userId } } },
                    relations: { pricingDetails: true },
                });

                if (!providerService) {
                    throw new NotFoundException('Provider service not found');
                }

                providerService.description = dto.description ?? providerService.description ?? null;
                providerService.availability = dto.availability ?? providerService.availability ?? profile.availability;
                providerService.maxPrice = dto.maxPrice;
                providerService.minPrice = dto.minPrice;

                if (dto.pricingDetails) {
                    await this.syncPricingDetails(manager, providerService, dto.pricingDetails);
                }

                await manager.save(providerService);
                return { success: true, message: 'Updated successfully' };
            },
        );
    }

    async deleteService(userId: string, providerServiceId: string) {
        return this.runProfileMutation(
            userId,
            ProfileChangeType.SERVICES,
            { providerServiceId, action: 'DELETE' },
            async (profile, manager) => {
                const providerService = await manager.findOne(ProviderServiceEntity, {
                    where: {
                        id: providerServiceId,
                        profile: { user: { id: userId } },
                    },
                });

                if (!providerService) {
                    throw new NotFoundException('Provider service not found');
                }

                await manager.remove(providerService);
                return await this.profileRepo.findProfileByUserId(userId, manager);
            },
        );
    }

    private async syncPricingDetails(
        manager: EntityManager,
        providerService: ProviderServiceEntity,
        pricingDtos: UpdateProviderServicePricingDto[],
    ) {
        if (!providerService.pricingDetails) {
            providerService.pricingDetails = [];
        }

        const entitiesToSave: ProviderServicePricingEntity[] = [];

        for (const dto of pricingDtos) {
            if (dto.id) {
                const existingPricing = providerService.pricingDetails.find((p) => p.id === dto.id);
                if (!existingPricing) throw new NotFoundException('Pricing not found');

                Object.assign(existingPricing, dto);
                entitiesToSave.push(existingPricing);
            } else {
                const newPricing = manager.create(ProviderServicePricingEntity, {
                    description: dto.description,
                    price: dto.price,
                    providerService: { id: providerService.id },
                });

                providerService.pricingDetails.push(newPricing);
                entitiesToSave.push(newPricing);
            }
        }

        return await manager.save(ProviderServicePricingEntity, entitiesToSave);
    }

    async updateCompliance(userId: string, updateComplianceDto: UpdateComplianceDto) {
        return this.runProfileMutation(
            userId,
            ProfileChangeType.COMPLIANCE,
            updateComplianceDto,
            async (profile, manager) => {
                const compliance = profile.compliance;
                Object.assign(compliance, updateComplianceDto);
                await manager.save(ProviderComplianceEntity, compliance);
                return await this.profileRepo.findProfileByUserId(userId, manager);
            },
        );
    }

    async updatePayment(userId: string, updatePaymentDto: UpdatePaymentDto) {
        return this.runProfileMutation(
            userId,
            ProfileChangeType.PAYMENT,
            updatePaymentDto,
            async (profile, manager) => {
                await this.paymentService.syncPayment(userId, updatePaymentDto);
                return await this.profileRepo.findProfileByUserId(userId, manager);
            },
        );
    }

    async upsertAvailabilty(userId: string, dto: AvailabilityDto) {
        return this.runProfileMutation(userId, ProfileChangeType.AVAILABILITY, dto, async (profile, manager) => {
            await manager.upsert(
                ProviderProfileEntity,
                {
                    id: profile.id,
                    availability: dto.availability ?? null,
                },
                ['id'],
            );
            return await this.profileRepo.getProviderAvailability(userId, manager);
        });
    }

    async getAvailabilty(userId: string) {
        return await this.profileRepo.getProviderAvailability(userId);
    }

    async syncBranches(userId: string, updateBranchesDto: UpdateBranchesDto) {
        return this.runProfileMutation(
            userId,
            ProfileChangeType.BRANCHES,
            updateBranchesDto,
            async (profile, manager) => {
                await this.branchService.syncBranches(userId, profile, updateBranchesDto, manager);
                return await this.profileRepo.findProfileByUserId(userId, manager);
            },
        );
    }

    async updateBranch(userId: string, branchId: string, updateBranchDto: UpdateBranchDto) {
        await this.branchService.updateBranch(userId, branchId, updateBranchDto);
        this.eventEmitter.emit('profile.updated', { userId });
        return await this.profileRepo.findProfileByUserId(userId);
    }

    async addBranch(userId: string, addBranchDto: CreateBranchDto) {
        return this.runProfileMutation(userId, ProfileChangeType.BRANCHES, addBranchDto, async (profile, manager) => {
            await this.branchService.addBranch(profile, addBranchDto);
            return await this.profileRepo.findProfileByUserId(userId, manager);
        });
    }

    async deleteBranch(userId: string, branchId: string) {
        return this.runProfileMutation(
            userId,
            ProfileChangeType.BRANCHES,
            { branchId, action: 'DELETE' },
            async (profile, manager) => {
                await this.branchService.deleteBranch(branchId);
                return await this.profileRepo.findProfileByUserId(userId, manager);
            },
        );
    }

    // ------- private helper methods ------- //

    async approveProfileForTesting(userId: string) {
        const profile = await this.profileRepo.findProfileByUserId(userId);
        profile.status = { id: LOOKUP_IDS.PROFILE_STATUS.APPROVED } as any;
        await this.dataSource.manager.save(ProviderProfileEntity, profile);
        this.eventEmitter.emit('profile.updated', { userId });
        return { success: true, message: 'Profile instantly approved for testing', status: 'APPROVED' };
    }

    private async generateReferenceNumber() {
        const prefix = 'SND-';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const referenceNumberLength = 9;
        let result = '';
        for (let i = 0; i < referenceNumberLength; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return prefix + result;
    }

    private async validateCompanyInfo(companyInfo: CreateCompanyInfoDto) {
        const isValidProvider = await this.lookupService.isProviderTypeExist(companyInfo.providerTypeId);
        if (!isValidProvider) throw new BadRequestException('Invalid provider type id');

        if (companyInfo.companyTypeId) {
            const isValidCompany = await this.lookupService.isCompanyTypeExist(companyInfo.companyTypeId);
            if (!isValidCompany) throw new BadRequestException('Invalid company type id');
        }
    }

    private async validateServiceIds(serviceIds: string[]) {
        if (!serviceIds || serviceIds.length === 0) return;
        const validServices = await this.serviceManagement.findServicesByIds(serviceIds);
        const validIds = new Set(validServices.map((s) => s.id));

        const invalidIds = serviceIds.filter((id) => !validIds.has(id));
        if (invalidIds.length > 0) {
            throw new BadRequestException('Some service IDs are invalid or inactive');
        }
    }
}
