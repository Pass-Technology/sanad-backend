import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested, ArrayMinSize } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContractAssetDto {
    @ApiProperty({ description: 'Public URL of the uploaded service documentation image' })
    @IsString()
    @IsNotEmpty()
    imageUrl: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    caption?: string;
}

export class AddContractAssetsDto {
    @ApiProperty({ type: [CreateContractAssetDto] })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateContractAssetDto)
    assets: CreateContractAssetDto[];
}
