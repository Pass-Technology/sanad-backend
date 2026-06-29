import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProfileEntity } from './entity/client-profile.entity';
import { ClientAddressEntity } from './entity/client-address.entity';
import { ClientPaymentMethodEntity } from './entity/client-payment-method.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { UserRepository } from '../user/user.repository';
import { CreateClientProfileDto } from './dto/create-client-profile.dto';


@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(ClientProfileEntity)
        private readonly clientProfileRepo: Repository<ClientProfileEntity>,
        @InjectRepository(ClientAddressEntity)
        private readonly clientAddressRepo: Repository<ClientAddressEntity>,
        @InjectRepository(ClientPaymentMethodEntity)
        private readonly clientPaymentMethodRepo: Repository<ClientPaymentMethodEntity>,
        private readonly userRepo: UserRepository,
    ) { }

    async getProfile(userId: string) {
        const profile = await this.clientProfileRepo.findOne({
            where: { user: { id: userId } },
            relations: {
                user: true,
                addresses: true,
                paymentMethods: true,
            },
        });

        if (!profile) {
            throw new NotFoundException('Client profile not found');
        }

        return profile;
    }


    async createProfile(userId: string, dto: CreateClientProfileDto) {
        const profile = this.clientProfileRepo.create({
            name: dto.name,
            user: { id: userId } as UserEntity,
        });
        const savedProfile = await this.clientProfileRepo.save(profile);

        if (dto.addresses?.length) {
            const addresses = dto.addresses.map((addr) =>
                this.clientAddressRepo.create({
                    ...addr,
                    client: savedProfile,
                }),
            );
            savedProfile.addresses = await this.clientAddressRepo.save(addresses);
        }

        if (dto.paymentMethods?.length) {
            const paymentMethods = dto.paymentMethods.map((pm) =>
                this.clientPaymentMethodRepo.create({
                    ...pm,
                    client: savedProfile,
                }),
            );
            savedProfile.paymentMethods = await this.clientPaymentMethodRepo.save(paymentMethods);
        }

        await this.userRepo.updateProfileCompletionStatus(userId, true);
        return savedProfile;
    }
}