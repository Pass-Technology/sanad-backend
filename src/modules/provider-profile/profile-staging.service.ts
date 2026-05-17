import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProviderProfileChangeEntity } from './entities/provider-profile-change.entity';
import { ProfileChangeType } from './enums/profile-change-type.enum';
import { LOOKUP_IDS } from '../../shared/constants/lookup-ids';

@Injectable()
export class ProfileStagingService {
    constructor(
        @InjectRepository(ProviderProfileChangeEntity)
        private readonly changeRequestRepo: Repository<ProviderProfileChangeEntity>,
    ) {}

    async stageChange(profileId: string, type: ProfileChangeType, newData: any): Promise<ProviderProfileChangeEntity> {
        return await this.changeRequestRepo.save({
            profileId,
            changeType: type,
            newData,
            statusId: LOOKUP_IDS.PROFILE_STATUS.PENDING_REVIEW,
        });
    }
}
