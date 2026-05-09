import { JwtPayload } from '../../../shared/types/jwt-payload.type';

export type AuthTokensResponse = {
  accessToken: string;
  refreshToken: string;
  user: JwtPayload;
};
