import { UserIdentifierType } from '../enums/user-identifier-type.enum';

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
