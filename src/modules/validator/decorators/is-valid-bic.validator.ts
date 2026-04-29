import { registerDecorator, ValidationOptions } from 'class-validator';
import { isValidBIC } from 'ibantools';

export function IsValidBIC(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isValidBIC',
            target: object.constructor,
            propertyName,
            options: { message: 'Invalid SWIFT/BIC code', ...validationOptions },
            validator: {
                validate(value: string) {
                    if (!value?.trim()) return false;
                    return isValidBIC(value.trim().toUpperCase());
                },
            },
        });
    };
}