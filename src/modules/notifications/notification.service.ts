import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationType } from './enums/notification-type.enum';
import { NotificationPreferenceEntity } from './entities/notification-preference.entity';
import { UpdateNotificationSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(NotificationEntity)
        private readonly notificationRepo: Repository<NotificationEntity>,
        @InjectRepository(NotificationPreferenceEntity)
        private readonly preferenceRepo: Repository<NotificationPreferenceEntity>,
    ) { }

    async getNotifications(userId: string, limit = 20, offset = 0) {
        const [items, total] = await this.notificationRepo.findAndCount({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset,
        });

        const unreadCount = await this.notificationRepo.count({
            where: { user: { id: userId }, isRead: false }
        });

        return { items, total, unreadCount };
    }

    async markAsRead(userId: string, id: string) {
        const notification = await this.notificationRepo.findOne({
            where: { id, user: { id: userId } }
        });

        if (!notification) throw new NotFoundException('Notification not found');

        notification.isRead = true;
        return await this.notificationRepo.save(notification);
    }

    async markAllAsRead(userId: string) {
        await this.notificationRepo.update(
            { user: { id: userId }, isRead: false },
            { isRead: true }
        );
        return { success: true };
    }

    async getSettings(userId: string) {
        let settings = await this.preferenceRepo.findOne({
            where: { user: { id: userId } }
        });

        if (!settings) {
            settings = this.preferenceRepo.create({ user: { id: userId } });
            await this.preferenceRepo.save(settings);
        }

        return settings;
    }

    async updateSettings(userId: string, dto: UpdateNotificationSettingsDto) {
        let settings = await this.getSettings(userId);

        if (dto.channels) settings.channels = { ...settings.channels, ...dto.channels };
        if (dto.categories) settings.categories = { ...settings.categories, ...dto.categories };
        if (dto.reminderTiming) settings.reminderTiming = { ...settings.reminderTiming, ...dto.reminderTiming };
        if (dto.quietHours) settings.quietHours = { ...settings.quietHours, ...dto.quietHours };

        return await this.preferenceRepo.save(settings);
    }

    /**
     * Internal utility to create a notification
     */
    async createNotification(userId: string, data: {
        title: string;
        body: string;
        type: NotificationType;
        metadata?: Record<string, any>;
    }) {
        // Here we could check user preferences before creating/sending
        // (e.g. if category is disabled, don't send)
        
        const notification = this.notificationRepo.create({
            user: { id: userId },
            ...data
        });

        return await this.notificationRepo.save(notification);
    }
}
