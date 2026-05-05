import { Controller, Get, Headers, Param } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { LegalService } from './legal.service';
import { LegalDocumentType } from './enums/legal-document-type.enum';

@ApiTags('legal')
@Controller('legal')
export class LegalController {
  constructor(private readonly legalService: LegalService) { }

  @Get('privacy-policy')
  @ApiOperation({ summary: 'Get privacy policy' })
  async getPrivacyPolicy(@Headers('accept-language') lang: string = 'en') {
    const language = lang.split('-')[0] || 'en';
    return await this.legalService.getDocument(LegalDocumentType.PRIVACY_POLICY, language);
  }

  @Get('terms-of-service')
  @ApiOperation({ summary: 'Get terms and conditions' })
  async getTermsOfService(@Headers('accept-language') lang: string = 'en') {
    const language = lang.split('-')[0] || 'en';
    return await this.legalService.getDocument(LegalDocumentType.TERMS_OF_SERVICE, language);
  }

}
