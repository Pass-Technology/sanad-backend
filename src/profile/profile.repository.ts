import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProviderProfile } from './entities/provider-profile.entity';
import { ProviderUserInfo } from './entities/provider-user-info.entity';
import { Branch } from './entities/branch.entity';
import { ServingArea } from './entities/serving-area.entity';
import { ProviderCompliance } from './entities/provider-compliance.entity';
import { ProviderPayment } from './entities/provider-payment.entity';
import { ProviderSubscription } from './entities/provider-subscription.entity';

@Injectable()
export class ProfileRepository {
    constructor(
        @InjectRepository(ProviderProfile)
        private readonly profileRepo: Repository<ProviderProfile>,
        @InjectRepository(ProviderUserInfo)
        private readonly userInfoRepo: Repository<ProviderUserInfo>,
        @InjectRepository(Branch)
        private readonly branchRepo: Repository<Branch>,
        @InjectRepository(ServingArea)
        private readonly servingAreaRepo: Repository<ServingArea>,
        @InjectRepository(ProviderCompliance)
        private readonly complianceRepo: Repository<ProviderCompliance>,
        @InjectRepository(ProviderPayment)
        private readonly paymentRepo: Repository<ProviderPayment>,
        @InjectRepository(ProviderSubscription)
        private readonly subscriptionRepo: Repository<ProviderSubscription>,
    ) { }


    async findProfileByUserId(userId: string): Promise<ProviderProfile | null> {
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

    async createProfile(data: Partial<ProviderProfile>): Promise<ProviderProfile> {
        const profile = this.profileRepo.create(data);
        return await this.profileRepo.save(profile);
    }

    async updateProfile(
        id: string,
        data: Partial<ProviderProfile>,
    ): Promise<ProviderProfile> {
        await this.profileRepo.update(id, data);
        return await this.profileRepo.findOneOrFail({ where: { id } });
    }


    async findUserInfoByProfileId(profileId: string): Promise<ProviderUserInfo | null> {
        return await this.userInfoRepo.findOne({ where: { providerProfileId: profileId } });
    }

    async saveUserInfo(data: Partial<ProviderUserInfo>): Promise<ProviderUserInfo> {
        const existing = await this.findUserInfoByProfileId(data.providerProfileId!);
        if (existing) {
            await this.userInfoRepo.update(existing.id, data);
            return await this.userInfoRepo.findOneOrFail({ where: { id: existing.id } });
        }
        const userInfo = this.userInfoRepo.create(data);
        return await this.userInfoRepo.save(userInfo);
    }


    async findBranchesByProfileId(profileId: string): Promise<Branch[]> {
        return await this.branchRepo.find({
            where: { providerProfileId: profileId },
            relations: ['servingAreas'],
        });
    }

    async findBranchById(id: string): Promise<Branch | null> {
        return await this.branchRepo.findOne({
            where: { id },
            relations: ['servingAreas'],
        });
    }

    async saveBranch(data: Partial<Branch>): Promise<Branch> {
        const branch = this.branchRepo.create(data);
        return await this.branchRepo.save(branch);
    }

    async updateBranch(id: string, data: Partial<Branch>): Promise<Branch> {
        await this.branchRepo.update(id, data);
        return await this.branchRepo.findOneOrFail({
            where: { id },
            relations: ['servingAreas'],
        });
    }

    async deleteBranch(id: string): Promise<void> {
        await this.branchRepo.delete(id);
    }

    async deleteServingAreasByBranchId(branchId: string): Promise<void> {
        await this.servingAreaRepo.delete({ branchId });
    }

    async saveServingAreas(areas: Partial<ServingArea>[]): Promise<ServingArea[]> {
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


    async saveCompliance(data: Partial<ProviderCompliance>): Promise<ProviderCompliance> {
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


    async savePayment(data: Partial<ProviderPayment>): Promise<ProviderPayment> {
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


    async saveSubscription(data: Partial<ProviderSubscription>): Promise<ProviderSubscription> {
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
