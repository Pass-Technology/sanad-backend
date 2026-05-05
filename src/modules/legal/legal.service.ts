import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LegalDocumentEntity } from './entities/legal-document.entity';
import { SharedCacheService } from '../../shared/cache/shared-cache.service';
import { LegalDocumentType } from './enums/legal-document-type.enum';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LegalService implements OnModuleInit {
  private readonly cachePrefix = 'legal:';

  constructor(
    @InjectRepository(LegalDocumentEntity)
    private readonly legalRepository: Repository<LegalDocumentEntity>,
    private readonly cacheService: SharedCacheService,
  ) { }

  async onModuleInit() {
    const dataPath = path.join(process.cwd(), 'src', 'modules', 'legal', 'data');
    const languages = ['en', 'ar'];
    const types = Object.values(LegalDocumentType);

    for (const lang of languages) {
      for (const type of types) {
        // Convert camelCase to kebab-case for filename
        const filename = type.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        const filePath = path.join(dataPath, `${filename}.${lang}.json`);

        if (fs.existsSync(filePath)) {
          const existing = await this.legalRepository.findOne({
            where: { language: lang, type },
          });

          const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

          if (existing) {
            existing.content = content;
            await this.legalRepository.save(existing);
          } else {
            await this.legalRepository.save({
              language: lang,
              type,
              content,
            });
          }
        }
      }
    }
  }

  async getDocument(type: LegalDocumentType, language: string): Promise<any> {
    const lang = language.toLowerCase();
    const cacheKey = `${type}:${lang}`;

    const cached = await this.cacheService.get<any>(this.cachePrefix, cacheKey);
    if (cached) return cached;

    const doc = await this.legalRepository.findOne({
      where: { language: lang, type },
    });

    if (!doc) {
      throw new NotFoundException(`Legal document '${type}' in language '${language}' not found.`);
    }

    const result = doc.content;

    await this.cacheService.set(this.cachePrefix, cacheKey, result);

    return result;
  }
}
