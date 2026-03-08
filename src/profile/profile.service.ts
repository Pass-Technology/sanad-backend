import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProfileRepository } from './profile.repository';
import { CreateBranchDto } from './dto/step-3-branches.dto';
import { CreateFullProfileDto } from './dto/create-full-profile.dto';

import { ProviderProfile } from './entities/provider-profile.entity';
import { ProviderUserInfo } from './entities/provider-user-info.entity';
import { Branch } from './entities/branch.entity';
import { ServingArea } from './entities/serving-area.entity';
import { ProviderCompliance } from './entities/provider-compliance.entity';
import { ProviderPayment } from './entities/provider-payment.entity';
import { ProviderSubscription } from './entities/provider-subscription.entity';
import { StepResponseDto, ProgressResponseDto } from './dto/profile-response.dto';
import { LookUpService } from '../lookup/lookup.service';


@Injectable()
export class ProfileService {
    constructor(
        private readonly profileRepo: ProfileRepository,
        private readonly dataSource: DataSource,
        private readonly lookupService: LookUpService,
    ) { }



    /**
     * 
     * @param userId 
     * @returns get the profile or create a new one if it doesn't exist
     */
    private async getOrCreateProfile(userId: string): Promise<ProviderProfile> {
        const existing = await this.profileRepo.findProfileByUserId(userId);
        if (existing) return existing;

        return this.profileRepo.createProfile({
            userId,
            statusId: 'draft',
            currentStep: 1,
        });
    }

    /**
     * 
     * @param stepLabel 
     * @param profile 
     * @param data 
     * @returns a message response of the step
     */
    private buildStepResponse(
        stepLabel: string,
        profile: ProviderProfile,
        data: unknown,
    ): StepResponseDto {
        return {
            message: `${stepLabel} saved successfully`,
            currentStep: profile.currentStep,
            statusId: profile.statusId,
            data,
        };
    }

    /**
     * 
     * @param profileId 
     * @param completedStep 
     * @param currentStep 
     * @returns Advance currentStep only if the user hasn't already passed this step.
     */
    private async advanceStep(
        profileId: string,
        completedStep: number,
        currentStep: number,
    ): Promise<ProviderProfile> {
        const nextStep = completedStep + 1;
        if (currentStep <= completedStep) {
            return await this.profileRepo.updateProfile(profileId, {
                currentStep: Math.min(nextStep, 8),
            });
        }
        return await this.profileRepo.updateProfile(profileId, {});
    }



