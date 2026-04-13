import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCompanyInfoDto } from './step-1-company-info.dto';
import { CreateUserInfoDto } from './step-2-user-info.dto';
import { CreateComplianceDto } from './step-5-compliance.dto';
import { CreateServicesDto } from './step-4-services.dto';
import { CreateBranchDto } from './step-3-branches.dto';

export class UpdateCompanyInfoDto extends PartialType(OmitType(CreateCompanyInfoDto, ['providerTypeId', 'companyTypeId'] as const)) {}
export class UpdateUserInfoDto extends PartialType(CreateUserInfoDto) {}
export class UpdateComplianceDto extends PartialType(CreateComplianceDto) {}
export class UpdateServicesDto extends PartialType(CreateServicesDto) {}
export class UpdateBranchDto extends PartialType(CreateBranchDto) {}
