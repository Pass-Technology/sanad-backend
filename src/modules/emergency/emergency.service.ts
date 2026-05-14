import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProviderProfileEntity } from '../provider-profile/entities/provider-profile.entity';
import { ProviderServiceEntity } from '../service-management/entities/provider-service.entity';
import { JobEntity } from '../marketplace/entities/job.entity';
import { ProfileService } from '../provider-profile/profile.service';
import { UpdateEmergencyServicesDto, ToggleEmergencyModeDto } from './dto/emergency-mode.dto';

@Injectable()
export class EmergencyService {
    constructor(
        @InjectRepository(ProviderProfileEntity)
        private readonly profileRepo: Repository<ProviderProfileEntity>,
        @InjectRepository(ProviderServiceEntity)
        private readonly providerServiceRepo: Repository<ProviderServiceEntity>,
        @InjectRepository(JobEntity)
        private readonly jobRepo: Repository<JobEntity>,
        private readonly profileService: ProfileService,
    ) { }

    async getStatus(userId: string) {
        const profile = await this.profileService.getMyProfile(userId);
        if (!profile) throw new NotFoundException('Provider profile not found');

        const emergencyServices = await this.providerServiceRepo.find({
            where: { profile: { id: profile.id }, isEmergencyEnabled: true },
            relations: { service: { category: true } }
        });

        const stats = await this.calculateEmergencyStats(profile.id);

        return {
            isActive: profile.isEmergencyModeActive,
            selectedServices: emergencyServices.map(ps => ({
                id: ps.id,
                name: ps.service.nameAr || ps.service.nameEn,
                icon: ps.service.category?.icon || null
            })),
            stats
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

        // Reset all emergency flags for this provider first
        await this.providerServiceRepo.update(
            { profile: { id: profile.id } },
            { isEmergencyEnabled: false }
        );

        // Enable for specific IDs
        if (dto.serviceIds.length > 0) {
            await this.providerServiceRepo.update(
                dto.serviceIds,
                { isEmergencyEnabled: true }
            );
        }

        return this.getStatus(userId);
    }

    private async calculateEmergencyStats(providerId: string) {
        const urgentJobs = await this.jobRepo.find({
            where: {
                provider: { id: providerId },
                serviceRequest: { isUrgent: true }
            },
            relations: { serviceRequest: true }
        });

        // Mocking some stats as requested by the UI design
        return {
            urgentRequestsCount: urgentJobs.length,
            avgResponseTimeMinutes: 8, // Placeholder
            performanceScore: 94 // Placeholder or linked to scoring
        };
    }
}
