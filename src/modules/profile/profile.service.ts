import {
    Injectable,
    NotFoundException,
    BadRequestException,
    Inject,
    forwardRef,
    // HttpException,
    // HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { ProfileRepository } from './profile.repository';
import { UserRepository } from '../user/user.repository';
// import { UserEntity } from '../user/entities/user.entity';
// import { CreateBranchDto } from './dto/step-3-branches.dto';
import { CreateFullProfileDto } from './dto/create-full-profile.dto';
import {
    UpdateCompanyInfoDto,
    UpdateUserInfoDto,
    UpdateComplianceDto,
    UpdateServicesDto,
    UpdateBranchDto,
    UpdateBranchesDto,
} from './dto/update-full-profile.dto';

import { ProviderProfileEntity } from './entities/provider-profile.entity';
import { ProviderUserInfoEntity } from './entities/provider-user-info.entity';
import { BranchEntity } from './entities/branch.entity';
import { ProviderComplianceEntity } from './entities/provider-compliance.entity';
import { ServingAreaEntity } from './entities/serving-area.entity';
// import { ServiceEntity } from '../service-management/entities/service.entity';
import { LookUpService } from '../lookups/lookup.service';
import { ServiceManagementService } from '../service-management/service-management.service';
// import { CreateServicesDto } from './dto/step-4-services.dto';
import { PaymentService } from '../payment/payment.service';
import { LOOKUP_IDS } from '../../shared/constants/lookup-ids';
import { UpdatePaymentDto } from '../payment/dto/update-payment.dto';
import { CreateBranchDto } from './dto/create-branches.dto';
import { ScoringSystemService } from '../profile-scoring-system/scoring-system.service';

@Injectable()
export class ProfileService {
    constructor(
        private readonly profileRepo: ProfileRepository,
        private readonly lookupService: LookUpService,
        private readonly serviceManagement: ServiceManagementService,
        private readonly paymentService: PaymentService,
        @InjectRepository(ProviderUserInfoEntity)
        private readonly userInfoRepo: Repository<ProviderUserInfoEntity>,
        @InjectRepository(BranchEntity)
        private readonly branchRepo: Repository<BranchEntity>,
        @InjectRepository(ServingAreaEntity)
        private readonly servingAreaRepo: Repository<ServingAreaEntity>,
        private readonly userRepo: UserRepository,
        private readonly dataSource: DataSource,
        @Inject(forwardRef(() => ScoringSystemService))
        private readonly scoringService: ScoringSystemService,
    ) { }


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
            // const profile = await this.profileRepo.createProfile(profileData as any, manager);

            // 3. Mark user profile as complete
            await this.userRepo.updateProfileCompletionStatus(userId, true, manager);

            // 4. Trigger initial score calculation
            await this.scoringService.recalculate(userId);

            return profileData;
        });
    }

    private async buildFullProfileObject(manager: EntityManager, userId: string, dto: CreateFullProfileDto) {
        const { companyInfo, userInfo, services, branches, payment, compliance } = dto;


        return manager.save(ProviderProfileEntity, {
            user: { id: userId },
            status: { id: LOOKUP_IDS.PROFILE_STATUS.DRAFT },
            referenceNumber: await this.generateReferenceNumber(),
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
            payment: this.paymentService.buildPaymentEntity(payment, manager),
            compliance: manager.create(ProviderComplianceEntity, compliance),

        });
    }

    async getMyProfile(userId: string): Promise<ProviderProfileEntity> {
        return await this.profileRepo.findProfileByUserId(userId);
    }

    async updateCompanyInfo(userId: string, updateCompanyInfoDto: UpdateCompanyInfoDto) {
        const profile = await this.profileRepo.findProfileByUserId(userId);

        if (updateCompanyInfoDto.languageIds) {
            profile.languages = updateCompanyInfoDto.languageIds.map(id => ({ id } as any));
            delete updateCompanyInfoDto.languageIds;
        }

        Object.assign(profile, updateCompanyInfoDto);
        const updated = await this.dataSource.manager.save(ProviderProfileEntity, profile);
        await this.scoringService.recalculate(userId);
        return updated;
    }

    async updateUserInfo(userId: string, updateUserInfoInfoDto: UpdateUserInfoDto) {
        const profile = await this.profileRepo.findProfileByUserId(userId);
        const userInfo = profile.userInfo;

        Object.assign(userInfo, updateUserInfoInfoDto);
        await this.userInfoRepo.save(userInfo);
        await this.scoringService.recalculate(userId);
        return await this.profileRepo.findProfileByUserId(userId);
    }

    async updateServices(userId: string, updateServiceDto: UpdateServicesDto) {
        const profile = await this.profileRepo.findProfileByUserId(userId);

        if (updateServiceDto.selectedServiceIds) {
            await this.validateServiceIds(updateServiceDto.selectedServiceIds);
            profile.selectedServices = updateServiceDto.selectedServiceIds.map(id => ({ id } as any));
        }

        await this.dataSource.manager.save(ProviderProfileEntity, profile);
        await this.scoringService.recalculate(userId);
        return await this.profileRepo.findProfileByUserId(userId);
    }

    async updateCompliance(userId: string, updateComplianceDto: UpdateComplianceDto) {
        const profile = await this.profileRepo.findProfileByUserId(userId);
        const compliance = profile.compliance;

        Object.assign(compliance, updateComplianceDto);
        await this.dataSource.manager.save(ProviderComplianceEntity, compliance);
        await this.scoringService.recalculate(userId);
        return await this.profileRepo.findProfileByUserId(userId);
    }

    async updatePayment(userId: string, updatePaymentDto: UpdatePaymentDto) {
        await this.paymentService.syncPayment(userId, updatePaymentDto);
        await this.scoringService.recalculate(userId);
        return await this.profileRepo.findProfileByUserId(userId);
    }

    async syncBranches(userId: string, updateBranchesDto: UpdateBranchesDto) {
        await this.dataSource.transaction(async (manager) => {
            const profile = await this.profileRepo.findProfileByUserId(userId, manager);
            const activeBranchIds: string[] = [];

            for (const branchDto of updateBranchesDto.branches) {
                if (branchDto.id) {
                    // Update Branch
                    const existingBranch = profile.branches.find(b => b.id === branchDto.id);
                    if (!existingBranch) continue;

                    activeBranchIds.push(branchDto.id);

                    const { servingAreas, ...basicInfo } = branchDto;
                    Object.assign(existingBranch, basicInfo);

                    if (servingAreas) {
                        await this.syncServingAreas(manager, existingBranch, servingAreas);
                    }
                    await manager.save(existingBranch);
                } else if (branchDto.isAvailable !== false) {
                    // Add new branch
                    const newBranch = this.buildBranchEntity(branchDto);
                    newBranch.providerProfile = profile;
                    const saved = await manager.save(newBranch);
                    activeBranchIds.push(saved.id);
                }
            }

            //Remove branches not in the incoming list
            const branchesToDelete = profile.branches.filter(b => !activeBranchIds.includes(b.id));
            if (branchesToDelete.length > 0) {
                for (const branch of branchesToDelete) {
                    await this.profileRepo.deleteServingAreasByBranchId(branch.id, manager);
                    await manager.remove(branch);
                }
            }
        });

        await this.scoringService.recalculate(userId);
        return await this.profileRepo.findProfileByUserId(userId);
    }

    private async syncServingAreas(manager: EntityManager, branch: BranchEntity, dtos: any[]) {
        const activeAreaIds: string[] = [];

        if (!branch.servingAreas) {
            branch.servingAreas = [];
        }

        const updatedAreas: ServingAreaEntity[] = [];

        for (const dto of dtos) {
            const incomingId = dto.areaId || dto.id;

            if (incomingId) {
                // UPDATE: Match by ID
                const existingArea = branch.servingAreas.find(a => (a.id) === (incomingId));

                if (existingArea) {
                    Object.assign(existingArea, dto);
                    await manager.save(existingArea);
                    activeAreaIds.push((existingArea.id));
                    updatedAreas.push(existingArea);
                }
            } else {
                // CREATE: No ID provided
                const newArea = manager.create(ServingAreaEntity, {
                    ...dto,
                    branch: { id: branch.id }
                } as any);
                const saved = await manager.save(newArea);
                activeAreaIds.push((saved.id));
                updatedAreas.push(saved);
            }
        }

        //Remove areas belonging to this branch that were not in the incoming list
        const areasToDelete = branch.servingAreas.filter(a => !activeAreaIds.includes((a.id)));
        if (areasToDelete.length > 0) {
            await manager.remove(areasToDelete);
        }

        branch.servingAreas = updatedAreas;
    }

    async updateBranch(userId: string, branchId: string, dto: UpdateBranchDto) {
        const branch = await this.profileRepo.findBranchById(branchId);
        if (!branch) throw new NotFoundException('Branch not found');

        const { servingAreas, ...basicInfo } = dto;

        Object.assign(branch, basicInfo);

        if (servingAreas) {
            await this.profileRepo.deleteServingAreasByBranchId(branchId);
            branch.servingAreas = servingAreas.map(area =>
                this.servingAreaRepo.create({ ...area, branch })
            );
        }

        await this.dataSource.manager.save(BranchEntity, branch);
        await this.scoringService.recalculate(userId);

        return await this.profileRepo.findProfileByUserId(userId);
    }

    async addBranch(userId: string, addBranchDto: CreateBranchDto) {
        const profile = await this.profileRepo.findProfileByUserId(userId);

        const newBranch = this.buildBranchEntity(addBranchDto);
        newBranch.providerProfile = profile;

        await this.dataSource.manager.save(BranchEntity, newBranch);
        await this.scoringService.recalculate(userId);

        return await this.profileRepo.findProfileByUserId(userId);
    }

    async deleteBranch(
        userId: string,
        branchId: string,
    ) {
        const profile = await this.profileRepo.findProfileByUserId(userId);
        const branch = await this.profileRepo.findBranchById(branchId);

        if (!branch) {
            throw new NotFoundException('Branch not found');
        }

        await this.profileRepo.deleteServingAreasByBranchId(branchId);
        await this.profileRepo.deleteBranch(branchId);

        await this.scoringService.recalculate(userId);

        return await this.profileRepo.findProfileByUserId(userId);
    }



    // ------- private helper methods ------- //

    // generate reference number 
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
        return branchesData.branches.map((branchDto: any) => this.buildBranchEntity(branchDto));
    }

    private buildBranchEntity(branchDto: any): BranchEntity {
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
    }

}