    async submitFullProfile(
        userId: string,
        dto: CreateFullProfileDto,
    ): Promise<StepResponseDto> {
        const isValidProvider = await this.lookupService.validateProviderTypeId(dto.companyInfo.providerTypeId);
        if (!isValidProvider) throw new BadRequestException('Invalid provider type id');

        if (dto.companyInfo.companyTypeId) {
            const isValidCompany = await this.lookupService.validateCompanyTypeId(dto.companyInfo.companyTypeId);
            if (!isValidCompany) throw new BadRequestException('Invalid company type id');
        }

        return this.dataSource.transaction(async (manager) => {
            // Get or create profile
            let profile = await manager.findOne(ProviderProfile, { where: { userId } });
            if (!profile) {
                profile = manager.create(ProviderProfile, {
                    userId,
                    statusId: "draft",
                    currentStep: 1,
                });
                profile = await manager.save(ProviderProfile, profile);
            }

            // Step 1 — Company Info
            profile.providerTypeId = dto.companyInfo.providerTypeId;
            console.log(dto.companyInfo.providerTypeId)
            profile.companyTypeId = dto.companyInfo.companyTypeId ?? null;
            profile.tradeName = dto.companyInfo.tradeName;
            profile.companyRepresentativeName = dto.companyInfo.companyRepresentativeName ?? null;
            profile.companyDescription = dto.companyInfo.companyDescription ?? null;
            profile.socialMediaLink = dto.companyInfo.socialMediaLink ?? null;
            profile.websiteLink = dto.companyInfo.websiteLink ?? null;
            profile.languagesSpoken = dto.companyInfo.languagesSpoken ?? null;
            // Object.assign(profile, nullify(dto.companyInfo))


            // Step 4 — Services
            profile.selectedServiceIds = dto.services.selectedServiceIds;

            // Step 2 — User Info
            let userInfo = await manager.findOne(ProviderUserInfo, {
                where: { providerProfileId: profile.id },
            });
            if (userInfo) {
                userInfo.fullName = dto.userInfo.fullName;
                userInfo.email = dto.userInfo.email;
                userInfo.mobileNumber = dto.userInfo.mobileNumber!;
                userInfo.nationalId = dto.userInfo.nationalId;
                userInfo.dateOfBirth = dto.userInfo.dateOfBirth!;
            } else {
                userInfo = manager.create(ProviderUserInfo, {
                    providerProfileId: profile.id,
                    fullName: dto.userInfo.fullName,
                    email: dto.userInfo.email,
                    mobileNumber: dto.userInfo.mobileNumber ?? null,
                    nationalId: dto.userInfo.nationalId,
                    dateOfBirth: dto.userInfo.dateOfBirth ?? null,
                });
            }
            await manager.save(ProviderUserInfo, userInfo);

            // Step 3 — Branches (clear existing, then re-create)
            const existingBranches = await manager.find(Branch, {
                where: { providerProfileId: profile.id },
            });
            console.log(profile.id)
            for (const b of existingBranches) {
                await manager.delete(ServingArea, { branchId: b.id });
            }
            await manager.delete(Branch, { providerProfileId: profile.id });

            for (const branchDto of dto.branches.branches) {
                const branch = manager.create(Branch, {
                    providerProfileId: profile.id,
                    branchName: branchDto.branchName,
                    branchManagerName: branchDto.branchManagerName,
                    branchAddress: branchDto.branchAddress,
                    city: branchDto.city,
                    branchPhone: branchDto.branchPhone ?? null,
                    managerPhone: branchDto.managerPhone ?? null,
                    googleMapsLink: branchDto.googleMapsLink ?? null,
                    socialMediaLink: branchDto.socialMediaLink ?? null,
                });
                const savedBranch = await manager.save(Branch, branch);

                if (branchDto.servingAreas?.length) {
                    const areas = branchDto.servingAreas.map((area) =>
                        manager.create(ServingArea, {
                            branchId: savedBranch.id,
                            radiusKm: area.radiusKm,
                            phone: area.phone ?? null,
                            mapLink: area.mapLink ?? null,
                            lat: area.lat ?? null,
                            lng: area.lng ?? null,
                        }),
                    );
                    await manager.save(ServingArea, areas);
                }
            }

            // Step 5 — Compliance
            let compliance = await manager.findOne(ProviderCompliance, {
                where: { providerProfileId: profile.id },
            });
            if (compliance) {
                compliance.ownerIdFile = dto.compliance.ownerIdFile;
                compliance.ownerIdExpiryDate = dto.compliance.ownerIdExpiryDate;
                compliance.tradeLicenseFile = dto.compliance.tradeLicenseFile;
                compliance.tradeLicenseExpiryDate = dto.compliance.tradeLicenseExpiryDate;
            } else {
                compliance = manager.create(ProviderCompliance, {
                    providerProfileId: profile.id,
                    ownerIdFile: dto.compliance.ownerIdFile,
                    ownerIdExpiryDate: dto.compliance.ownerIdExpiryDate,
                    tradeLicenseFile: dto.compliance.tradeLicenseFile,
                    tradeLicenseExpiryDate: dto.compliance.tradeLicenseExpiryDate,
                });
            }
            await manager.save(ProviderCompliance, compliance);

            // Step 6 — Payment
            let payment = await manager.findOne(ProviderPayment, {
                where: { providerProfileId: profile.id },
            });
            if (payment) {
                payment.bankName = dto.payment.bankName;
                payment.accountHolderName = dto.payment.accountHolderName;
                payment.accountNumber = dto.payment.accountNumber;
                payment.iban = dto.payment.iban;
                payment.paymentMethodIds = dto.payment.paymentMethodIds;
            } else {
                payment = manager.create(ProviderPayment, {
                    providerProfileId: profile.id,
                    bankName: dto.payment.bankName,
                    accountHolderName: dto.payment.accountHolderName,
                    accountNumber: dto.payment.accountNumber,
                    iban: dto.payment.iban,
                    paymentMethodIds: dto.payment.paymentMethodIds,
                });
            }
            await manager.save(ProviderPayment, payment);

            // Step 7 — Subscription
            let subscription = await manager.findOne(ProviderSubscription, {
                where: { providerProfileId: profile.id },
            });
            if (subscription) {
                subscription.selectedPlanId = dto.subscription.selectedPlanId;
                subscription.billingCycleId = dto.subscription.billingCycleId;
                subscription.startDate = new Date();
            } else {
                subscription = manager.create(ProviderSubscription, {
                    providerProfileId: profile.id,
                    selectedPlanId: dto.subscription.selectedPlanId,
                    billingCycleId: dto.subscription.billingCycleId,
                    startDate: new Date(),
                });
            }
            await manager.save(ProviderSubscription, subscription);

            // finalization fields
            await manager.update(ProviderProfile, profile.id, {
                currentStep: 8,
                statusId: 'pending_review',
            });

            const completeProfile = await manager.findOne(ProviderProfile, {
                where: { id: profile.id },
                relations: [
                    'userInfo',
                    'branches',
                    'branches.servingAreas',
                    'compliance',
                    'payment',
                    'subscription',
                ],
            });

            return this.buildStepResponse('Profile submitted for review', completeProfile!, completeProfile!);
        });
    }



