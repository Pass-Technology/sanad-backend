import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppConfigService } from 'src/config/config.service';
import { MailService } from './mail.service';
import { TemplateModule } from '../template/template.module';

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
            }),
        }),
        TemplateModule
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }
