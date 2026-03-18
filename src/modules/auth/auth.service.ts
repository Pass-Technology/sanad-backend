import { Injectable, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { AppConfigService } from '../../config/config.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AuthTokenResponseDto } from './dto/auth-token-response.dto';
import { UserInfoResponseWithTokensDto } from './dto/user-info-response-with-Tokens.dto';
import { UserIdentifierType } from '../user/enums/user-identifier-type.enum';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendOtpDto } from '../otp/dto/send-otp.dto';
import { ValidateOtpDto } from '../otp/dto/validate-otp.dto';
import { OtpService } from '../otp/otp.service';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly config: AppConfigService,
    private readonly otpService: OtpService,
  ) { }

  async auth(authDto: AuthDto): Promise<UserInfoResponseWithTokensDto> {
    const { identifier } = authDto;
    const user = await this.userRepository.findByIdentifier(identifier);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(authDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new ForbiddenException('Please verify your account first');
    }

    const token = await this.generateTokens(user);
    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      userId: user.id,
      isProfileCompleted: user.isProfileCompleted,
      isVerified: user.isVerified,
      identifier: user.identifier,
      identifierType: user.identifierType,
    };
  }

  async refreshTokens(refreshDto: RefreshDto): Promise<AuthTokenResponseDto> {
    const { refreshToken } = refreshDto;
    try {
      const decoded = this.jwtService.decode(refreshToken) as { sub: string };
      if (!decoded || !decoded.sub) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.userRepository.findById(decoded.sub);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (!user.isVerified) {
        throw new ForbiddenException('Please verify your account first');
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

  async generateTokens(user: {
    id: string;
    identifier: string;
    identifierType: UserIdentifierType;
    isVerified: boolean;
    isProfileCompleted: boolean;
  }): Promise<AuthTokenResponseDto> {
    const payload = {
      sub: user.id,
      identifier: user.identifier,
      identifierType: user.identifierType,
      isVerified: user.isVerified,
      isProfileCompleted: user.isProfileCompleted,
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
    await this.userRepository.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const authenticatedUser = await this.userRepository.findById(userId);
    if (!authenticatedUser) {
      throw new UnauthorizedException('User not found');
    }

    if (authenticatedUser.identifier !== changePasswordDto.identifier) {
      throw new UnauthorizedException('Identifier does not match authenticated user');
    }

    const isOldPasswordValid = await bcrypt.compare(changePasswordDto.oldPassword, authenticatedUser.password);
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Invalid current password');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.password, 10);
    await this.userRepository.updatePassword(userId, hashedPassword);

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(sendOtpDto: SendOtpDto): Promise<{ message: string }> {
    return this.otpService.sendOtp(sendOtpDto);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { identifier, password, otp } = resetPasswordDto;

    const user = await this.userRepository.findByIdentifier(identifier);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // check the validation of otp first
    const isValid = await this.otpService.validateOtpInternal(identifier, otp);
    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.updatePassword(user.id, hashedPassword);

    return { message: 'Password reset successfully' };
  }

  async verifyOtpAndLogin(validateOtpDto: ValidateOtpDto): Promise<UserInfoResponseWithTokensDto> {
    const { identifier, otp } = validateOtpDto;

    const isValid = await this.otpService.validateOtpInternal(identifier, otp);
    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }

    const user = await this.userRepository.findByIdentifier(identifier);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.userRepository.markUserVerified(user.id);
    const token = await this.generateTokens({ ...user, isVerified: true });

    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      userId: user.id,
      isProfileCompleted: user.isProfileCompleted,
      isVerified: true,
      identifier: user.identifier,
      identifierType: user.identifierType,
    };
  }
}
