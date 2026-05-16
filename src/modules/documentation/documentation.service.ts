import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { ProviderDocumentEntity, DocumentStatus, DocumentRequiredFor } from './entities/provider-document.entity';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { ProfileService } from '../provider-profile/profile.service';

@Injectable()
export class DocumentationService {
    private readonly REQUIRED_DOCUMENTS = [
        { type: 'ID Card', requiredFor: DocumentRequiredFor.PROFILE },
        { type: 'Professional License', requiredFor: DocumentRequiredFor.SERVICE_ACTIVATION },
        { type: 'Insurance Document', requiredFor: DocumentRequiredFor.COMPLIANCE },
        { type: 'VAT Registration', requiredFor: DocumentRequiredFor.FINANCE },
    ];

    constructor(
        @InjectRepository(ProviderDocumentEntity)
        private readonly documentRepo: Repository<ProviderDocumentEntity>,
        private readonly profileService: ProfileService,
    ) { }

    async getDashboardData(userId: string) {
        const profile = await this.profileService.getMyProfile(userId);
        if (!profile) throw new NotFoundException('Provider profile not found');

        const documents = await this.documentRepo.find({
            where: { provider: { id: profile.id } }
        });

        const compliance = profile.compliance;

        // Map existing compliance documents to the unified list
        const existingDocsMap = new Map();
        documents.forEach(d => existingDocsMap.set(d.type, d));

        const documentList = this.REQUIRED_DOCUMENTS.map(req => {
            let doc: any = existingDocsMap.get(req.type);

            // Bridge logic for documents already in Compliance Entity
            if (!doc) {
                if (req.type === 'ID Card' && compliance?.ownerIdFile) {
                    doc = {
                        type: 'ID Card',
                        status: DocumentStatus.APPROVED, // Assume approved if in compliance for now, or track separately
                        requiredFor: DocumentRequiredFor.PROFILE,
                        expiryDate: compliance.ownerIdExpiryDate ? new Date(compliance.ownerIdExpiryDate) : null,
                        fileUrl: compliance.ownerIdFile,
                        lastUpdated: compliance.updatedAt
                    };
                } else if (req.type === 'Professional License' && compliance?.tradeLicenseFile) {
                    doc = {
                        type: 'Professional License',
                        status: DocumentStatus.APPROVED,
                        requiredFor: DocumentRequiredFor.SERVICE_ACTIVATION,
                        expiryDate: compliance.tradeLicenseExpiryDate ? new Date(compliance.tradeLicenseExpiryDate) : null,
                        fileUrl: compliance.tradeLicenseFile,
                        lastUpdated: compliance.updatedAt
                    };
                }
            }

            return doc || {
                type: req.type,
                status: DocumentStatus.MISSING,
                requiredFor: req.requiredFor,
                expiryDate: null,
                lastUpdated: null,
                fileUrl: null
            };
        });

        // Update status for expired documents on the fly
        const now = new Date();
        documentList.forEach(d => {
            if (d.expiryDate && new Date(d.expiryDate) < now && d.status === DocumentStatus.APPROVED) {
                d.status = DocumentStatus.EXPIRED;
            }
        });

        const stats = this.calculateStats(documentList as any);

        return {
            stats,
            documents: documentList,
            complianceOverview: {
                complianceScore: stats.complianceScore,
                expiredCount: stats.expired,
                missingCount: stats.missing,
                nextExpiry: this.getNextExpiry(documentList as any)
            }
        };
    }

    async uploadDocument(userId: string, dto: UploadDocumentDto) {
        const profile = await this.profileService.getMyProfile(userId);
        if (!profile) throw new NotFoundException('Provider profile not found');

        let document = await this.documentRepo.findOne({
            where: { provider: { id: profile.id }, type: dto.type }
        });

        if (!document) {
            const reqInfo = this.REQUIRED_DOCUMENTS.find(r => r.type === dto.type);
            document = this.documentRepo.create({
                provider: profile,
                type: dto.type,
                requiredFor: reqInfo?.requiredFor || DocumentRequiredFor.COMPLIANCE
            });
        }

        document.fileUrl = dto.fileUrl;
        document.expiryDate = dto.expiryDate ? new Date(dto.expiryDate) : null;
        document.status = DocumentStatus.UNDER_REVIEW;
        
        const saved = await this.documentRepo.save(document);

        // Sync with legacy compliance entity if applicable
        if (dto.type === 'ID Card' || dto.type === 'Professional License') {
            const compliance = profile.compliance;
            if (compliance) {
                if (dto.type === 'ID Card') {
                    compliance.ownerIdFile = dto.fileUrl;
                    compliance.ownerIdExpiryDate = dto.expiryDate || compliance.ownerIdExpiryDate;
                } else {
                    compliance.tradeLicenseFile = dto.fileUrl;
                    compliance.tradeLicenseExpiryDate = dto.expiryDate || compliance.tradeLicenseExpiryDate;
                }
                await this.documentRepo.manager.save(compliance);
            }
        }

        return saved;
    }

    private calculateStats(docs: ProviderDocumentEntity[]) {
        const total = docs.length;
        const approved = docs.filter(d => d.status === DocumentStatus.APPROVED).length;
        const review = docs.filter(d => d.status === DocumentStatus.UNDER_REVIEW).length;
        const expired = docs.filter(d => d.status === DocumentStatus.EXPIRED).length;
        const missing = docs.filter(d => d.status === DocumentStatus.MISSING).length;

        // Simple score: approved = 100%, review = 50%, others = 0%
        const scoreSum = (approved * 1) + (review * 0.5);
        const complianceScore = total > 0 ? Math.round((scoreSum / total) * 100) : 0;

        return {
            total,
            approved,
            review,
            expired,
            missing,
            complianceScore
        };
    }

    private getNextExpiry(docs: ProviderDocumentEntity[]) {
        const expiries = docs
            .filter(d => d.expiryDate && d.status === DocumentStatus.APPROVED)
            .map(d => new Date(d.expiryDate!))
            .sort((a, b) => a.getTime() - b.getTime());

        return expiries.length > 0 ? expiries[0] : null;
    }
}
