import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { UserRepository } from '../user.repository';
import { ValidateOtpDto } from '../dto/validate-otp.dto';

@Injectable()
@ValidatorConstraint({ async: true })
export class ValidOtpValidator implements ValidatorConstraintInterface {
  constructor(private readonly userRepository: UserRepository) {}

  async validate(otp: string, args: ValidationArguments): Promise<boolean> {
    if (!otp || typeof otp !== 'string') return false;

    const dto = args.object as ValidateOtpDto;
    const identifier = dto.email ?? dto.mobile;
    if (!identifier) return false;

    const otpVerification = await this.userRepository.findValidOtp(
      identifier,
      otp,
    );
    return !!otpVerification;
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
