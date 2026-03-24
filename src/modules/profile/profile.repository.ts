import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProviderProfileEntity } from './entities/provider-profile.entity';
import { BranchEntity } from './entities/branch.entity';
import { ServingAreaEntity } from './entities/serving-area.entity';


@Injectable()
export class ProfileRepository {
    constructor(
        @InjectRepository(ProviderProfileEntity)
        private readonly profileRepo: Repository<ProviderProfileEntity>,
        @InjectRepository(BranchEntity)
        private readonly branchRepo: Repository<BranchEntity>,
        @InjectRepository(ServingAreaEntity)
        private readonly servingAreaRepo: Repository<ServingAreaEntity>,
    ) { }


    async findProfileByUserId(userId: string): Promise<ProviderProfileEntity> {

        const profile = await this.profileRepo.findOne({
            where: { user: { id: userId } },
            relations: {
                status: true,
                providerType: true,
                user: true,
                userInfo: true,
                branches: {
                    servingAreas: true
                },
                compliance: true,
                payment: true,
                selectedServices: {
                    category: true,
                    children: true
                }
            }
        });
        if (!profile) {
            throw new NotFoundException('Profile not found. Please start the setup process.');
        }
        return profile;
    }

    async createProfile(data: Partial<ProviderProfileEntity>): Promise<ProviderProfileEntity> {
        const profile = this.profileRepo.create(data);
        return await this.profileRepo.save(profile);
    }



    async findBranchById(id: string): Promise<BranchEntity | null> {
        return await this.branchRepo.findOne({
            where: { id },
            relations: ['servingAreas', 'providerProfile'],
        });
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
        await this.servingAreaRepo.delete({ branch: { id: branchId } });
    }

    async saveServingAreas(areas: Partial<ServingAreaEntity>[]): Promise<ServingAreaEntity[]> {
        const entities = this.servingAreaRepo.create(areas);
        return await this.servingAreaRepo.save(entities);
    }




    async isUserHaveProfile(userId: string): Promise<boolean> {

        return await this.profileRepo.exists({ where: { user: { id: userId } } })

    }
}
