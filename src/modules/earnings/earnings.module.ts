import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayoutEntity } from './entities/payout.entity';
import { EarningsService } from './earnings.service';
import { EarningsController } from './earnings.controller';
import { ContractEntity } from '../jobs/entities/contract.entity';
import { ProfileModule } from '../provider-profile/profile.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PayoutEntity, ContractEntity]),
        ProfileModule,
        AuthModule,
    ],
    providers: [EarningsService],
    controllers: [EarningsController],
    exports: [EarningsService],
})
export class EarningsModule { }
