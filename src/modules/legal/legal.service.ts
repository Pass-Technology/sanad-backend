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
    const count = await this.legalRepository.count();
    if (count === 0) {
      const dataPath = path.join(process.cwd(), 'src', 'modules', 'legal', 'data');
      const languages = ['en', 'ar'];

      for (const lang of languages) {
        const filePath = path.join(dataPath, `${lang}.json`);
        if (fs.existsSync(filePath)) {
          const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          await this.legalRepository.save({
            language: lang,
            content,
          });
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
      where: { language: lang },
    });

    if (!doc) {
      throw new NotFoundException(`Legal page in language '${language}' not found.`);
    }

    const result = doc.content[type];

    if (!result) {
      throw new NotFoundException(`Legal section '${type}' not found in language '${language}'.`);
    }

    await this.cacheService.set(this.cachePrefix, cacheKey, result);

    return result;
  }
}
