import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateComplianceDto {
    @ApiProperty({
        example: 'file-ref-or-upload-id',
        description: 'File reference / URL / upload ID for owner ID document',
    })
    @IsString()
    @IsNotEmpty()
    ownerIdFile: string;

    @ApiProperty({ example: '2027-12-31' })
    @IsString()
    @IsNotEmpty()
    ownerIdExpiryDate: string;

    @ApiProperty({
        example: 'file-ref-or-upload-id',
        description: 'File reference / URL / upload ID for trade license',
    })
    @IsString()
    @IsNotEmpty()
    tradeLicenseFile: string;

    @ApiProperty({ example: '2027-06-30' })
    @IsString()
    @IsNotEmpty()
    tradeLicenseExpiryDate: string;
}
