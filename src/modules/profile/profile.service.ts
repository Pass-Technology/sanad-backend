import {
    Injectable,
    NotFoundException,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProfileRepository } from './profile.repository';
import { CreateBranchDto, CreateBranchesDto } from './dto/step-3-branches.dto';
import { CreateFullProfileDto } from './dto/create-full-profile.dto';

import { ProviderProfileEntity } from './entities/provider-profile.entity';
import { ProviderUserInfoEntity } from './entities/provider-user-info.entity';
import { BranchEntity } from './entities/branch.entity';
import { ProviderComplianceEntity } from './entities/provider-compliance.entity';
import { ProviderPaymentEntity } from './entities/provider-payment.entity';
import { LookUpService } from './lookup-tables/lookup.service';
import { ProfileSaverService } from './profile-saver.service';
import { CreateCompanyInfoDto } from './dto/step-1-company-info.dto';
import { CreateUserInfoDto } from './dto/step-2-user-info.dto';
import { CreateServicesDto } from './dto/step-4-services.dto';
import { CreatePaymentDto } from './dto/step-6-payment.dto';
import { CreateComplianceDto } from './dto/step-5-compliance.dto';


@Injectable()
export class ProfileService {
    constructor(
        private readonly profileRepo: ProfileRepository,
        private readonly dataSource: DataSource,
        private readonly lookupService: LookUpService,
        private readonly profileSaver: ProfileSaverService,
    ) { }


    async submitFullProfile(
        userId: string,
        profileDto: CreateFullProfileDto,
    ) {

        const isUserHaveProfile = await this.profileRepo.isUserHaveProfile(userId);

        if (isUserHaveProfile) {
            throw new HttpException(`User Already Have An Profile`, HttpStatus.BAD_REQUEST)
        }

        const { companyInfo, userInfo, services, branches, payment, compliance } = profileDto;

        const userInfoEntity = await this.processUserInfo(userInfo);

        const brancheEntities = await this.processBranches(branches);

        const payementEntity = await this.processPayement(payment);

        const complianceEntity = await this.processCompliance(compliance);

        const providerProfileEnity = await this.processProviderProfile
            (companyInfo, userInfoEntity, brancheEntities, payementEntity, complianceEntity, services, userId);

        return await this.profileSaver.saveProviderProfile(providerProfileEnity)

    }

    async processCompanyInfo(companyInfo: CreateCompanyInfoDto, userId: string) {
        const { providerTypeId, companyTypeId } = companyInfo;

        const isValidProvider =
            await this.lookupService.isProviderTypeExist(providerTypeId);

        if (!isValidProvider) throw new HttpException('Invalid provider type id', HttpStatus.BAD_REQUEST);


        if (companyTypeId) {
            const isValidCompany =
                await this.lookupService.isCompanyTypeExist(companyTypeId);

            if (!isValidCompany)
                throw new HttpException('Invalid company type id', HttpStatus.BAD_REQUEST);
        }

    }

    async processUserInfo(userInfo: CreateUserInfoDto) {

        return await this.profileSaver.createUserInfoEntity(userInfo)
    }



    async processBranches(branches: CreateBranchesDto) {
        return this.profileSaver.createBranchEntities(branches)
    }


    async processPayement(payment: CreatePaymentDto) {
        return await this.profileSaver.createPayementEntity(payment)
    }

    async processCompliance(compliance: CreateComplianceDto) {
        return this.profileSaver.createComplianceEntity(compliance)
    }




    async processProviderProfile(
        companyInfo: CreateCompanyInfoDto, userInfo: ProviderUserInfoEntity,
        branches: BranchEntity[], payment: ProviderPaymentEntity,
        compliance: ProviderComplianceEntity,
        services: CreateServicesDto, userId: string) {
        return this.profileSaver.createProviderProfile(companyInfo, userInfo, branches, payment, compliance, services, userId)
    }



    async getMyProfile(userId: string): Promise<ProviderProfileEntity> {
        return await this.profileRepo.findProfileByUserId(userId);
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
}
