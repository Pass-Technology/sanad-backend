import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { CreateFullProfileDto } from "./dto/create-full-profile.dto";
import { UserEntity } from "../user/entities/user.entity";
import { BranchEntity } from "./entities/branch.entity";
import { ProviderComplianceEntity } from "./entities/provider-compliance.entity";
import { ProviderPaymentEntity } from "./entities/provider-payment.entity";
import { ProviderProfileEntity } from "./entities/provider-profile.entity";
import { ProviderSubscriptionEntity } from "./entities/provider-subscription.entity";
import { ProviderUserInfoEntity } from "./entities/provider-user-info.entity";
import { ServingAreaEntity } from "./entities/serving-area.entity";
import { LOOKUP_IDS } from "../../shared/constants/lookup-ids";
import { LookUpProfileStatusEntity } from "./lookup-tables/entities/lookup-profile-status.entity";
import { LookUpProviderTypeEntity } from "./lookup-tables/entities/lookup-provider-type.entity";
import { LookUpCompanyTypeEntity } from "./lookup-tables/entities/lookup-company-type.entity";
import { SubscriptionPlanEntity } from "../subscription/entity/subscription-plan.entity";
import { LookUpBillingCycleEntity } from "./lookup-tables/entities/lookup-biling-cycle.entity";
import { CreateCompanyInfoDto } from "./dto/step-1-company-info.dto";
import { CreateUserInfoDto } from "./dto/step-2-user-info.dto";
import { CreateServicesDto } from "./dto/step-4-services.dto";
import { CreateBranchesDto } from "./dto/step-3-branches.dto";
import { CreatePaymentDto } from "./dto/step-6-payment.dto";
import { CreateComplianceDto } from "./dto/step-5-compliance.dto";
import { CreateSubscriptionDto } from "./dto/step-7-subscription.dto";

