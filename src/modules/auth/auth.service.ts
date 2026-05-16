import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AppConfigService } from '../../config/config.service';
import { UserRepository } from '../user/user.repository';
import { UserPayloadType } from '../user/types/user-payload.type';
import { JwtPayload } from '../../shared/types/jwt-payload.type';
import { AuthTokensResponse } from '../user/types/user-token.type';
import { RegisterDto } from '../user/dto/register.dto';
import { AuthDto } from '../user/dto/auth.dto';
import { OtpAuthDto } from '../user/dto/auth-otp.dto';
import { ForgetPasswordDto } from '../user/dto/forget-password.dto';
import { ResetPasswordDto } from '../user/dto/reset-password.dto';
import { ChangePasswordDto } from '../user/dto/change-password.dto';
import { OtpService } from '../otp/otp.service';
import { OtpPurposeEnum } from '../otp/enum/otp-purpose.enum';
import { UserIdentifierType } from '../user/enums/user-identifier-type.enum';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';
import { JwtPayload } from 'src/shared/types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: AppConfigService,
    private readonly userRepository: UserRepository,
    private readonly otpService: OtpService,
  ) { }

  async register(dto: RegisterDto) {
    const { identifier, password, identifierType, type } = dto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const isUserExist = await this.userRepository.findByIdentifier(identifier);
    if (isUserExist) {
      throw new UnauthorizedException('User already exists');
    }

    const user = await this.userRepository.create({
      identifier,
      identifierType,
      password: hashedPassword,
      type
    });

    await this.otpService.createOtpForUser(user.id, identifier, OtpPurposeEnum.REGISTER);

    return {
      message: 'Registration successful. Please verify your OTP.',
      userId: user.id,
    };
  }

  async auth(dto: AuthDto): Promise<AuthTokensResponse> {
    const { identifier, password } = dto;

    const user = await this.userRepository.findUserWithPassword(identifier);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new ForbiddenException('Please verify your account first');
    }

    return this.generateTokens(user as UserPayloadType);
  }

  async validateAuthOtp(dto: OtpAuthDto): Promise<AuthTokensResponse> {
    const { identifier, otp } = dto;

    await this.otpService.validateOtp(identifier, otp, OtpPurposeEnum.REGISTER);

    const user = await this.userRepository.findByIdentifier(identifier);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.userRepository.markUserVerified(user.id);
    return this.generateTokens({ ...user, isVerified: true } as UserPayloadType);
  }

  async forgotPassword(dto: ForgetPasswordDto): Promise<{ message: string }> {
    const { identifier } = dto;
    const user = await this.userRepository.findByIdentifier(identifier);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.otpService.createOtpForUser(user.id, identifier, OtpPurposeEnum.FORGOT_PASSWORD);

    return { message: 'OTP sent successfully' };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const { identifier, password } = dto;
    // Note: OTP validation should be handled prior or via separate logic if removed from DTO

    // await this.otpService.validateOtp(identifier, otp, OtpPurposeEnum.FORGOT_PASSWORD);

    const user = await this.userRepository.findByIdentifier(identifier);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.updatePassword(user.id, hashedPassword);

    return { message: 'Password reset successfully' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const authenticatedUser = await this.userRepository.findUserWithPassword(user.identifier);
    if (!authenticatedUser) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(dto.oldPassword, authenticatedUser.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid old password');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    await this.userRepository.updatePassword(userId, hashedPassword);

    return { message: 'Password changed successfully' };
  }

  async generateTokens(userPayload: UserPayloadType): Promise<AuthTokensResponse> {
    const { id, identifier, identifierType, isVerified, isProfileCompleted, type } = userPayload;
    const payload: JwtPayload = {
      sub: id,
      userId: id,
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
      const decoded = this.jwtService.decode(refreshToken) as { sub: string };
      if (!decoded || !decoded.sub) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.userRepository.findUserRefreshTokenByUserId(decoded.sub);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.auth.jwtRefreshSecret,
      });

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
