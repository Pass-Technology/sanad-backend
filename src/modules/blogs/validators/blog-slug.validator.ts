import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { BLOG_SLUG_REGEX } from '../blog-schema';

@ValidatorConstraint({ name: 'isBlogSlug', async: false })
export class IsBlogSlugConstraint implements ValidatorConstraintInterface {
    validate(value: unknown): boolean {
        return typeof value === 'string' && BLOG_SLUG_REGEX.test(value);
    }

    defaultMessage(): string {
        return 'slug may only contain lowercase a-z, Arabic letters, digits (0-9 / ٠-٩) and hyphens';
    }
}

export function IsBlogSlug(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isBlogSlug',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: IsBlogSlugConstraint,
        });
    };
}
