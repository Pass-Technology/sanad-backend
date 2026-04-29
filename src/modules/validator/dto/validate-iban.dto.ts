import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { IsValidIBAN } from "../decorators/is-valid-iban.validator";

export class ValidateIbanDto {
    @ApiProperty({ example: 'AE070331234567890123456', description: 'IBAN to validate' })
    @IsString()
    @IsNotEmpty()
    @IsValidIBAN()
    iban: string;
}