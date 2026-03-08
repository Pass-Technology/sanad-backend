import { UserIdentifierType } from '../../user/enums/user-identifier-type.enum';

export type JwtPayload = {
  sub: string;
  identifier: string;
  identifierType: UserIdentifierType;
  isVerified: boolean;
  isProfileCompleted: boolean;
};
