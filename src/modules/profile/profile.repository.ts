import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProviderProfileEntity } from './entities/provider-profile.entity';
import { ProviderUserInfoEntity } from './entities/provider-user-info.entity';
import { BranchEntity } from './entities/branch.entity';
import { ServingAreaEntity } from './entities/serving-area.entity';
import { ProviderComplianceEntity } from './entities/provider-compliance.entity';
import { ProviderPaymentEntity } from './entities/provider-payment.entity';
import { ProviderSubscriptionEntity } from './entities/provider-subscription.entity';

@Injectable()
export class ProfileRepository {
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
        @InjectRepository(ProviderSubscriptionEntity)
        private readonly subscriptionRepo: Repository<ProviderSubscriptionEntity>,
    ) { }

    /**
     *
     * @param userId
     * @returns provider profile if it exists | null if not
     */
    async findProfileByUserId(userId: string): Promise<ProviderProfileEntity | null> {
        return await this.profileRepo.findOne({
            where: { userId },
            relations: [
                'userInfo',
                'branches',
                'branches.servingAreas',
                'compliance',
                'payment',
                'subscription',
            ],
        });
    }
    /**
     *
     * @param data
     * @returns provider profile
     */
    async createProfile(data: Partial<ProviderProfileEntity>): Promise<ProviderProfileEntity> {
        const profile = this.profileRepo.create(data);
        return await this.profileRepo.save(profile);
    }

    /**
     *
     * @param id
     * @param data
     * @returns updated provider profile
     */
    async updateProfile(
        id: string,
        data: Partial<ProviderProfileEntity>,
    ): Promise<ProviderProfileEntity> {
        await this.profileRepo.update(id, data);
        return await this.profileRepo.findOneOrFail({ where: { id } });
    }

    /**
     *
     * @param profileId
     * @returns provider user info
     */
    async findUserInfoByProfileId(profileId: string): Promise<ProviderUserInfoEntity | null> {
        return await this.userInfoRepo.findOne({ where: { providerProfileId: profileId } });
    }

    /**
     *
     * @param data
     * @returns proivder user info
     */
    async saveUserInfo(data: Partial<ProviderUserInfoEntity>): Promise<ProviderUserInfoEntity> {
        const existing = await this.findUserInfoByProfileId(data.providerProfileId!);
        if (existing) {
            await this.userInfoRepo.update(existing.id, data);
            return await this.userInfoRepo.findOneOrFail({ where: { id: existing.id } });
        }
        const userInfo = this.userInfoRepo.create(data);
        return await this.userInfoRepo.save(userInfo);
    }


    async findBranchesByProfileId(profileId: string): Promise<BranchEntity[]> {
        return await this.branchRepo.find({
            where: { providerProfileId: profileId },
            relations: ['servingAreas'],
        });
    }

    async findBranchById(id: string): Promise<BranchEntity | null> {
        return await this.branchRepo.findOne({
            where: { id },
            relations: ['servingAreas'],
        });
    }

    async saveBranch(data: Partial<BranchEntity>): Promise<BranchEntity> {
        const branch = this.branchRepo.create(data);
        return await this.branchRepo.save(branch);
    }

    async updateBranch(id: string, data: Partial<BranchEntity>): Promise<BranchEntity> {
        await this.branchRepo.update(id, data);
        return await this.branchRepo.findOneOrFail({
            where: { id },
            relations: ['servingAreas'],
        });
    }

    async deleteBranch(id: string): Promise<void> {
        await this.branchRepo.softDelete(id);
    }

    async deleteServingAreasByBranchId(branchId: string): Promise<void> {
        // await this.servingAreaRepo.delete({ branchId });
    }

    async saveServingAreas(areas: Partial<ServingAreaEntity>[]): Promise<ServingAreaEntity[]> {
        const entities = this.servingAreaRepo.create(areas);
        return await this.servingAreaRepo.save(entities);
    }

    async deleteBranchesByProfileId(profileId: string): Promise<void> {
        const branches = await this.findBranchesByProfileId(profileId);
        for (const branch of branches) {
            await this.deleteServingAreasByBranchId(branch.id);
        }
        await this.branchRepo.delete({ providerProfileId: profileId });
    }


    async saveCompliance(data: Partial<ProviderComplianceEntity>): Promise<ProviderComplianceEntity> {
        const existing = await this.complianceRepo.findOne({
            where: { providerProfileId: data.providerProfileId! },
        });
        if (existing) {
            await this.complianceRepo.update(existing.id, data);
            return await this.complianceRepo.findOneOrFail({ where: { id: existing.id } });
        }
        const compliance = this.complianceRepo.create(data);
        return await this.complianceRepo.save(compliance);
    }


    async savePayment(data: Partial<ProviderPaymentEntity>): Promise<ProviderPaymentEntity> {
        const existing = await this.paymentRepo.findOne({
            where: { providerProfileId: data.providerProfileId! },
        });
        if (existing) {
            await this.paymentRepo.update(existing.id, data);
            return await this.paymentRepo.findOneOrFail({ where: { id: existing.id } });
        }
        const payment = this.paymentRepo.create(data);
        return await this.paymentRepo.save(payment);
    }


    async saveSubscription(data: Partial<ProviderSubscriptionEntity>): Promise<ProviderSubscriptionEntity> {
        const existing = await this.subscriptionRepo.findOne({
            where: { providerProfileId: data.providerProfileId! },
        });
        if (existing) {
            await this.subscriptionRepo.update(existing.id, data);
            return await this.subscriptionRepo.findOneOrFail({ where: { id: existing.id } });
        }
        const subscription = this.subscriptionRepo.create(data);
        return await this.subscriptionRepo.save(subscription);
    }
}
