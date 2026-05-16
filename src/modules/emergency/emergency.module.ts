import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmergencyController } from './emergency.controller';
import { EmergencyService } from './emergency.service';
import { ProviderProfileEntity } from '../provider-profile/entities/provider-profile.entity';
import { ProviderServiceEntity } from '../service-management/entities/provider-service.entity';
import { JobEntity } from '../marketplace/entities/job.entity';
import { ProfileModule } from '../provider-profile/profile.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProviderProfileEntity,
            ProviderServiceEntity,
            JobEntity
        ]),
        ProfileModule,
        AuthModule
    ],
    controllers: [EmergencyController],
    providers: [EmergencyService],
    exports: [EmergencyService],
})
export class EmergencyModule { }
