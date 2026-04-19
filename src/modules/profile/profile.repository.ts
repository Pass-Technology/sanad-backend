import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
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


    async findProfileByUserId(userId: string, manager?: EntityManager): Promise<ProviderProfileEntity> {
        const repo = manager ? manager.getRepository(ProviderProfileEntity) : this.profileRepo;

        const profile = await repo.findOne({
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
                payment: {
                    cash: true,
                    bankTransfer: { bankAccount: true },
                    paymentLink: true,
                    sanad: { bankAccount: true },
                    pos: true,
                    cheque: true,
                    bankAccounts: true,
                },
                selectedServices: {
                    category: true,
                    children: true
                },
                languages: true
            }
        });
        if (!profile) {
            throw new NotFoundException('Profile not found. Please start the setup process.');
        }
        return profile;
    }

    // async createProfile(data: Partial<ProviderProfileEntity>, manager?: EntityManager): Promise<ProviderProfileEntity> {
    //     const repo = manager ? manager.getRepository(ProviderProfileEntity) : this.profileRepo;
    //     const profile = repo.create(data);
    //     return await repo.save(profile);
    // }



    async findBranchById(id: string, manager?: EntityManager): Promise<BranchEntity | null> {
        const repo = manager ? manager.getRepository(BranchEntity) : this.branchRepo;
        return await repo.findOne({
            where: { id },
            relations: {
                servingAreas: true,
                providerProfile: true
            }

            // ['servingAreas', 'providerProfile'],
        });
    }


    async updateBranch(id: string, data: Partial<BranchEntity>, manager?: EntityManager): Promise<BranchEntity> {
        const repo = manager ? manager.getRepository(BranchEntity) : this.branchRepo;
        await repo.update(id, data);
        return await repo.findOneOrFail({
            where: { id },
            relations: {
                servingAreas: true,
                providerProfile: true
            }

            // ['servingAreas'],
        });
    }

    async deleteBranch(id: string, manager?: EntityManager): Promise<void> {
        const repo = manager ? manager.getRepository(BranchEntity) : this.branchRepo;
        await repo.delete(id);
    }

    async deleteServingAreasByBranchId(branchId: string, manager?: EntityManager): Promise<void> {
        const repo = manager ? manager.getRepository(ServingAreaEntity) : this.servingAreaRepo;
        await repo.delete({ branch: { id: branchId } });
    }

    async saveServingAreas(areas: Partial<ServingAreaEntity>[], manager?: EntityManager): Promise<ServingAreaEntity[]> {
        const repo = manager ? manager.getRepository(ServingAreaEntity) : this.servingAreaRepo;
        const entities = repo.create(areas);
        return await repo.save(entities);
    }




    async isUserHaveProfile(userId: string): Promise<boolean> {

        return await this.profileRepo.exists({ where: { user: { id: userId } } })

    }
}
