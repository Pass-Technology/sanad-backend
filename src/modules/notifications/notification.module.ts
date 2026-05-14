import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationListener } from './notification.listener';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationPreferenceEntity } from './entities/notification-preference.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            NotificationEntity,
            NotificationPreferenceEntity
        ]),
        AuthModule,
    ],
    controllers: [NotificationController],
    providers: [NotificationService, NotificationListener],
    exports: [NotificationService],
})
export class NotificationModule { }
