import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RequestServiceDto {
    @IsOptional()
    @IsString()
    nameAr?: string;

    @IsOptional()
    @IsString()
    nameEn?: string;

    @IsOptional()
    @IsString()
    description?: string;
}