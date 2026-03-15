import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingCycleEntity } from './entities/billing-cycle.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BillingCycleEntity])],
    exports: [TypeOrmModule],
})
export class BillingCycleModule {}

