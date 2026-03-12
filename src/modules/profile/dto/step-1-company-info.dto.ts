import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    IsArray,
    IsUUID,
} from 'class-validator';
import { LOOKUP_IDS } from 'src/shared/constants/lookup-ids';

export class CreateCompanyInfoDto {
    @ApiProperty({
        example: LOOKUP_IDS.PROVIDER_TYPE.COMPANY,
        description: 'Provider type: individual or company',
    })
    @IsNotEmpty()
    @IsUUID()
    providerTypeId: string;

    @ApiPropertyOptional({
        example: LOOKUP_IDS.COMPANY_TYPE.GOVERNMENT,
        description: 'Required when providerType is company',
    })
    @IsNotEmpty()
    @IsUUID()
    companyTypeId?: string;

    @ApiProperty({ example: 'Sanad Services LLC' })
    @IsString()
    @IsNotEmpty()
    tradeName: string;

    @ApiPropertyOptional({
        example: 'Ahmed Ahmed',
        description: 'Required when providerType is company',
    })
    @IsString()
    @IsNotEmpty()
    companyRepresentativeName?: string;

    @ApiPropertyOptional({ example: 'Leading home services provider in the UAE' })
    @IsOptional()
    @IsString()
    companyDescription?: string;

    @ApiPropertyOptional({ example: 'https://instagram.com/sanad' })
    @IsOptional()
    @IsUrl({}, { message: 'socialMediaLink must be a valid URL' })
    socialMediaLink?: string;

    @ApiPropertyOptional({ example: 'https://sanad.ae' })
    @IsOptional()
    @IsUrl({}, { message: 'websiteLink must be a valid URL' })
    websiteLink?: string;

    @ApiPropertyOptional({
        example: ['Arabic', 'English'],
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    languagesSpoken?: string[];
}
