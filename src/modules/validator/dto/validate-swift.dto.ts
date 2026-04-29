import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { IsValidBIC } from "../decorators/is-valid-BIC.validator";

export class ValidateSwiftDto {
    @ApiProperty({ example: 'ADCBAEAA', description: 'SWIFT code to validate' })
    @IsString()
    @IsNotEmpty()
    @IsValidBIC()
    swift: string;
}