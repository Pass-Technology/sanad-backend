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

@Injectable()
export class ProfileSaverService {
    async saveFullProfile(
        manager: EntityManager,
        userId: string,
        dto: CreateFullProfileDto,
    ) {
        let profile = await manager.findOne(ProviderProfileEntity, { where: { userId } });
        if (!profile) {
            profile = manager.create(ProviderProfileEntity, {
                userId,
                statusId: LOOKUP_IDS.PROFILE_STATUS.DRAFT,
                currentStep: 1,
            });
            profile = await manager.save(ProviderProfileEntity, profile);
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
        let userInfo = await manager.findOne(ProviderUserInfoEntity, {
            where: { providerProfileId: profile.id },
        });
        if (userInfo) {
            userInfo.fullName = dto.userInfo.fullName;
            userInfo.email = dto.userInfo.email;
            userInfo.mobileNumber = dto.userInfo.mobileNumber!;
            userInfo.nationalId = dto.userInfo.nationalId;
            userInfo.dateOfBirth = dto.userInfo.dateOfBirth!;
        } else {
            userInfo = manager.create(ProviderUserInfoEntity, {
                providerProfileId: profile.id,
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
            where: { providerProfileId: profile.id },
        });
        console.log(profile.id)
        for (const b of existingBranches) {
            await manager.delete(ServingAreaEntity, { branchId: b.id });
        }
        await manager.delete(BranchEntity, { providerProfileId: profile.id });

        for (const branchDto of dto.branches.branches) {
            const branch = manager.create(BranchEntity, {
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
            const savedBranch = await manager.save(BranchEntity, branch);

            if (branchDto.servingAreas?.length) {
                const areas = branchDto.servingAreas.map((area) =>
                    manager.create(ServingAreaEntity, {
                        branchId: savedBranch.id,
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
            where: { providerProfileId: profile.id },
        });
        if (compliance) {
            compliance.ownerIdFile = dto.compliance.ownerIdFile;
            compliance.ownerIdExpiryDate = dto.compliance.ownerIdExpiryDate;
            compliance.tradeLicenseFile = dto.compliance.tradeLicenseFile;
            compliance.tradeLicenseExpiryDate = dto.compliance.tradeLicenseExpiryDate;
        } else {
            compliance = manager.create(ProviderComplianceEntity, {
                providerProfileId: profile.id,
                ownerIdFile: dto.compliance.ownerIdFile,
                ownerIdExpiryDate: dto.compliance.ownerIdExpiryDate,
                tradeLicenseFile: dto.compliance.tradeLicenseFile,
                tradeLicenseExpiryDate: dto.compliance.tradeLicenseExpiryDate,
            });
        }
        await manager.save(ProviderComplianceEntity, compliance);

        // Step 6 — Payment
        let payment = await manager.findOne(ProviderPaymentEntity, {
            where: { providerProfileId: profile.id },
        });
        if (payment) {
            payment.bankName = dto.payment.bankName;
            payment.accountHolderName = dto.payment.accountHolderName;
            payment.accountNumber = dto.payment.accountNumber;
            payment.iban = dto.payment.iban;
            payment.paymentMethodIds = dto.payment.paymentMethodIds;
        } else {
            payment = manager.create(ProviderPaymentEntity, {
                providerProfileId: profile.id,
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
            where: { providerProfileId: profile.id },
        });
        if (subscription) {
            subscription.selectedPlanId = dto.subscription.selectedPlanId;
            subscription.billingCycle.id = dto.subscription.billingCycleId;
            subscription.startDate = new Date();
        } else {
            subscription = manager.create(ProviderSubscriptionEntity, {
                providerProfileId: profile.id,
                selectedPlanId: dto.subscription.selectedPlanId,
                billingCycleId: dto.subscription.billingCycleId,
                startDate: new Date(),
            });
        }
        await manager.save(ProviderSubscriptionEntity, subscription);

        // finalization fields
        await manager.update(ProviderProfileEntity, profile.id, {
            currentStep: 8,
            statusId: LOOKUP_IDS.PROFILE_STATUS.PENDING_REVIEW
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

        await manager.update(UserEntity, profile.userId, {
            isProfileCompleted: true,
        });
        return completeProfile!;


    }
}