import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { BranchEntity } from "./entities/branch.entity";
import { ProviderComplianceEntity } from "./entities/provider-compliance.entity";
import { ProviderPaymentEntity } from "./entities/provider-payment.entity";
import { ProviderProfileEntity } from "./entities/provider-profile.entity";
import { ProviderUserInfoEntity } from "./entities/provider-user-info.entity";
import { ServingAreaEntity } from "./entities/serving-area.entity";
import { LOOKUP_IDS } from "../../shared/constants/lookup-ids";
import { CreateCompanyInfoDto } from "./dto/step-1-company-info.dto";
import { CreateUserInfoDto } from "./dto/step-2-user-info.dto";
import { CreateServicesDto } from "./dto/step-4-services.dto";
import { CreateBranchesDto } from "./dto/step-3-branches.dto";
import { CreatePaymentDto } from "./dto/step-6-payment.dto";
import { CreateComplianceDto } from "./dto/step-5-compliance.dto";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ProfileSaverService {
    constructor(
        @InjectRepository(ProviderProfileEntity)
        private readonly profileRepo: Repository<ProviderProfileEntity>,
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
    ) { }


    async createUserInfoEntity(userInfo: CreateUserInfoDto) {
        return this.userInfoRepo.create(userInfo);
    }

    createBranchEntities(branches: CreateBranchesDto) {
        const { branches: allBranches } = branches;

        return allBranches.map((branchDto) => {
            const servingAreas = (branchDto.servingAreas ?? []).map((area) =>
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

    createServicesEntities(services: CreateServicesDto) {
        // return this.servingAreaRepo.create(services);
    }

    async createPayementEntity(payment: CreatePaymentDto) {
        return this.paymentRepo.create(payment);
    }

    async createComplianceEntity(compliance: CreateComplianceDto) {
        return this.complianceRepo.create(compliance);
    }





    async createProviderProfile(companyInfo: CreateCompanyInfoDto, userInfo: ProviderUserInfoEntity,
        branches: BranchEntity[], payment: ProviderPaymentEntity,
        compliance: ProviderComplianceEntity,
        services: CreateServicesDto, userId: string) {
        const newProfile = this.profileRepo.create({
            user: { id: userId },
            status: { id: LOOKUP_IDS.PROFILE_STATUS.DRAFT },
            providerType: { id: companyInfo.providerTypeId },
            companyType: companyInfo.companyTypeId ? { id: companyInfo.companyTypeId } : null,
            tradeName: companyInfo.tradeName,
            companyRepresentativeName: companyInfo.companyRepresentativeName,
            companyDescription: companyInfo.companyDescription,
            socialMediaLink: companyInfo.socialMediaLink,
            websiteLink: companyInfo.websiteLink,
            languagesSpoken: companyInfo.languagesSpoken,
            selectedServiceIds: services?.selectedServiceIds ?? [],
            userInfo,
            branches,
            payment,
            compliance,
        })

        return await this.profileRepo.save(newProfile);

    }


    async saveProviderProfile(providerProfileEntity: ProviderProfileEntity): Promise<ProviderProfileEntity> {
        return await this.profileRepo.save(providerProfileEntity);
    }

}