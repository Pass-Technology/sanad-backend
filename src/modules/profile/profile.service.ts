import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { LOOKUP_IDS } from 'src/shared/constants/lookup-ids';
import { DataSource } from 'typeorm';
import { ProfileRepository } from './profile.repository';
import { CreateBranchDto } from './dto/step-3-branches.dto';
import { CreateFullProfileDto } from './dto/create-full-profile.dto';

import { ProviderProfileEntity } from './entities/provider-profile.entity';
import { ProviderUserInfoEntity } from './entities/provider-user-info.entity';
import { BranchEntity } from './entities/branch.entity';
import { ServingAreaEntity } from './entities/serving-area.entity';
import { ProviderComplianceEntity } from './entities/provider-compliance.entity';
import { ProviderPaymentEntity } from './entities/provider-payment.entity';
import { ProviderSubscriptionEntity } from './entities/provider-subscription.entity';
import { StepResponseDto, ProgressResponseDto } from './dto/profile-response.dto';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { LookUpService } from './lookup-tables/lookup.service';
import { ProfileSaverService } from './profile-saver.service';


@Injectable()
export class ProfileService {
    constructor(
        private readonly profileRepo: ProfileRepository,
        private readonly dataSource: DataSource,
        private readonly lookupService: LookUpService,
        private readonly profileSaver: ProfileSaverService,
    ) { }



    /**
     * 
     * @param userId 
     * @returns get the profile or create a new one if it doesn't exist
     */
    private async getOrCreateProfile(userId: string): Promise<ProviderProfileEntity> {
        const existing = await this.profileRepo.findProfileByUserId(userId);
        if (existing) return existing;

        const draftRecord = await this.lookupService.getDraftStatus();

        if (!draftRecord) {
            throw new HttpException(`Draft status not found`, HttpStatus.CONFLICT)
        }

        return this.profileRepo.createProfile({
            user: { id: userId } as UserEntity,
            status: draftRecord,
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
        profile: ProviderProfileEntity,
        data: unknown,
    ): StepResponseDto {
        return {
            message: `${stepLabel} saved successfully`,
            currentStep: profile.currentStep,
            statusId: profile.status?.id,
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
    ): Promise<ProviderProfileEntity> {
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

        const isValidProvider =
            await this.lookupService.validateProviderTypeId(dto.companyInfo.providerTypeId);

        if (!isValidProvider)
            throw new BadRequestException('Invalid provider type id');

        if (dto.companyInfo.companyTypeId) {
            const isValidCompany =
                await this.lookupService.validateCompanyTypeId(dto.companyInfo.companyTypeId);

            if (!isValidCompany)
                throw new BadRequestException('Invalid company type id');
        }

        return this.dataSource.transaction(async (manager) => {

            const profile = await this.profileSaver.saveFullProfile(
                manager,
                userId,
                dto,
            );

            return this.buildStepResponse(
                'Profile submitted for review',
                profile,
                profile,
            );
        });
    }



    async getProgress(userId: string): Promise<ProgressResponseDto> {
        const profile = await this.profileRepo.findProfileByUserId(userId);

        if (!profile) {
            return {
                currentStep: 1,
                statusId: LOOKUP_IDS.PROFILE_STATUS.DRAFT,
                data: null,
            };
        }

        return {
            currentStep: profile.currentStep,
            statusId: profile.status?.id,
            data: profile,
        };
    }



    async getMyProfile(userId: string): Promise<ProviderProfileEntity> {
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

        if (!branch || branch.providerProfile?.id !== profile.id) {
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
                    branch: { id: branchId } as BranchEntity,
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

        if (!branch || branch.providerProfile?.id !== profile.id) {
            throw new NotFoundException('Branch not found');
        }

        await this.profileRepo.deleteServingAreasByBranchId(branchId);
        await this.profileRepo.deleteBranch(branchId);

        return { message: 'Branch deleted successfully' };
    }
}
