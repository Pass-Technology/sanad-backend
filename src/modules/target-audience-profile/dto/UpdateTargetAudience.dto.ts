import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, Min, Max, ValidateNested } from "class-validator";
import { UpdateBasicInfoDto } from "./update-basic-info.dto";
import { UpdateServicesDto } from "./update-services.dto";
import { UpdateOperationsDto } from "./update-operations.dto";
import { UpdateCustomerProfileDto } from "./update-customer-profile.dto";
import { UpdatePurchasingDto } from "./update-purchasing.dto";
import { UpdateStrategyDto } from "./update-strategy.dto";

export class UpdateTargetAudienceDto {
    @ApiPropertyOptional()
    @ValidateNested()
    @Type(() => UpdateBasicInfoDto)
    basicInfo?: UpdateBasicInfoDto;

    @ApiPropertyOptional()
    @ValidateNested()
    @Type(() => UpdateServicesDto)
    services?: UpdateServicesDto;

    @ApiPropertyOptional()
    @ValidateNested()
    @Type(() => UpdateOperationsDto)
    operations?: UpdateOperationsDto;

    @ApiPropertyOptional()
    @ValidateNested()
    @Type(() => UpdateCustomerProfileDto)
    customer?: UpdateCustomerProfileDto;

    @ApiPropertyOptional()
    @ValidateNested()
    @Type(() => UpdatePurchasingDto)
    purchasing?: UpdatePurchasingDto;

    @ApiPropertyOptional()
    @ValidateNested()
    @Type(() => UpdateStrategyDto)
    strategy?: UpdateStrategyDto;

    @ApiPropertyOptional({ description: 'Target audience profile completion score (0-100), calculated and sent by the frontend', minimum: 0, maximum: 100 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    targetAudienceProfileCompleteScore?: number;
}