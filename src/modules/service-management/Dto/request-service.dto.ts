import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RequestServiceDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    categoryId?: string;
}