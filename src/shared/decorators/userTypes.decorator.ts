import { SetMetadata } from '@nestjs/common';
import { UserType } from '../../modules/user/enums/user-type.enum';

export const UserTypes = (...types: UserType[]) => SetMetadata('userTypes', types);