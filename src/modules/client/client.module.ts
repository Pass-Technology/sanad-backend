import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ClientProfileEntity } from './entity/client-profile.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ClientProfileEntity]),
        AuthModule,
        UserModule,
    ],
    controllers: [ClientController],
    providers: [ClientService],
    exports: [ClientService],
})
export class ClientModule { }