import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from './entities/job.entity';
import { OfferEntity } from './entities/offer.entity';
import { ContractEntity } from './entities/contract.entity';
import { ContractAssetEntity } from './entities/contract-asset.entity';
import { ReviewEntity } from './entities/review.entity';
import { ProviderJobDismissalEntity } from './entities/provider-job-dismissal.entity';
import { ClientAddressEntity } from '../client/entity/client-address.entity';
import { JobsService } from './jobs.service';
import { ClientJobsService } from './client-jobs.service';
import { ProviderJobsService } from './provider-jobs.service';
import { ClientJobsController } from './client-jobs.controller';
import { ClientContractsController } from './client-contracts.controller';
import { ProviderJobsController } from './provider-jobs.controller';
import { ProviderContractsController } from './provider-contracts.controller';
import { WorkerContractsController } from './worker-contracts.controller';
import { ClientModule } from '../client/client.module';
import { ProfileModule } from '../provider-profile/profile.module';
import { WorkerModule } from '../worker/worker.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            JobEntity,
            OfferEntity,
            ContractEntity,
            ContractAssetEntity,
            ReviewEntity,
            ProviderJobDismissalEntity,
            ClientAddressEntity,
        ]),
        ClientModule,
        ProfileModule,
        WorkerModule,
    ],
    controllers: [
        ClientJobsController,
        ClientContractsController,
        ProviderJobsController,
        ProviderContractsController,
        WorkerContractsController,
    ],
    providers: [JobsService, ClientJobsService, ProviderJobsService],
    exports: [JobsService, TypeOrmModule],
})
export class JobsModule {}
