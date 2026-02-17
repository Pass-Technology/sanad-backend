import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { IEntityExistsRepository } from '../interfaces/repository.interface';

export interface ExistingEntityValidatorOptions {
  /** Field to check (e.g. 'email', 'mobile', 'id') - can also come from constraints */
  field?: string;
  /** When true, validation passes when entity does NOT exist (for uniqueness) */
  inverse?: boolean;
  /** Custom error message */
  message?: string;
}

export class ExistingEntityRecordValidator implements ValidatorConstraintInterface {
  constructor(
    private repository: IEntityExistsRepository,
    private modelName: string,
    private options?: ExistingEntityValidatorOptions,
  ) {}

  async validate(value: string, args: ValidationArguments): Promise<boolean> {
    if (!value || typeof value !== 'string') return true;

    const field: string =
      this.options?.field ??
      (typeof args.constraints?.[0] === 'string' ? args.constraints[0] : args.property) ??
      'id';
    const inverse: boolean =
      this.options?.inverse ??
      (typeof args.constraints?.[1] === 'boolean' ? args.constraints[1] : false);

    const where: Record<string, string> = { [field]: value };
    const exists = await this.repository.exists(where);

    return inverse ? !exists : !!exists;
  }

  defaultMessage(args: ValidationArguments): string {
    const inverse: boolean =
      this.options?.inverse ??
      (typeof args.constraints?.[1] === 'boolean' ? args.constraints[1] : false);
    if (this.options?.message) return this.options.message;
    if (inverse) {
      return `${this.modelName} with this value already exists`;
    }
    return `${this.modelName} doesn't exist`;
  }
}

export function isExistingEntityRecordValidator(
  existingValidator: new (...args: any[]) => ExistingEntityRecordValidator,
  defaultOptions?: Partial<ExistingEntityValidatorOptions>,
) {
  return function createValidator(
    validationOptions?: ValidationOptions &
      Partial<ExistingEntityValidatorOptions>,
  ) {
    return function (object: object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName,
        options: validationOptions,
        constraints: validationOptions?.field
          ? [validationOptions.field, validationOptions.inverse]
          : [],
        validator: existingValidator,
      });
    };
  };
}
