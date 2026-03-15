import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateCompanyInfoDto } from './step-1-company-info.dto';
import { CreateUserInfoDto } from './step-2-user-info.dto';
import { CreateBranchesDto } from './step-3-branches.dto';
import { CreateServicesDto } from './step-4-services.dto';
import { CreateComplianceDto } from './step-5-compliance.dto';
import { CreatePaymentDto } from './step-6-payment.dto';

export class CreateFullProfileDto {
    @ApiProperty({ type: CreateCompanyInfoDto })
    @ValidateNested()
    @Type(() => CreateCompanyInfoDto)
    companyInfo: CreateCompanyInfoDto;

    @ApiProperty({ type: CreateUserInfoDto })
    @ValidateNested()
    @Type(() => CreateUserInfoDto)
    userInfo: CreateUserInfoDto;

    @ApiProperty({ type: CreateBranchesDto })
    @ValidateNested()
    @Type(() => CreateBranchesDto)
    branches: CreateBranchesDto;

    @ApiProperty({ type: CreateServicesDto })
    @ValidateNested()
    @Type(() => CreateServicesDto)
    services: CreateServicesDto;

    @ApiProperty({ type: CreateComplianceDto })
    @ValidateNested()
    @Type(() => CreateComplianceDto)
    compliance: CreateComplianceDto;

    @ApiProperty({ type: CreatePaymentDto })
    @ValidateNested()
    @Type(() => CreatePaymentDto)
    payment: CreatePaymentDto;
}
