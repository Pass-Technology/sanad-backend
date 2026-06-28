import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { WorkerProfileEntity } from './entity/worker-profile.entity';
import { WorkerInvitationEntity } from './entity/worker-invitation.entity';
import { UserEntity } from '../user/entities/user.entity';
import { UserRepository } from '../user/user.repository';
import { ProviderProfileEntity } from '../provider-profile/entities/provider-profile.entity';
import { InvitationStatus } from './enums/invitation-status.enum';
import { UserIdentifierType } from '../user/enums/user-identifier-type.enum';
import { UserType } from '../user/enums/user-type.enum';

@Injectable()
export class WorkerService {
    constructor(
        @InjectRepository(WorkerProfileEntity)
        private readonly workerProfileRepo: Repository<WorkerProfileEntity>,
        @InjectRepository(WorkerInvitationEntity)
        private readonly invitationRepository: Repository<WorkerInvitationEntity>,
        @InjectRepository(ProviderProfileEntity)
        private readonly providerProfileRepo: Repository<ProviderProfileEntity>,
        private readonly userRepo: UserRepository,
    ) {}

    async registerFromInvitation(dto: { token: string; password: string }): Promise<{ message: string; userId: string }> {
        const invitation = await this.invitationRepository.findOne({
            where: { token: dto.token },
            relations: { provider: true },
        });

        if (!invitation) {
            throw new ForbiddenException('Invalid invitation token');
        }

        if (invitation.status !== InvitationStatus.PENDING) {
            throw new ForbiddenException('Invitation token is no longer valid');
        }

        if (invitation.expiresAt < new Date()) {
            invitation.status = InvitationStatus.EXPIRED;
            await this.invitationRepository.save(invitation);
            throw new ForbiddenException('Invitation token has expired');
        }

        const isUserExist = await this.userRepo.findByIdentifier(invitation.emailOrPhone);
        if (isUserExist) {
            throw new ForbiddenException('A user with this email or phone already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const identifierType = invitation.emailOrPhone.includes('@')
            ? UserIdentifierType.EMAIL
            : UserIdentifierType.MOBILE;

        const user = await this.userRepo.create({
            identifier: invitation.emailOrPhone,
            identifierType,
            password: hashedPassword,
            type: UserType.WORKER,
        });

        user.isVerified = true;
        await this.userRepo.save(user);

        await this.createProfile(user.id, invitation.name, invitation.provider);

        invitation.status = InvitationStatus.ACCEPTED;
        await this.invitationRepository.save(invitation);

        return {
            message: 'Worker registration successful. You can now login.',
            userId: user.id,
        };
    }

    async getProfile(userId: string): Promise<WorkerProfileEntity> {
        const profile = await this.workerProfileRepo.findOne({
            where: { user: { id: userId } },
            relations: { user: true, employerProvider: true },
        });

        if (!profile) {
            throw new NotFoundException('Worker profile not found');
        }

        return profile;
    }

    async createProfile(
        userId: string,
        name: string,
        employerProvider?: ProviderProfileEntity,
    ): Promise<WorkerProfileEntity> {
        const profile = this.workerProfileRepo.create({
            name,
            user: { id: userId } as UserEntity,
            employerProvider: employerProvider ?? null,
            isSelf: false,
        });
        const savedProfile = await this.workerProfileRepo.save(profile);
        await this.userRepo.updateProfileCompletionStatus(userId, true);
        return savedProfile;
    }

    async getOrCreateSelfWorker(providerProfileId: string): Promise<WorkerProfileEntity> {
        const existing = await this.workerProfileRepo.findOne({
            where: { employerProvider: { id: providerProfileId }, isSelf: true },
            relations: { user: true, employerProvider: true },
        });

        if (existing) {
            return existing;
        }

        const provider = await this.providerProfileRepo.findOne({
            where: { id: providerProfileId },
            relations: { userInfo: true, user: true },
        });

        if (!provider) {
            throw new NotFoundException('Provider profile not found');
        }

        const name =
            provider.userInfo?.fullName ??
            provider.tradeName ??
            provider.user?.identifier ??
            'Me';

        return this.workerProfileRepo.save(
            this.workerProfileRepo.create({
                name,
                isSelf: true,
                user: null,
                employerProvider: provider,
            }),
        );
    }

    async getWorkerOrThrow(workerProfileId: string, providerProfileId: string): Promise<WorkerProfileEntity> {
        const worker = await this.workerProfileRepo.findOne({
            where: {
                id: workerProfileId,
                employerProvider: { id: providerProfileId },
            },
            relations: { user: true },
        });

        if (!worker) {
            throw new NotFoundException('Worker not found for this provider');
        }

        return worker;
    }

    async getWorkersByProvider(providerProfileId: string): Promise<WorkerProfileEntity[]> {
        await this.getOrCreateSelfWorker(providerProfileId);

        return this.workerProfileRepo.find({
            where: { employerProvider: { id: providerProfileId } },
            relations: { user: true },
            order: { isSelf: 'DESC', createdAt: 'DESC' },
        });
    }
}
