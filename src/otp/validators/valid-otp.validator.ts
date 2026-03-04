import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { AppConfigService } from '../../config/config.service';
import { OtpRepository } from '../otp.repository';
import { ValidateOtpDto } from '../dto/validate-otp.dto';

@Injectable()
@ValidatorConstraint({ async: true })
export class ValidOtpValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly config: AppConfigService,
  ) { }

  async validate(otp: string, args: ValidationArguments): Promise<boolean> {
    if (!otp || typeof otp !== 'string') return false;

    const dto = args.object as ValidateOtpDto;
    const { identifier } = dto;
    if (!identifier) return false;

    const defaultOtp = this.config.auth.defaultOtp?.toString();
    if (defaultOtp && otp === defaultOtp) return true;

    const otpRecord = await this.otpRepository.findValidOtp(identifier, otp);
    return !!otpRecord;
  }

  defaultMessage(): string {
    return 'Invalid or expired OTP';
  }
}

export function IsValidOtp(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: ValidOtpValidator,
    });
  };
}
