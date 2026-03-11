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
}