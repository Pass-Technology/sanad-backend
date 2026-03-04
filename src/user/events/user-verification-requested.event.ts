import { AuthTokenResponseDto } from '../dto/auth-token-response.dto';

export class UserVerificationRequestedEvent {
  identifier!: string;
  tokens?: AuthTokenResponseDto;
}

