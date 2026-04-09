import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(private readonly mailerService: MailerService) { }

    async sendMail(to: string, subject: string, template: string, context: Record<string, any>) {
        try {
            await this.mailerService.sendMail({
                to,
                subject,
                template: `./${template}`,
                context,
            });
            this.logger.log(`Email successfully sent to ${to} using template: ${template}`);
        } catch (error) {
            this.logger.error(`Failed to send email to ${to}`, error.stack);
            throw error;
        }
    }
}
