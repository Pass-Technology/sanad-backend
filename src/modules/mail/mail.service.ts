import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { TemplateService } from '../template/template.service';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(
        private readonly mailerService: MailerService,
        private readonly templateService: TemplateService,
    ) { }

    async sendMail(options: {
        to: string;
        subject: string;
        template: string;
        context: any;
    }) {
        try {
            const html = this.templateService.renderTemplate(
                options.template,
                options.context,
            );

            await this.mailerService.sendMail({
                to: options.to,
                subject: options.subject,
                html,
            });

            this.logger.log(`Email successfully sent to ${options.to}`);
        } catch (error) {
            console.log(error)
            this.logger.error(
                `Failed to send email to ${options.to}`,
                error.stack,
            );
            throw error;
        }
    }
}