@Injectable()
export class ProfileSaverService {
    async saveFullProfile(
        manager: EntityManager,
        userId: string,
        dto: CreateFullProfileDto,
    ) {
        let profile = await manager.findOne(ProviderProfileEntity, {
            where: { user: { id: userId } },
        });
        if (!profile) {
            profile = manager.create(ProviderProfileEntity, {
                user: { id: userId } as UserEntity,
                status: { id: LOOKUP_IDS.PROFILE_STATUS.DRAFT } as LookUpProfileStatusEntity,
                currentStep: 1,
            });
            profile = await manager.save(ProviderProfileEntity, profile);
        }

        // Step 1 — Company Info
        profile.providerType = { id: dto.companyInfo.providerTypeId } as LookUpProviderTypeEntity;
        console.log(dto.companyInfo.providerTypeId)
        profile.companyType = dto.companyInfo.companyTypeId
            ? { id: dto.companyInfo.companyTypeId } as LookUpCompanyTypeEntity
            : null;
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
        let userInfo = await manager.findOne(ProviderUserInfoEntity, {
            where: { providerProfile: { id: profile.id } },
        });
        if (userInfo) {
            userInfo.fullName = dto.userInfo.fullName;
            userInfo.email = dto.userInfo.email;
            userInfo.mobileNumber = dto.userInfo.mobileNumber!;
            userInfo.nationalId = dto.userInfo.nationalId;
            userInfo.dateOfBirth = dto.userInfo.dateOfBirth!;
        } else {
            userInfo = manager.create(ProviderUserInfoEntity, {
                providerProfile: { id: profile.id } as ProviderProfileEntity,
                fullName: dto.userInfo.fullName,
                email: dto.userInfo.email,
                mobileNumber: dto.userInfo.mobileNumber ?? null,
                nationalId: dto.userInfo.nationalId,
                dateOfBirth: dto.userInfo.dateOfBirth ?? null,
            });
        }
        await manager.save(ProviderUserInfoEntity, userInfo);

        // Step 3 — Branches (clear existing, then re-create)
        const existingBranches = await manager.find(BranchEntity, {
            where: { providerProfile: { id: profile.id } },
        });
        console.log(profile.id)
        for (const b of existingBranches) {
            await manager.delete(ServingAreaEntity, { branch: { id: b.id } });
        }
        await manager.delete(BranchEntity, { providerProfile: { id: profile.id } });

        for (const branchDto of dto.branches.branches) {
            const branch = manager.create(BranchEntity, {
                providerProfile: { id: profile.id } as ProviderProfileEntity,
                branchName: branchDto.branchName,
                branchManagerName: branchDto.branchManagerName,
                branchAddress: branchDto.branchAddress,
                city: branchDto.city,
                branchPhone: branchDto.branchPhone ?? null,
                managerPhone: branchDto.managerPhone ?? null,
                googleMapsLink: branchDto.googleMapsLink ?? null,
                socialMediaLink: branchDto.socialMediaLink ?? null,
            });
            const savedBranch = await manager.save(BranchEntity, branch);

            if (branchDto.servingAreas?.length) {
                const areas = branchDto.servingAreas.map((area) =>
                    manager.create(ServingAreaEntity, {
                        branch: { id: savedBranch.id } as BranchEntity,
                        radiusKm: area.radiusKm,
                        phone: area.phone ?? null,
                        mapLink: area.mapLink ?? null,
                        lat: area.lat ?? null,
                        lng: area.lng ?? null,
                    }),
                );
                await manager.save(ServingAreaEntity, areas);
            }
        }

        // Step 5 — Compliance
        let compliance = await manager.findOne(ProviderComplianceEntity, {
            where: { providerProfile: { id: profile.id } },
        });
        if (compliance) {
            compliance.ownerIdFile = dto.compliance.ownerIdFile;
            compliance.ownerIdExpiryDate = dto.compliance.ownerIdExpiryDate;
            compliance.tradeLicenseFile = dto.compliance.tradeLicenseFile;
            compliance.tradeLicenseExpiryDate = dto.compliance.tradeLicenseExpiryDate;
        } else {
            compliance = manager.create(ProviderComplianceEntity, {
                providerProfile: { id: profile.id } as ProviderProfileEntity,
                ownerIdFile: dto.compliance.ownerIdFile,
                ownerIdExpiryDate: dto.compliance.ownerIdExpiryDate,
                tradeLicenseFile: dto.compliance.tradeLicenseFile,
                tradeLicenseExpiryDate: dto.compliance.tradeLicenseExpiryDate,
            });
        }
        await manager.save(ProviderComplianceEntity, compliance);

        // Step 6 — Payment
        let payment = await manager.findOne(ProviderPaymentEntity, {
            where: { providerProfile: { id: profile.id } },
        });
        if (payment) {
            payment.bankName = dto.payment.bankName;
            payment.accountHolderName = dto.payment.accountHolderName;
            payment.accountNumber = dto.payment.accountNumber;
            payment.iban = dto.payment.iban;
            payment.paymentMethodIds = dto.payment.paymentMethodIds;
        } else {
            payment = manager.create(ProviderPaymentEntity, {
                providerProfile: { id: profile.id } as ProviderProfileEntity,
                bankName: dto.payment.bankName,
                accountHolderName: dto.payment.accountHolderName,
                accountNumber: dto.payment.accountNumber,
                iban: dto.payment.iban,
                paymentMethodIds: dto.payment.paymentMethodIds,
            });
        }
        await manager.save(ProviderPaymentEntity, payment);

        // Step 7 — Subscription
        let subscription = await manager.findOne(ProviderSubscriptionEntity, {
            where: { providerProfile: { id: profile.id } },
        });
        if (subscription) {
            subscription.selectedPlan = { id: dto.subscription.selectedPlanId } as SubscriptionPlanEntity;
            subscription.billingCycle = { id: dto.subscription.billingCycleId } as LookUpBillingCycleEntity;
            subscription.startDate = new Date();
        } else {
            subscription = manager.create(ProviderSubscriptionEntity, {
                providerProfile: { id: profile.id } as ProviderProfileEntity,
                selectedPlan: { id: dto.subscription.selectedPlanId } as SubscriptionPlanEntity,
                billingCycle: { id: dto.subscription.billingCycleId } as LookUpBillingCycleEntity,
                startDate: new Date(),
            });
        }
        await manager.save(ProviderSubscriptionEntity, subscription);

        // finalization fields
        await manager.update(ProviderProfileEntity, profile.id, {
            currentStep: 8,
            status: { id: LOOKUP_IDS.PROFILE_STATUS.PENDING_REVIEW } as LookUpProfileStatusEntity,
        });

        const completeProfile = await manager.findOne(ProviderProfileEntity, {
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

        await manager.update(UserEntity, userId, {
            isProfileCompleted: true,
        });
        return completeProfile!;


    }



    // createCompanyEntity(companyInfo: CreateCompanyInfoDto, userId: string, manager: EntityManager) {
    //     // if (manager)
    //     return manager.create(ProviderProfileEntity, {
    //         user: { id: userId } as UserEntity,
    //         status: { id: LOOKUP_IDS.PROFILE_STATUS.DRAFT } as LookUpProfileStatusEntity,
    //         currentStep: 1,
    //     });


    // }

    async createUserInfoEntity(userInfo: CreateUserInfoDto, manager: EntityManager) {
        return manager.create(ProviderUserInfoEntity, {
            ...userInfo
        });
    }

    createBranchEntities(branches: CreateBranchesDto, manager: EntityManager) {
        const { branches: allBranches } = branches;

        const branchEntities: BranchEntity[] = [];
        for (const branchDto of allBranches) {

            const { servingAreas } = branchDto;
            const branchServingAreaEntities: ServingAreaEntity[] = [];
            if (servingAreas?.length) {
                for (const area of servingAreas) {
                    branchServingAreaEntities.push(
                        manager.create(ServingAreaEntity, {
                            radiusKm: area.radiusKm,
                            phone: area.phone ?? null,
                            mapLink: area.mapLink ?? null,
                            lat: area.lat ?? null,
                            lng: area.lng ?? null,
                        }),)
                }

            }


            branchEntities.push(manager.create(BranchEntity, {
                // providerProfile: { id: profile.id } as ProviderProfileEntity,
                branchName: branchDto.branchName,
                branchManagerName: branchDto.branchManagerName,
                branchAddress: branchDto.branchAddress,
                city: branchDto.city,
                branchPhone: branchDto.branchPhone ?? null,
                managerPhone: branchDto.managerPhone ?? null,
                googleMapsLink: branchDto.googleMapsLink ?? null,
                socialMediaLink: branchDto.socialMediaLink ?? null,
                servingAreas: branchServingAreaEntities
            }))
            // const savedBranch = await manager.save(BranchEntity, branch);


        }

        return branchEntities;
    }

    createServicesEntities(services: CreateServicesDto, manager: EntityManager) {
    }

    createPayementEntity(payment: CreatePaymentDto, manager: EntityManager) {
        return manager.create(ProviderPaymentEntity, {
            ...payment
        });
    }

    createComplianceEntity(compliance: CreateComplianceDto, manager: EntityManager) {
        return manager.create(ProviderComplianceEntity, {

            ...compliance
        });
    }


    createSubscriptionEntity(subscription: CreateSubscriptionDto, manager: EntityManager) {
        const { selectedPlanId, billingCycleId } = subscription;
        return manager.create(ProviderSubscriptionEntity, {
            selectedPlan: { id: selectedPlanId },
            billingCycle: { id: billingCycleId },
            startDate: new Date(),
        });
    }


    createProviderProfile(companyInfo: CreateCompanyInfoDto, userInfo: ProviderUserInfoEntity,
        branches: BranchEntity[], payment: ProviderPaymentEntity,
        ProviderCompliance: ProviderComplianceEntity,
        subscription: ProviderSubscriptionEntity,
        services: CreateServicesDto, userId: string, manager: EntityManager) {


        // const { providerTypeId } = companyInfo;

        return manager.create(ProviderProfileEntity, {
            user: { id: userId } as UserEntity,
            status: { id: LOOKUP_IDS.PROFILE_STATUS.DRAFT },
            // statusId
            selectedServiceIds: services.selectedServiceIds,
            providerType: { id: companyInfo.providerTypeId },
            companyType: companyInfo.companyTypeId
                ? { id: companyInfo.companyTypeId } as LookUpCompanyTypeEntity
                : null,
            tradeName: companyInfo.tradeName,
            companyRepresentativeName: companyInfo.companyRepresentativeName ?? null,
            companyDescription: companyInfo.companyDescription ?? null,
            socialMediaLink: companyInfo.socialMediaLink ?? null,
            websiteLink: companyInfo.websiteLink ?? null,
            languagesSpoken: companyInfo.languagesSpoken ?? null,
            userInfo: userInfo,
            branches: branches,
            payment: payment,
            ProviderCompliance: ProviderCompliance,
            subscription: subscription
        });

    }


    saveProviderProfile(providerProfileEntity: ProviderProfileEntity, manager: EntityManager) {
        return manager.save(ProviderProfileEntity, providerProfileEntity)
    }

}