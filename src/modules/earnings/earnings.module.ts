import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayoutEntity } from './entities/payout.entity';
import { EarningsService } from './earnings.service';
import { EarningsController } from './earnings.controller';
import { JobEntity } from '../marketplace/entities/job.entity';
import { ProfileModule } from '../provider-profile/profile.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PayoutEntity, JobEntity]),
        ProfileModule,
        AuthModule,
    ],
    providers: [EarningsService],
    controllers: [EarningsController],
    exports: [EarningsService],
})
export class EarningsModule { }
