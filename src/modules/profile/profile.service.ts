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
import { PaymentCashEntity } from './entities/payment-methods/payment-cash.entity';
import { PaymentBankTransferEntity } from './entities/payment-methods/payment-bank-transfer.entity';
import { PaymentLinkEntity } from './entities/payment-methods/payment-link.entity';
import { PaymentSanadEntity } from './entities/payment-methods/payment-sanad.entity';
import { PaymentPosEntity } from './entities/payment-methods/payment-pos.entity';
import { PaymentChequeEntity } from './entities/payment-methods/payment-cheque.entity';
import { BankAccountEntity } from './entities/payment-methods/bank-account.entity';
import { ServingAreaEntity } from './entities/serving-area.entity';
import { ServiceEntity } from '../service-management/entities/service.entity';
import { LookUpService } from '../lookups/lookup.service';
import { ServiceManagementService } from '../service-management/service-management.service';
import { CreateServicesDto } from './dto/step-4-services.dto';
import { CreatePaymentDto } from './dto/step-6-payment.dto';
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
        @InjectRepository(PaymentCashEntity)
        private readonly paymentCashRepo: Repository<PaymentCashEntity>,
        @InjectRepository(PaymentBankTransferEntity)
        private readonly paymentBankTransferRepo: Repository<PaymentBankTransferEntity>,
        @InjectRepository(PaymentLinkEntity)
        private readonly paymentLinkRepo: Repository<PaymentLinkEntity>,
        @InjectRepository(PaymentSanadEntity)
        private readonly paymentSanadRepo: Repository<PaymentSanadEntity>,
        @InjectRepository(PaymentPosEntity)
        private readonly paymentPosRepo: Repository<PaymentPosEntity>,
        @InjectRepository(PaymentChequeEntity)
        private readonly paymentChequeRepo: Repository<PaymentChequeEntity>,
        private readonly userRepo: UserRepository,
        private readonly dataSource: DataSource,
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
            const profile = await this.profileRepo.createProfile(profileData as any, manager);

            // 3. Mark user profile as complete
            await this.userRepo.updateProfileCompletionStatus(userId, true, manager);

            return profile;
        });
    }

    private async buildFullProfileObject(manager: any, userId: string, dto: CreateFullProfileDto) {
        const { companyInfo, userInfo, services, branches, payment, compliance } = dto;

        return {
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
            payment: this.buildPaymentEntity(manager, payment),
            compliance: manager.create(ProviderComplianceEntity, compliance),
        };
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

    // build payment entities
    private buildPaymentEntity(manager: any, paymentDto: CreatePaymentDto): ProviderPaymentEntity {
        const payment = manager.create(ProviderPaymentEntity, { bankAccounts: [] });

        this.addCashMethods(manager, payment, paymentDto);
        this.addBankTransferMethods(manager, payment, paymentDto);
        this.addSanadMethods(manager, payment, paymentDto);
        this.addPosMethods(manager, payment, paymentDto);
        this.addChequeMethods(manager, payment, paymentDto);
        this.addPaymentLinkMethods(manager, payment, paymentDto);

        return payment;
    }

    private addCashMethods(manager: any, payment: ProviderPaymentEntity, dto: CreatePaymentDto) {
        if (dto.cash?.isEnabled) {
            payment.cash = manager.create(PaymentCashEntity, { ...dto.cash, providerPayment: payment });
        }
    }

    private addBankTransferMethods(manager: any, payment: ProviderPaymentEntity, dto: CreatePaymentDto) {
        if (dto.bankTransfer?.length) {
            payment.bankTransfer = dto.bankTransfer
                .filter(btDto => btDto.isEnabled)
                .map(btDto => {
                    const bankAccount = this.createBankAccount(manager, payment, btDto);
                    return manager.create(PaymentBankTransferEntity, {
                        isEnabled: btDto.isEnabled,
                        providerPayment: payment,
                        bankAccount,
                    });
                });
        }
    }

    private addSanadMethods(manager: any, payment: ProviderPaymentEntity, dto: CreatePaymentDto) {
        if (dto.sanad?.length) {
            payment.sanad = dto.sanad
                .filter(sanadDto => sanadDto.isEnabled)
                .map(sanadDto => {
                    let bankAccount: BankAccountEntity;

                    if (sanadDto.isUsingBankTransferData) {
                        if (payment.bankTransfer?.length > 0) {
                            bankAccount = payment.bankTransfer[0].bankAccount;
                        } else {
                            throw new BadRequestException(
                                'Cannot use bank transfer data for Sanad because no bank transfer method was provided',
                            );
                        }
                    } else {
                        bankAccount = this.createBankAccount(manager, payment, sanadDto);
                    }

                    return manager.create(PaymentSanadEntity, {
                        isEnabled: sanadDto.isEnabled,
                        settlementPreference: sanadDto.settlementPreference,
                        isUsingBankTransferData: sanadDto.isUsingBankTransferData,
                        providerPayment: payment,
                        bankAccount,
                    });
                });
        }
    }

    private addPosMethods(manager: any, payment: ProviderPaymentEntity, dto: CreatePaymentDto) {
        if (dto.pos?.length) {
            payment.pos = dto.pos
                .filter(posDto => posDto.isEnabled)
                .map(posDto =>
                    manager.create(PaymentPosEntity, { ...posDto, providerPayment: payment })
                );
        }
    }

    private addChequeMethods(manager: any, payment: ProviderPaymentEntity, dto: CreatePaymentDto) {
        if (dto.cheque?.isEnabled) {
            payment.cheque = manager.create(PaymentChequeEntity, { ...dto.cheque, providerPayment: payment });
        }
    }

    private addPaymentLinkMethods(manager: any, payment, dto: CreatePaymentDto) {
        if (dto.paymentLink?.length) {
            payment.paymentLink = dto.paymentLink
                .filter(linkDto => linkDto.isEnabled)
                .map(linkDto =>
                    manager.create(PaymentLinkEntity, { ...linkDto, providerPayment: payment })
                );
        }
    }

    private createBankAccount(manager: any, payment: ProviderPaymentEntity, data: any): BankAccountEntity {
        const bankAccount = manager.create(BankAccountEntity, {
            bankName: data.bankName,
            accountHolderName: data.accountHolderName,
            accountNumber: data.accountNumber,
            iban: data.iban,
            swiftCode: data.swiftCode,
            providerPayment: payment,
        });
        payment.bankAccounts.push(bankAccount);
        return bankAccount;
    }

}
