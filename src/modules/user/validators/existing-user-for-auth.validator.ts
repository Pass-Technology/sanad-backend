import { Injectable } from '@nestjs/common';
import {
  ExistingEntityRecordValidator,
  isExistingEntityRecordValidator,
} from '../../../shared/validators/existing-entity-record.validator';
import { ValidatorConstraint } from 'class-validator';
import { UserRepository } from '../user.repository';

@Injectable()
@ValidatorConstraint({ async: true })
export class ExistingUserForAuthValidator extends ExistingEntityRecordValidator {
  constructor(userRepository: UserRepository) {
    super(userRepository, 'User', {
      inverse: false,
      message: 'Invalid credentials',
    });
  }
}

export const IsUserExisting = isExistingEntityRecordValidator(
  ExistingUserForAuthValidator,
);
