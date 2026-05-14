import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from './notification.service';
import { NotificationType } from './enums/notification-type.enum';

@Injectable()
export class NotificationListener {
    constructor(private readonly notificationService: NotificationService) { }

    @OnEvent('job.created')
    async handleJobCreated(payload: { providerId: string; jobTitle: string; jobId: string }) {
        await this.notificationService.createNotification(payload.providerId, {
            title: 'New job request available',
            body: `A new ${payload.jobTitle} request is available in your designated service area.`,
            type: NotificationType.NEW_JOB_REQUEST,
            metadata: { jobId: payload.jobId }
        });
    }

    @OnEvent('payout.processed')
    async handlePayoutProcessed(payload: { providerId: string; amount: number; jobId: string }) {
        await this.notificationService.createNotification(payload.providerId, {
            title: 'Your payout has been processed',
            body: `The payment for Job #${payload.jobId} has been successfully sent to your bank account.`,
            type: NotificationType.PAYOUT_PROCESSED,
            metadata: { jobId: payload.jobId, amount: payload.amount }
        });
    }

    @OnEvent('document.expiring')
    async handleDocumentExpiring(payload: { providerId: string; docType: string; daysLeft: number }) {
        await this.notificationService.createNotification(payload.providerId, {
            title: 'Document will expire soon',
            body: `Your ${payload.docType} will expire in ${payload.daysLeft} days. Please update your profile.`,
            type: NotificationType.DOCUMENT_EXPIRY,
            metadata: { docType: payload.docType }
        });
    }

    @OnEvent('job.status_updated')
    async handleJobStatusUpdated(payload: { 
        userId: string; 
        jobId: string; 
        status: string; 
        details: string;
        isProvider: boolean;
    }) {
        await this.notificationService.createNotification(payload.userId, {
            title: 'Job status updated',
            body: payload.details,
            type: NotificationType.JOB_STATUS_UPDATED,
            metadata: { jobId: payload.jobId, status: payload.status }
        });
    }

    @OnEvent('offer.new')
    async handleNewOffer(payload: { clientId: string; providerName: string; discount?: string }) {
        await this.notificationService.createNotification(payload.clientId, {
            title: 'New offer available',
            body: `Get ${payload.discount || 'a special discount'} on your next service from ${payload.providerName}.`,
            type: NotificationType.NEW_OFFER
        });
    }

    @OnEvent('payment.completed')
    async handlePaymentCompleted(payload: { clientId: string; orderId: string }) {
        await this.notificationService.createNotification(payload.clientId, {
            title: 'Payment completed',
            body: `Transaction for #${payload.orderId} was successful.`,
            type: NotificationType.PAYMENT_COMPLETED,
            metadata: { orderId: payload.orderId }
        });
    }
}
