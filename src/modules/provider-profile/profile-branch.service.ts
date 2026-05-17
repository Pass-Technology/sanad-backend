import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, DataSource } from 'typeorm';
import { BranchEntity } from './entities/branch.entity';
import { ServingAreaEntity } from './entities/serving-area.entity';
import { ProviderProfileEntity } from './entities/provider-profile.entity';
import { ProfileRepository } from './profile.repository';
import { CreateBranchDto, CreateBranchesDto, ServingAreaDto } from './dto/create-branches.dto';
import { UpdateBranchDto, UpdateBranchesDto } from './dto/update-full-profile.dto';

@Injectable()
export class ProfileBranchService {
    constructor(
        private readonly profileRepo: ProfileRepository,
        @InjectRepository(BranchEntity)
        private readonly branchRepo: Repository<BranchEntity>,
        @InjectRepository(ServingAreaEntity)
        private readonly servingAreaRepo: Repository<ServingAreaEntity>,
        private readonly dataSource: DataSource,
    ) {}

    async syncBranches(
        userId: string,
        profile: ProviderProfileEntity,
        updateBranchesDto: UpdateBranchesDto,
        manager: EntityManager
    ): Promise<void> {
        const activeBranchIds: string[] = [];

        for (const branchDto of updateBranchesDto.branches) {
            if (branchDto.id) {
                // Update Branch
                const existingBranch = profile.branches.find(b => b.id === branchDto.id);
                if (!existingBranch) continue;

                activeBranchIds.push(branchDto.id);

                const { servingAreas, ...basicInfo } = branchDto;
                Object.assign(existingBranch, basicInfo);

                if (servingAreas) {
                    await this.syncServingAreas(manager, existingBranch, servingAreas);
                }
                await manager.save(existingBranch);
            } else {
                // Add new branch
                const newBranch = this.buildBranchEntity(branchDto);
                newBranch.providerProfile = profile;
                const saved = await manager.save(newBranch);
                activeBranchIds.push(saved.id);
            }
        }

        // Remove branches not in the incoming list
        const branchesToDelete = profile.branches.filter(b => !activeBranchIds.includes(b.id));
        if (branchesToDelete.length > 0) {
            for (const branch of branchesToDelete) {
                await this.profileRepo.deleteServingAreasByBranchId(branch.id, manager);
                await manager.remove(branch);
            }
        }
    }

    async syncServingAreas(manager: EntityManager, branch: BranchEntity, dtos: ServingAreaDto[]): Promise<void> {
        const activeAreaIds: string[] = [];

        if (!branch.servingAreas) {
            branch.servingAreas = [];
        }

        const updatedAreas: ServingAreaEntity[] = [];

        for (const dto of dtos) {
            if (dto.id) {
                // UPDATE: Match by ID
                const existingArea = branch.servingAreas.find(a => String(a.id) === String(dto.id));

                if (existingArea) {
                    Object.assign(existingArea, dto);
                    await manager.save(existingArea);
                    activeAreaIds.push(existingArea.id);
                    updatedAreas.push(existingArea);
                }
            } else {
                // CREATE: No ID provided
                const newArea = manager.create(ServingAreaEntity, {
                    ...dto,
                    branch: { id: branch.id }
                });
                const saved = await manager.save(newArea);
                activeAreaIds.push(saved.id);
                updatedAreas.push(saved);
            }
        }

        // Remove areas belonging to this branch that were not in the incoming list
        const areasToDelete = branch.servingAreas.filter(a => !activeAreaIds.includes(String(a.id)));
        if (areasToDelete.length > 0) {
            await manager.remove(areasToDelete);
        }

        branch.servingAreas = updatedAreas;
    }

    async updateBranch(userId: string, branchId: string, updateBranchDto: UpdateBranchDto): Promise<void> {
        const branch = await this.profileRepo.findBranchById(branchId);
        if (!branch) throw new NotFoundException('Branch not found');

        const { servingAreas, ...basicInfo } = updateBranchDto;

        Object.assign(branch, basicInfo);

        if (servingAreas) {
            await this.profileRepo.deleteServingAreasByBranchId(branchId);
            branch.servingAreas = servingAreas.map(area =>
                this.servingAreaRepo.create({ ...area, branch })
            );
        }

        await this.dataSource.manager.save(BranchEntity, branch);
    }

    async addBranch(profile: ProviderProfileEntity, addBranchDto: CreateBranchDto): Promise<void> {
        const newBranch = this.buildBranchEntity(addBranchDto);
        newBranch.providerProfile = profile;
        await this.dataSource.manager.save(BranchEntity, newBranch);
    }

    async deleteBranch(branchId: string): Promise<void> {
        const branch = await this.profileRepo.findBranchById(branchId);
        if (!branch) {
            throw new NotFoundException('Branch not found');
        }

        await this.profileRepo.deleteServingAreasByBranchId(branchId);
        await this.profileRepo.deleteBranch(branchId);
    }

    buildBranchEntities(branchesData: UpdateBranchesDto | CreateBranchesDto): BranchEntity[] {
        return branchesData.branches.map((branchDto) => this.buildBranchEntity(branchDto));
    }

    buildBranchEntity(branchDto: CreateBranchDto | UpdateBranchDto): BranchEntity {
        const servingAreas = (branchDto.servingAreas ?? []).map((area: ServingAreaDto) =>
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
            isAvailable: branchDto.isAvailable ?? true,
            servingAreas,
        });
    }
}
