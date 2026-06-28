import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from './entities/job.entity';
import { OfferEntity } from './entities/offer.entity';
import { ContractEntity } from './entities/contract.entity';
import { ReviewEntity } from './entities/review.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { ProfileModule } from '../provider-profile/profile.module';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([JobEntity, OfferEntity, ContractEntity, ReviewEntity, UserEntity]),
        AuthModule,
        ProfileModule,
    ],
    controllers: [JobsController],
    providers: [JobsService],
    exports: [JobsService],
})
export class JobsModule {}
