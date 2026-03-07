import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    IsArray,
    ValidateIf,
} from 'class-validator';

export class CreateCompanyInfoDto {
    @ApiProperty({
        example: "INDIVIDUAL",
        description: 'Provider type: individual or company',
    })
    @IsNotEmpty()
    providerTypeId: string;

    @ApiPropertyOptional({
        example: "PRIVATE",
        description: 'Required when providerType is company',
    })
    @ValidateIf((o: CreateCompanyInfoDto) => o.providerTypeId === "COMPANY")
    @IsNotEmpty({ message: 'companyType is required when providerType is company' })
    companyTypeId?: string;

    @ApiProperty({ example: 'Sanad Services LLC' })
    @IsString()
    @IsNotEmpty()
    tradeName: string;

    @ApiPropertyOptional({
        example: 'Ahmed Ahmed',
        description: 'Required when providerType is company',
    })
    @ValidateIf((o: CreateCompanyInfoDto) => o.providerTypeId === "COMPANY")
    @IsString()
    @IsNotEmpty({ message: 'companyRepresentativeName is required when providerType is company' })
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
