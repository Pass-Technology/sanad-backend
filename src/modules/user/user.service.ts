import { Injectable, UnauthorizedException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { RegisterDto } from './dto/register.dto';
import { AuthDto } from './dto/auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AppConfigService } from '../../config/config.service';

import { UserIdentifierType } from './enums/user-identifier-type.enum';
import { OtpPurposeEnum } from '../otp/enum/otp-purpose.enum';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendOtpDto } from '../otp/dto/send-otp.dto';
import { OtpService } from '../otp/otp.service';
import { OtpRepository } from '../otp/otp.repository';
import { MailService } from '../mail/mail.service';
import { UserInfoResponseWithTokensDto } from './dto/user-info-response.dto';
import { OtpAuthDto } from './dto/auth-otp.dto';
import { UserPayloadType } from './types/user-payload.type';
import { AuthTokensResponse, JwtPayloadType } from './types/user-token.type';
import { ForgetPasswordDto } from './dto/forget-password.dto';


@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly config: AppConfigService,
    @Inject(forwardRef(() => OtpService))
    private readonly otpService: OtpService,
    private readonly otpRepository: OtpRepository,
    private readonly mailService: MailService,
  ) { }


  async register(dto: RegisterDto) {
    const { identifier, password, identifierType } = dto;
    // console.log(identifier);

    const hashedPassword = await bcrypt.hash(password, 10);

    const isUserExist = await this.userRepository.findByIdentifier(identifier);
    if (isUserExist) {
      throw new UnauthorizedException('User already exists');
    }
    const user = await this.userRepository.create({
      identifier,
      identifierType,
      password: hashedPassword,
    });

    const { otp } = await this.otpService.createOtpForUser(user.id, identifier, OtpPurposeEnum.REGISTER);

    if (identifierType === UserIdentifierType.EMAIL) {
      this.mailService.sendMail({
        to: identifier,
        subject: 'Sanad - Welcome to Sanad App!',
        template: 'otp-arabic',
        context: {
          OTP_CODE: otp.toString(),
          LOGO_URL: 'sanad.png',
        },
      }).catch(err => console.error('Failed to send registration email', err));
    }

    return {
      message: 'Registration successful. Please verify your OTP.',
      userId: user.id,
      otp: otp.toString(),
    };
  }

  async markVerifiedAndGenerateToken(userId: string): Promise<AuthTokensResponse> {
    await this.userRepository.markUserVerified(userId);
    const user = (await this.userRepository.findById(userId))!;
    return this.generateTokens(user);
  }

  async markVerifiedAndGenerateTokenByIdentifier(
    identifier: string,
  ): Promise<AuthTokensResponse> {
    const user = (await this.userRepository.findByIdentifier(identifier))!;
    await this.userRepository.markUserVerified(user.id);
    return this.generateTokens({ ...user, isVerified: true });
  }

  async auth(dto: AuthDto): Promise<AuthTokensResponse> {
    const { identifier } = dto;

    const user = (await this.userRepository.findUserWithPassword(identifier))!;
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    // console.log(user.password)
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new ForbiddenException('Please verify your account first');
    }

    return this.generateTokens(user as UserPayloadType);
  }

  async refreshTokens(dto: RefreshDto): Promise<AuthTokensResponse> {
    const { refreshToken } = dto;

    try {
      // Decode without verification first to get the user ID
      const decoded = this.jwtService.decode(refreshToken) as { sub: string };
      console.log(decoded)
      if (!decoded || !decoded.sub) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.userRepository.findUserRefreshTokenByUserId(decoded.sub);
      console.log(user)
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (!user.isVerified) {
        throw new ForbiddenException('Please verify your account first');
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

  private async generateTokens(userPaylpad: UserPayloadType): Promise<AuthTokensResponse> {
    const { id, identifier, identifierType, isVerified, isProfileCompleted } = userPaylpad;
    const payload = {
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


    // Hash refresh token before saving
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.updateRefreshToken(id, hashedRefreshToken);

    return {
      accessToken,
      refreshToken,
      user: payload
    };
  }


  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    // JWT guard already validates user exists, so this is safe
    const authenticatedUser = (await this.userRepository.findById(userId))!;

    // Check if the provided identifier matches the authenticated user
    const matches = authenticatedUser.identifier === dto.identifier;

    if (!matches) {
      throw new UnauthorizedException(
        'Identifier does not match authenticated user',
      );
    }

    const isOldPasswordValid = await bcrypt.compare(
      dto.oldPassword,
      authenticatedUser.password,
    );
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Invalid current password');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    await this.userRepository.updatePassword(userId, hashedPassword);

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(dto: ForgetPasswordDto): Promise<{ message: string }> {
    const { identifier } = dto;
    const user = await this.userRepository.findByIdentifier(identifier);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.otpService.sendOtp({ identifier, purpose: OtpPurposeEnum.FORGOT_PASSWORD });
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const { identifier, password } = dto;

    const user = await this.userRepository.findUserWithLastOtp(identifier);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const lastOtpOfUser = user.otps[0];

    if (!lastOtpOfUser) {
      throw new UnauthorizedException('OTP not found');
    }

    const isValidOtp = await this.otpService.validateUserForgetPasswordOtp(lastOtpOfUser);
    if (!isValidOtp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.updatePassword(user.id, hashedPassword);

    // Clear OTP after successful reset
    await this.otpRepository.deleteByIdentifier(identifier);

    return { message: 'Password reset successfully' };
  }

  async delete(userId: string): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (user?.deletedAt) {
      user.deletedAt == null;
    }
    await this.userRepository.softDelete(userId);
    return { message: 'User deleted successfully' };
  }


  async getUserInfoWithTokensByIdentifier(identifier: string): Promise<UserInfoResponseWithTokensDto> {
    const user = (await this.userRepository.findByIdentifier(identifier))!;
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
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

  async getMe(user: JwtPayloadType) {
    const { identifier, identifierType, isVerified, isProfileCompleted } = user;
    const updatedUser = await this.userRepository.findByIdentifier(identifier);
    return updatedUser;
  }


  async validateAuthOtp(dto: OtpAuthDto) {
    const { identifier, otp, purpose } = dto;
    const user = await this.userRepository.findByIdentifier(identifier);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValidOtp = await this.otpService.validateUserOtp(otp, user.id, purpose);

    if (!isValidOtp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    await this.userRepository.markUserVerified(user.id);

    if (purpose === OtpPurposeEnum.REGISTER) {
      return this.generateTokens({ ...user, isVerified: true });
    }
    return { message: 'OTP verified successfully' };

  }
}
