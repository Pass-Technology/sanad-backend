import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ClientProfileEntity } from './entity/client-profile.entity';
import { ClientAddressEntity } from './entity/client-address.entity';
import { ClientPaymentMethodEntity } from './entity/client-payment-method.entity';
import { PromotionsModule } from '../promotions/promotions.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ClientProfileEntity,
            ClientAddressEntity,
            ClientPaymentMethodEntity,
        ]),
        AuthModule,
        UserModule,
        PromotionsModule,
    ],
    controllers: [ClientController],
    providers: [ClientService],
    exports: [ClientService],
})
export class ClientModule { }