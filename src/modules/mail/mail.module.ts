import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { AppConfigService } from 'src/config/config.service';
import { join } from 'path';
import { MailService } from './mail.service';

@Module({
    imports: [
        MailerModule.forRootAsync({
            inject: [AppConfigService],
            useFactory: (configService: AppConfigService) => ({
                transport: {
                    host: configService.mail.host,
                    port: configService.mail.port,
                    secure: false,
                    auth:
                        configService.mail.user && configService.mail.password
                            ? {
                                user: configService.mail.user,
                                pass: configService.mail.password,
                            }
                            : undefined,
                },
                defaults: {
                    from: configService.mail.from,
                },
                template: {
                    dir: join(process.cwd(), 'src/modules/mail/templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }
