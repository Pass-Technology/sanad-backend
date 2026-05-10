import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OfferEntity } from './entities/offer.entity';
import { AuthModule } from '../auth/auth.module';
import { ClientModule } from '../client/client.module';
import { ProfileModule } from '../provider-profile/profile.module';
import { ServiceManagementModule } from '../service-management/service-management.module';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            OrderEntity,
            OfferEntity,
        ]),
        AuthModule,
        ClientModule,
        ProfileModule,
        ServiceManagementModule,
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService],
})
export class OrdersModule { }
