import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkerProfileEntity } from './entity/worker-profile.entity';
import { WorkerInvitationEntity } from './entity/worker-invitation.entity';
import { ProviderProfileEntity } from '../provider-profile/entities/provider-profile.entity';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { SharedAuthModule } from '../../shared/auth/shared-auth.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            WorkerProfileEntity,
            WorkerInvitationEntity,
            ProviderProfileEntity,
        ]),
        SharedAuthModule,
        UserModule,
    ],
    controllers: [WorkerController, InvitationsController],
    providers: [WorkerService, InvitationsService],
    exports: [WorkerService, InvitationsService],
})
export class WorkerModule {}
