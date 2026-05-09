import { UserIdentifierType } from '../../modules/user/enums/user-identifier-type.enum';
import { UserType } from '../../modules/user/enums/user-type.enum';

export type JwtPayload = {
  sub: string;
  identifier: string;
  identifierType: UserIdentifierType;
  isVerified: boolean;
  isProfileCompleted: boolean;
  type: UserType;
};
