import { PartialType, OmitType, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCompanyInfoDto } from './step-1-company-info.dto';
import { CreateUserInfoDto } from './step-2-user-info.dto';
import { CreateComplianceDto } from './step-5-compliance.dto';
import { CreateServicesDto } from './step-4-services.dto';
import { CreateBranchDto } from './step-3-branches.dto';
import { IsOptional, IsUUID, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCompanyInfoDto extends PartialType(OmitType(CreateCompanyInfoDto, ['providerTypeId', 'companyTypeId'] as const)) { }
export class UpdateUserInfoDto extends PartialType(CreateUserInfoDto) { }
export class UpdateComplianceDto extends PartialType(CreateComplianceDto) { }
export class UpdateServicesDto extends PartialType(CreateServicesDto) { }
export class UpdateBranchDto extends PartialType(CreateBranchDto) {
    @ApiProperty({
        required: false,
        example: 'f490f1ee-6c54-4b01-90e6-d701748f0851',
        description: 'Record ID. Provide it to update or delete an existing record. Leave empty to create a new one.'
    })
    @IsOptional()
    @IsUUID()
    id?: string;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;
}

export class UpdateBranchesDto {
    @ApiProperty({ type: [UpdateBranchDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateBranchDto)
    branches: UpdateBranchDto[];
}
