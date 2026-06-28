import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProviderProfileEntity } from '../provider-profile/entities/provider-profile.entity';
import { ProviderServiceEntity } from '../service-management/entities/provider-service.entity';
import { ContractEntity } from '../jobs/entities/contract.entity';
import { ProfileService } from '../provider-profile/profile.service';
import { UpdateEmergencyServicesDto, ToggleEmergencyModeDto } from './dto/emergency-mode.dto';

@Injectable()
export class EmergencyService {
    constructor(
        @InjectRepository(ProviderProfileEntity)
        private readonly profileRepo: Repository<ProviderProfileEntity>,
        @InjectRepository(ProviderServiceEntity)
        private readonly providerServiceRepo: Repository<ProviderServiceEntity>,
        @InjectRepository(ContractEntity)
        private readonly contractRepo: Repository<ContractEntity>,
        private readonly profileService: ProfileService,
    ) { }

    async getStatus(userId: string) {
        const profile = await this.profileService.getMyProfile(userId);
        if (!profile) throw new NotFoundException('Provider profile not found');

        const emergencyServices = await this.providerServiceRepo.find({
            where: { profile: { id: profile.id }, isEmergencyEnabled: true },
            relations: { service: { category: true } },
        });

        const stats = await this.calculateEmergencyStats(profile.id);

        return {
            isActive: profile.isEmergencyModeActive,
            selectedServices: emergencyServices.map(ps => ({
                id: ps.id,
                name: ps.service.nameAr || ps.service.nameEn,
                icon: ps.service.category?.icon || null,
            })),
            stats,
        };
    }

    async toggleMode(userId: string, dto: ToggleEmergencyModeDto) {
        const profile = await this.profileService.getMyProfile(userId);
        if (!profile) throw new NotFoundException('Provider profile not found');

        profile.isEmergencyModeActive = dto.isActive;
        return await this.profileRepo.save(profile);
    }

    async updateEmergencyServices(userId: string, dto: UpdateEmergencyServicesDto) {
        const profile = await this.profileService.getMyProfile(userId);
        if (!profile) throw new NotFoundException('Provider profile not found');

        await this.providerServiceRepo.update(
            { profile: { id: profile.id } },
            { isEmergencyEnabled: false },
        );

        if (dto.serviceIds.length > 0) {
            await this.providerServiceRepo.update(
                dto.serviceIds,
                { isEmergencyEnabled: true },
            );
        }

        return this.getStatus(userId);
    }

    private async calculateEmergencyStats(providerId: string) {
        const urgentContracts = await this.contractRepo.find({
            where: {
                provider: { id: providerId },
                job: { isUrgent: true },
            },
            relations: { job: true },
        });

        return {
            urgentRequestsCount: urgentContracts.length,
            avgResponseTimeMinutes: 8,
            performanceScore: 94,
        };
    }
}
