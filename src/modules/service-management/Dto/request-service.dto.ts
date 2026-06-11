import { IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class LocalizedNameDto {
    @IsNotEmpty()
    @IsString()
    en: string;

    @IsNotEmpty()
    @IsString()
    ar: string;
}

export class RequestServiceDto {
    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => LocalizedNameDto)
    name: LocalizedNameDto;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    categoryId?: string;
}

