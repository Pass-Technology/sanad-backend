import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientServiceRequestEntity } from '../marketplace/entities/client-service-request.entity';
import { OfferEntity } from '../marketplace/entities/offer.entity';
import { JobEntity } from '../marketplace/entities/job.entity';
import { AuthModule } from '../auth/auth.module';
import { ClientModule } from '../client/client.module';
import { ServiceManagementModule } from '../service-management/service-management.module';
import { ClientRequestsService } from './client-requests.service';
import { ClientRequestsController } from './client-requests.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([ClientServiceRequestEntity, OfferEntity, JobEntity]),
        AuthModule,
        ClientModule,
        ServiceManagementModule,
    ],
    controllers: [ClientRequestsController],
    providers: [ClientRequestsService],
    exports: [ClientRequestsService],
})
export class ClientRequestsModule { }
