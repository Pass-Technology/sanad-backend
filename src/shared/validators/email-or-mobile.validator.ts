import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    isEmail,
    isMobilePhone,
} from 'class-validator';

@ValidatorConstraint({ name: 'isEmailOrMobile', async: false })
export class IsEmailOrMobileConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        if (typeof value !== 'string') return false;
        return isEmail(value) || isMobilePhone(value, 'any' as any);
    }

    defaultMessage(args: ValidationArguments) {
        return 'Identifier must be a valid email or mobile number';
    }
}

export function IsEmailOrMobile(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailOrMobileConstraint,
        });
    };
}
