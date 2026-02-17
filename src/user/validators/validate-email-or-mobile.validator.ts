import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function ValidateEmailOrMobile(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'validateEmailOrMobile',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(_value: any, args: ValidationArguments) {
          const obj = args.object as Record<string, any>;
          const hasEmail = obj.email && obj.email.toString().trim().length > 0;
          const hasMobile = obj.mobile && obj.mobile.toString().trim().length > 0;
          return hasEmail || hasMobile;
        },
        defaultMessage() {
          return 'Either email or mobile must be provided';
        },
      },
    });
  };
}
