import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
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
}