import { registerDecorator, ValidationOptions } from 'class-validator';
import { isValidIBAN, electronicFormatIBAN } from 'ibantools';

export function IsValidIBAN(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isValidIBAN',
            target: object.constructor,
            propertyName,
            options: { message: 'Invalid IBAN', ...validationOptions },
            validator: {
                validate(value: string) {
                    if (!value?.trim()) return false;
                    const formatted = electronicFormatIBAN(value);
                    return formatted ? isValidIBAN(formatted) : false;
                },
            },
        });
    };
}