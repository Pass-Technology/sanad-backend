import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { isValidPhoneNumber, CountryCode } from 'libphonenumber-js/mobile';

export function IsMobilePhoneNumber(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isMobilePhoneNumber',
            target: object.constructor,
            propertyName: propertyName,
            options: {
                message: 'phone number must be a valid mobile number',
                ...validationOptions,
            },
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (typeof value !== 'string') return false;
                    try {
                        // We pass undefined for country code to force E.164 format (+ prefixed)
                        // If you want to support local formats without +, you need to pass a default region code.
                        return isValidPhoneNumber(value);
                    } catch (e) {
                        return false;
                    }
                },
            },
        });
    };
}
