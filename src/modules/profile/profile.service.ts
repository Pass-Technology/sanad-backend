import {
    Injectable,
    NotFoundException,
    BadRequestException,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ProfileRepository } from './profile.repository';
import { UserRepository } from '../user/user.repository';
import { UserEntity } from '../user/entities/user.entity';
import { CreateBranchDto } from './dto/step-3-branches.dto';
import { CreateFullProfileDto } from './dto/create-full-profile.dto';

import { ProviderProfileEntity } from './entities/provider-profile.entity';
import { ProviderUserInfoEntity } from './entities/provider-user-info.entity';
import { BranchEntity } from './entities/branch.entity';
import { ProviderComplianceEntity } from './entities/provider-compliance.entity';
import { ProviderPaymentEntity } from './entities/provider-payment.entity';
import { ServingAreaEntity } from './entities/serving-area.entity';
import { ServiceEntity } from '../service-management/entities/service.entity';
import { LookUpService } from './lookup-tables/lookup.service';
import { ServiceManagementService } from '../service-management/service-management.service';
import { CreateServicesDto } from './dto/step-4-services.dto';
import { LOOKUP_IDS } from '../../shared/constants/lookup-ids';

// import { CreateCompanyInfoDto } from './dto/step-1-company-info.dto';
// import { CreateBranchesDto } from './dto/step-3-branches.dto';

@Injectable()
export class ProfileService {
    constructor(
        private readonly profileRepo: ProfileRepository,
        private readonly lookupService: LookUpService,
        private readonly serviceManagement: ServiceManagementService,
        @InjectRepository(ProviderUserInfoEntity)
        private readonly userInfoRepo: Repository<ProviderUserInfoEntity>,
        @InjectRepository(BranchEntity)
        private readonly branchRepo: Repository<BranchEntity>,
        @InjectRepository(ServingAreaEntity)
        private readonly servingAreaRepo: Repository<ServingAreaEntity>,
        @InjectRepository(ProviderComplianceEntity)
        private readonly complianceRepo: Repository<ProviderComplianceEntity>,
        @InjectRepository(ProviderPaymentEntity)
        private readonly paymentRepo: Repository<ProviderPaymentEntity>,
        private readonly userRepo: UserRepository,
        private readonly dataSource: DataSource,
    ) { }


    async submitFullProfile(userId: string, profileDto: CreateFullProfileDto) {
        const hasProfile = await this.profileRepo.isUserHaveProfile(userId);
        if (hasProfile) {
            throw new BadRequestException('User already has a profile');
        }

        const { companyInfo, userInfo, services, branches, payment, compliance } = profileDto;

        // 1. validate lookup ids and service ids
        await this.validateCompanyInfo(companyInfo);
        await this.validateServiceIds(services.selectedServiceIds);

        // 2. build and save the full profile in one step inside a transaction
        return await this.dataSource.transaction(async (manager) => {
            const profile = await this.profileRepo.createProfile({
                user: { id: userId },
                status: { id: LOOKUP_IDS.PROFILE_STATUS.DRAFT },
                providerType: { id: companyInfo.providerTypeId },
                companyType: companyInfo.companyTypeId ? { id: companyInfo.companyTypeId } : null,
                tradeName: companyInfo.tradeName,
                companyRepresentativeName: companyInfo.companyRepresentativeName,
                companyDescription: companyInfo.companyDescription,
                socialMediaLink: companyInfo.socialMediaLink,
                websiteLink: companyInfo.websiteLink,
                languages: companyInfo.languageIds ? companyInfo.languageIds.map(id => ({ id })) : [],

                selectedServices: services.selectedServiceIds.map(id => ({ id })),
                userInfo: manager.create(ProviderUserInfoEntity, userInfo),
                branches: this.buildBranchEntities(branches),
                payment: manager.create(ProviderPaymentEntity, payment),
                compliance: manager.create(ProviderComplianceEntity, compliance),
            } as any, manager);

            // 3. update user flag
            await this.userRepo.updateProfileCompletionStatus(userId, true, manager);

            return profile;
        });
    }

    async getMyProfile(userId: string): Promise<ProviderProfileEntity> {
        return await this.profileRepo.findProfileByUserId(userId);
    }

    async updateServices(userId: string, createServiceDto: CreateServicesDto) {
        const profile = await this.profileRepo.findProfileByUserId(userId);

        await this.validateServiceIds(createServiceDto.selectedServiceIds);

        profile.selectedServices = createServiceDto.selectedServiceIds.map(id => ({ id } as ServiceEntity));
        await this.profileRepo.createProfile(profile);

        return profile.selectedServices;
    }



    async updateBranch(
        userId: string,
        branchId: string,
        dto: CreateBranchDto,
    ) {
        const profile = await this.profileRepo.findProfileByUserId(userId);
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
                })),);
        }

        const updatedBranch = await this.profileRepo.findBranchById(branchId);
        // return this.buildStepResponse('Branch updated', profile, updatedBranch);
        return {
            statusId: profile.status.id,
            data: updatedBranch,
        };
    }

    async deleteBranch(
        userId: string,
        branchId: string,
    ): Promise<{ message: string }> {
        const profile = await this.profileRepo.findProfileByUserId(userId);
        const branch = await this.profileRepo.findBranchById(branchId);

        if (!branch) {
            throw new NotFoundException('Branch not found');
        }

        await this.profileRepo.deleteServingAreasByBranchId(branchId);
        await this.profileRepo.deleteBranch(branchId);

        return { message: 'Branch deleted successfully' };
    }



    // ------- private helper methods ------- //


    // check if company has valid provider type and company type
    private async validateCompanyInfo(companyInfo: any) {
        const isValidProvider = await this.lookupService.isProviderTypeExist(companyInfo.providerTypeId);
        if (!isValidProvider) throw new BadRequestException('Invalid provider type id');

        if (companyInfo.companyTypeId) {
            const isValidCompany = await this.lookupService.isCompanyTypeExist(companyInfo.companyTypeId);
            if (!isValidCompany) throw new BadRequestException('Invalid company type id');
        }
    }

    // check if services are valid and active
    private async validateServiceIds(serviceIds: string[]) {
        const invalidIds: string[] = [];
        for (const serviceId of serviceIds) {
            const service = await this.serviceManagement.findServiceById(serviceId);
            if (!service) invalidIds.push(serviceId);
        }
        if (invalidIds.length > 0) {
            throw new BadRequestException('Some service IDs are invalid or inactive');
        }
    }

    // build branch entities
    private buildBranchEntities(branchesData: any): BranchEntity[] {
        return branchesData.branches.map((branchDto: any) => {
            const servingAreas = (branchDto.servingAreas ?? []).map((area: any) =>
                this.servingAreaRepo.create({
                    radiusKm: area.radiusKm,
                    phone: area.phone ?? null,
                    mapLink: area.mapLink ?? null,
                    lat: area.lat ?? null,
                    lng: area.lng ?? null,
                })
            );

            return this.branchRepo.create({
                branchName: branchDto.branchName,
                branchManagerName: branchDto.branchManagerName,
                branchAddress: branchDto.branchAddress,
                city: branchDto.city,
                branchPhone: branchDto.branchPhone ?? null,
                managerPhone: branchDto.managerPhone ?? null,
                googleMapsLink: branchDto.googleMapsLink ?? null,
                socialMediaLink: branchDto.socialMediaLink ?? null,
                servingAreas,
            });
        });
    }
}
