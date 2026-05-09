import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AppConfigService } from '../../config/config.service';
import { UserRepository } from '../user/user.repository';
import { UserPayloadType } from '../user/types/user-payload.type';
import { AuthTokensResponse } from '../user/types/user-token.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: AppConfigService,
    private readonly userRepository: UserRepository,
  ) { }

  async generateTokens(userPayload: UserPayloadType): Promise<AuthTokensResponse> {
    const { id, identifier, identifierType, isVerified, isProfileCompleted, type } = userPayload;
    const payload = {
      sub: id,
      identifier: identifier,
      identifierType: identifierType,
      isVerified: isVerified,
      isProfileCompleted: isProfileCompleted,
      type: type,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.auth.jwtSecret,
      expiresIn: this.config.auth.accessExpiration as any,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.auth.jwtRefreshSecret,
      expiresIn: this.config.auth.refreshExpiration as any,
    });

    // Hash refresh token before saving
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.updateRefreshToken(id, hashedRefreshToken);

    return {
      accessToken,
      refreshToken,
      user: payload
    };
  }

  async refreshTokens(dto: { refreshToken: string }): Promise<AuthTokensResponse> {
    const { refreshToken } = dto;

    try {
      // Decode without verification first to get the user ID
      const decoded = this.jwtService.decode(refreshToken) as { sub: string };
      if (!decoded || !decoded.sub) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.userRepository.findUserRefreshTokenByUserId(decoded.sub);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Verify the refresh token with the secret
      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.auth.jwtRefreshSecret,
      });

      // Compare hashed token
      const isTokenMatch = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isTokenMatch) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