    async getProgress(userId: string): Promise<ProgressResponseDto> {
        const profile = await this.profileRepo.findProfileByUserId(userId);

        if (!profile) {
            return {
                currentStep: 1,
                statusId: 'draft',
                data: null,
            };
        }

        return {
            currentStep: profile.currentStep,
            statusId: profile.statusId,
            data: profile,
        };
    }



    async getMyProfile(userId: string): Promise<ProviderProfile> {
        const profile = await this.profileRepo.findProfileByUserId(userId);
        if (!profile) {
            throw new NotFoundException('Profile not found. Please start the setup process.');
        }
        return profile;
    }



    async updateBranch(
        userId: string,
        branchId: string,
        dto: CreateBranchDto,
    ): Promise<StepResponseDto> {
        const profile = await this.getOrCreateProfile(userId);
        const branch = await this.profileRepo.findBranchById(branchId);

        if (!branch || branch.providerProfileId !== profile.id) {
            throw new NotFoundException('Branch not found');
        }

        // Update branch fields
        await this.profileRepo.updateBranch(branchId, {
            branchName: dto.branchName,
            branchManagerName: dto.branchManagerName,
            branchAddress: dto.branchAddress,
            city: dto.city,
            branchPhone: dto.branchPhone ?? null,
            managerPhone: dto.managerPhone ?? null,
            googleMapsLink: dto.googleMapsLink ?? null,
            socialMediaLink: dto.socialMediaLink ?? null,
        });

        // Replace serving areas
        await this.profileRepo.deleteServingAreasByBranchId(branchId);
        if (dto.servingAreas?.length) {
            await this.profileRepo.saveServingAreas(
                dto.servingAreas.map((area) => ({
                    branchId,
                    radiusKm: area.radiusKm,
                    phone: area.phone ?? null,
                    mapLink: area.mapLink ?? null,
                    lat: area.lat ?? null,
                    lng: area.lng ?? null,
                })),
            );
        }

        const updatedBranch = await this.profileRepo.findBranchById(branchId);
        return this.buildStepResponse('Branch updated', profile, updatedBranch);
    }

    async deleteBranch(
        userId: string,
        branchId: string,
    ): Promise<{ message: string }> {
        const profile = await this.getOrCreateProfile(userId);
        const branch = await this.profileRepo.findBranchById(branchId);

        if (!branch || branch.providerProfileId !== profile.id) {
            throw new NotFoundException('Branch not found');
        }

        await this.profileRepo.deleteServingAreasByBranchId(branchId);
        await this.profileRepo.deleteBranch(branchId);

        return { message: 'Branch deleted successfully' };
    }
}
