import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayoutEntity } from './entities/payout.entity';
import { EarningsService } from './earnings.service';
import { EarningsController } from './earnings.controller';
import { OrderEntity } from '../orders/entities/order.entity';
import { ProfileModule } from '../provider-profile/profile.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PayoutEntity, OrderEntity]),
        ProfileModule
    ],
    providers: [EarningsService],
    controllers: [EarningsController],
    exports: [EarningsService],
})
export class EarningsModule { }
