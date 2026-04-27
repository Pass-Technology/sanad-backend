import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../../config/config.service';
import { AuthTokensResponse, UserPayloadType, JwtPayloadType } from './types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: AppConfigService,
  ) {}

  async generateTokens(userPayload: UserPayloadType): Promise<AuthTokensResponse> {
    const { id, identifier, identifierType, isVerified, isProfileCompleted } = userPayload;
    const payload: JwtPayloadType = {
      sub: id,
      identifier: identifier,
      identifierType: identifierType,
      isVerified: isVerified,
      isProfileCompleted: isProfileCompleted,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.auth.jwtSecret,
      expiresIn: this.config.auth.accessExpiration as any,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.auth.jwtRefreshSecret,
      expiresIn: this.config.auth.refreshExpiration as any,
    });

    return {
      accessToken,
      refreshToken,
      user: payload,
    };
  }
}
