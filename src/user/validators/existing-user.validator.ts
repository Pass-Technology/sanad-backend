import { Injectable } from '@nestjs/common';
import {
  ExistingEntityRecordValidator,
  isExistingEntityRecordValidator,
} from '../../shared/validators/existing-entity-record.validator';
import { ValidatorConstraint } from 'class-validator';
import { UserRepository } from '../user.repository';

@Injectable()
@ValidatorConstraint({ async: true })
export class ExistingUserValidator extends ExistingEntityRecordValidator {
  constructor(userRepository: UserRepository) {
    super(userRepository, 'User', {
      inverse: true,
      message: 'User with this email or mobile already exists',
    });
  }
}

export const IsUserNotExisting = isExistingEntityRecordValidator(
  ExistingUserValidator,
  { inverse: true },
);
