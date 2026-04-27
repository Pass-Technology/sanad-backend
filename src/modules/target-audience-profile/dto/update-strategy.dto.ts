import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum } from "class-validator";

export class UpdateStrategyDto {
    @ApiProperty({ enum: [true, false, 'Later'] })
    @IsEnum([true, false, 'Later'])
    status: boolean | 'Later'
}