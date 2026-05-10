import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientCouponEntity } from './entities/client-coupon.entity';
import { ProviderCouponEntity } from './entities/provider-coupon.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ClientCouponEntity,
            ProviderCouponEntity,
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [TypeOrmModule],
})
export class PromotionsModule {}
