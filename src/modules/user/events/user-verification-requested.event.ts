import { AuthTokensResponse } from '../types/user-token.type';

export class UserVerificationRequestedEvent {
  identifier!: string;
  tokens?: AuthTokensResponse;
}

