import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProfileEntity } from './entity/client-profile.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtPayload } from '../../shared/types/jwt-payload.type';
import { UserEntity } from '../user/entities/user.entity';
import { UserRepository } from '../user/user.repository';


@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(ClientProfileEntity)
        private readonly clientProfileRepo: Repository<ClientProfileEntity>,
        private readonly userRepo: UserRepository,
    ) { }

    async getProfile(userId: string) {
        const profile = await this.clientProfileRepo.findOne({
            where: { user: { id: userId } },
            relations: {
                user: true
            },
        });

        if (!profile) {
            throw new NotFoundException('Client profile not found');
        }

        return profile;
    }


    async createProfile(userId: string) {
        const profile = this.clientProfileRepo.create({
            user: { id: userId } as UserEntity,
        });
        const savedProfile = await this.clientProfileRepo.save(profile);
        await this.userRepo.updateProfileCompletionStatus(userId, true);
        return savedProfile;
    }
}