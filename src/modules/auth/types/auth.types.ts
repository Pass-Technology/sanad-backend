import { UserIdentifierType } from '../../user/enums/user-identifier-type.enum';

export type JwtPayloadType = {
  sub: string;
  identifier: string;
  identifierType: UserIdentifierType;
  isVerified: boolean;
  isProfileCompleted: boolean;
};

export type AuthTokensResponse = {
  accessToken: string;
  refreshToken: string;
  user: JwtPayloadType;
};

export type UserPayloadType = {
  id: string;
  identifier: string;
  identifierType: UserIdentifierType;
  isVerified: boolean;
  isProfileCompleted: boolean;
};
