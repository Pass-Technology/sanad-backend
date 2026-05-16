import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientServiceRequestEntity } from '../marketplace/entities/client-service-request.entity';
import { OfferEntity } from '../marketplace/entities/offer.entity';
import { JobEntity } from '../marketplace/entities/job.entity';
import { AuthModule } from '../auth/auth.module';
import { ProfileModule } from '../provider-profile/profile.module';
import { ProviderJobsService } from './provider-jobs.service';
import { ProviderJobsController } from './provider-jobs.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([ClientServiceRequestEntity, OfferEntity, JobEntity]),
        AuthModule,
        ProfileModule,
    ],
    controllers: [ProviderJobsController],
    providers: [ProviderJobsService],
    exports: [ProviderJobsService],
})
export class ProviderJobsModule { }
