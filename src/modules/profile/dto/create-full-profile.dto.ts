import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateCompanyInfoDto } from './create-company-info.dto';
import { CreateUserInfoDto } from './create-user-info.dto';
import { CreateBranchesDto } from './create-branches.dto';
import { CreateServicesDto } from './create-services.dto';
import { CreateComplianceDto } from './create-compliance.dto';
import { CreatePaymentDto } from '../../payment/dto/create-payment.dto';

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
