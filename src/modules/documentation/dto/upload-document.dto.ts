import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class UploadDocumentDto {
    @ApiProperty({ description: 'Document type (e.g., ID Card, Professional License)' })
    @IsString()
    type: string;

    @ApiProperty({ description: 'File URL from storage' })
    @IsString()
    fileUrl: string;

    @ApiProperty({ required: false, description: 'Expiry date if applicable' })
    @IsOptional()
    @IsDateString()
    expiryDate?: string;
}
