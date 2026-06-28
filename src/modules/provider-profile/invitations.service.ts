import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkerInvitationEntity } from './entities/worker-invitation.entity';
import { ProviderProfileEntity } from './entities/provider-profile.entity';
import { InviteWorkerDto } from './dto/invite-worker.dto';
import { InvitationStatus } from './enums/invitation-status.enum';
import * as crypto from 'crypto';

@Injectable()
export class InvitationsService {
    constructor(
        @InjectRepository(WorkerInvitationEntity)
        private readonly invitationRepository: Repository<WorkerInvitationEntity>,
        @InjectRepository(ProviderProfileEntity)
        private readonly providerRepository: Repository<ProviderProfileEntity>,
    ) {}

    async inviteWorker(providerUserId: string, dto: InviteWorkerDto): Promise<WorkerInvitationEntity> {
        const providerProfile = await this.providerRepository.findOne({
            where: { user: { id: providerUserId } },
        });

        if (!providerProfile) {
            throw new NotFoundException('Provider profile not found for this user');
        }

        // Check if an active invitation already exists for this email/phone
        const existing = await this.invitationRepository.findOne({
            where: {
                emailOrPhone: dto.emailOrPhone,
                provider: { id: providerProfile.id },
                status: InvitationStatus.PENDING,
            },
        });

        if (existing && existing.expiresAt > new Date()) {
            throw new BadRequestException('An active invitation is already pending for this worker');
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiry

        const invitation = this.invitationRepository.create({
            emailOrPhone: dto.emailOrPhone,
            name: dto.name,
            token,
            status: InvitationStatus.PENDING,
            provider: providerProfile,
            expiresAt,
        });

        return await this.invitationRepository.save(invitation);
    }

    async getInvitations(providerUserId: string): Promise<WorkerInvitationEntity[]> {
        const providerProfile = await this.providerRepository.findOne({
            where: { user: { id: providerUserId } },
        });

        if (!providerProfile) {
            throw new NotFoundException('Provider profile not found');
        }

        return await this.invitationRepository.find({
            where: { provider: { id: providerProfile.id } },
            order: { createdAt: 'DESC' },
        });
    }
}
