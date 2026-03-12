import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { ProfileRepository } from './profile.repository';
import { CreateBranchDto, CreateBranchesDto } from './dto/step-3-branches.dto';
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
import { CreateCompanyInfoDto } from './dto/step-1-company-info.dto';
import { CreateUserInfoDto } from './dto/step-2-user-info.dto';
import { CreateServicesDto } from './dto/step-4-services.dto';
import { CreatePaymentDto } from './dto/step-6-payment.dto';
import { CreateComplianceDto } from './dto/step-5-compliance.dto';
import { CreateSubscriptionDto } from './dto/step-7-subscription.dto';


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
            statusId: profile.status.id,
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
        profileDto: CreateFullProfileDto,
    ) {

        const manager: EntityManager = this.dataSource.manager;


        const isUserHaveProfile = await this.profileRepo.isUserHaveProfile(userId);

        if (isUserHaveProfile) {
            throw new HttpException(`User Already Have An Profile`, HttpStatus.BAD_REQUEST)
        }

        const { companyInfo, userInfo, services, branches, subscription, payment, compliance } = profileDto;


        // const companyInfoEntity = await this.processCompanyInfo(companyInfo, userId, manager);

        const userInfoEntity = await this.processUserInfo(userInfo, manager);

        const brancheEntities = this.processBranches(branches, manager);

        const payementEntity = this.processPayement(payment, manager);

        const complianceEntity = this.processCompliance(compliance, manager);

        const subscriptionEntity = this.processSubscription(subscription, manager)





        const providerProfileEnity = this.processProviderProfile
            (companyInfo, userInfoEntity, brancheEntities, payementEntity, complianceEntity, subscriptionEntity, services, userId, manager);

        return await this.profileSaver.saveProviderProfile(providerProfileEnity, manager)

    }

    async processCompanyInfo(companyInfo: CreateCompanyInfoDto, userId: string, manager: EntityManager) {
        const { providerTypeId, companyTypeId } = companyInfo;

        const isValidProvider =
            await this.lookupService.isProviderTypeExist(providerTypeId, manager);

        if (!isValidProvider) throw new HttpException('Invalid provider type id', HttpStatus.BAD_REQUEST);


        if (companyTypeId) {
            const isValidCompany =
                await this.lookupService.isCompanyTypeExist(companyTypeId, manager);

            if (!isValidCompany)
                throw new HttpException('Invalid company type id', HttpStatus.BAD_REQUEST);
        }

        // return this.profileSaver.createCompanyEntity(companyInfo, userId, manager)
    }

    processUserInfo(userInfo: CreateUserInfoDto, manager: EntityManager) {

        return this.profileSaver.createUserInfoEntity(userInfo, manager)
    }

    // processServices(services: CreateServicesDto, manager: EntityManager) { }


    processBranches(branches: CreateBranchesDto, manager: EntityManager) {
        return this.profileSaver.createBranchEntities(branches, manager)
    }


    processPayement(payment: CreatePaymentDto, manager: EntityManager) {
        return this.profileSaver.createPayementEntity(payment, manager)
    }

    processCompliance(compliance: CreateComplianceDto, manager: EntityManager) {
        return this.profileSaver.createComplianceEntity(compliance, manager)
    }

    processSubscription(subscription: CreateSubscriptionDto, manager: EntityManager) {
        return this.profileSaver.createSubscriptionEntity(subscription, manager)
    }


    processProviderProfile(
        companyInfo: CreateCompanyInfoDto, userInfo: ProviderUserInfoEntity,
        branches: BranchEntity[], payment: ProviderPaymentEntity,
        ProviderCompliance: ProviderComplianceEntity,
        subscription: ProviderSubscriptionEntity,
        services: CreateServicesDto, userId: string, manager: EntityManager) {
        return this.profileSaver.createProviderProfile(companyInfo, userInfo, branches, payment, ProviderCompliance, subscription, services, userId, manager)
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
            statusId: profile.status.id,
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

        if (!branch) {
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

        if (!branch) {
            throw new NotFoundException('Branch not found');
        }

        await this.profileRepo.deleteServingAreasByBranchId(branchId);
        await this.profileRepo.deleteBranch(branchId);

        return { message: 'Branch deleted successfully' };
    }
}
