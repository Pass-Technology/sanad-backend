import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    IsUUID,
    Matches,
    Min,
    ValidateNested,
} from 'class-validator';

export class ServingAreaDto {

    // @ApiPropertyOptional()
    // @IsOptional()
    // @IsUUID()
    // id?: string;

    @ApiProperty({ example: 10, minimum: 1 })
    @IsNumber()
    @Min(1)
    radiusKm: number;

    @ApiPropertyOptional({ example: '+971501234567' })
    @IsOptional()
    @IsString()
    @Matches(/^\+[1-9]\d{6,14}$/)
    phone?: string;

    @ApiPropertyOptional({ example: 'https://maps.google.com/...' })
    @IsOptional()
    @IsUrl({}, { message: 'mapLink must be a valid URL' })
    mapLink?: string;

    @ApiPropertyOptional({ example: 25.2048 })
    @IsOptional()
    @IsNumber()
    lat?: number;

    @ApiPropertyOptional({ example: 55.2708 })
    @IsOptional()
    @IsNumber()
    lng?: number;
}

export class CreateBranchDto {
    @ApiProperty({ example: 'Downtown Branch' })
    @IsString()
    @IsNotEmpty()
    branchName: string;

    @ApiProperty({ example: 'Mohamed Ali' })
    @IsString()
    @IsNotEmpty()
    branchManagerName: string;

    @ApiProperty({ example: 'Building 5, Sheikh Zayed Road' })
    @IsString()
    @IsNotEmpty()
    branchAddress: string;

    @ApiProperty({ example: 'Dubai' })
    @IsString()
    @IsNotEmpty()
    city: string;

    @ApiPropertyOptional({ example: '+97141234567' })
    @IsOptional()
    @IsString()
    @Matches(/^\+[1-9]\d{6,14}$/)
    branchPhone?: string;

    @ApiPropertyOptional({ example: '+971501234567' })
    @IsOptional()
    @IsString()
    @Matches(/^\+[1-9]\d{6,14}$/)
    managerPhone?: string;

    @ApiPropertyOptional({ example: 'https://maps.google.com/...' })
    @IsOptional()
    @IsUrl({}, { message: 'googleMapsLink must be a valid URL' })
    googleMapsLink?: string;

    @ApiPropertyOptional({ example: 'https://instagram.com/branch' })
    @IsOptional()
    @IsUrl({}, { message: 'socialMediaLink must be a valid URL' })
    socialMediaLink?: string;

    @ApiPropertyOptional({ type: [ServingAreaDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ServingAreaDto)
    servingAreas?: ServingAreaDto[];
}

export class CreateBranchesDto {
    @ApiProperty({ type: [CreateBranchDto] })
    @IsArray()
    @ArrayMinSize(1, { message: 'At least one branch is required' })
    @ValidateNested({ each: true })
    @Type(() => CreateBranchDto)
    branches: CreateBranchDto[];
}
