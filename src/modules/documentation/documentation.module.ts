import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentationController } from './documentation.controller';
import { DocumentationService } from './documentation.service';
import { ProviderDocumentEntity } from './entities/provider-document.entity';
import { ProfileModule } from '../provider-profile/profile.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProviderDocumentEntity]),
        ProfileModule, AuthModule
    ],
    controllers: [DocumentationController],
    providers: [DocumentationService],
    exports: [DocumentationService],
})
export class DocumentationModule { }
