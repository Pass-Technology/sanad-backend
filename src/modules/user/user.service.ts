import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { RegisterDto } from './dto/register.dto';
import { AuthDto } from './dto/auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshDto } from './dto/refresh.dto';
import { USER_REGISTERED_EVENT } from './constants/events.constants';
import { UserRegisteredEvent } from './events/user-registered.event';
import { AppConfigService } from '../../config/config.service';
import { AuthTokenResponseDto } from './dto/auth-token-response.dto';
import { UserIdentifierType } from './enums/user-identifier-type.enum';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendOtpDto } from '../otp/dto/send-otp.dto';
import { OtpService } from '../otp/otp.service';
import { OtpRepository } from '../otp/otp.repository';


@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
    private readonly config: AppConfigService,
    private readonly otpService: OtpService,
    private readonly otpRepository: OtpRepository,
  ) { }


  async register(dto: RegisterDto) {
    const { identifier, password, identifierType } = dto;
    console.log(identifier);

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

    const event = new UserRegisteredEvent();
    event.userId = user.id;
    event.identifier = identifier;
    await this.eventEmitter.emitAsync(USER_REGISTERED_EVENT, event);

    return {
      message: 'Registration successful. Please verify your OTP.',
      userId: user.id,
      otp: event.otp!,
    };
  }

  async markVerifiedAndGenerateToken(userId: string): Promise<AuthTokenResponseDto> {
    await this.userRepository.markUserVerified(userId);
    const user = (await this.userRepository.findById(userId))!;
    return this.generateTokens(user);
  }

  async markVerifiedAndGenerateTokenByIdentifier(
    identifier: string,
  ): Promise<AuthTokenResponseDto> {
    const user = (await this.userRepository.findByIdentifier(identifier))!;
    await this.userRepository.markUserVerified(user.id);
    return this.generateTokens({ ...user, isVerified: true });
  }

  async auth(dto: AuthDto): Promise<AuthTokenResponseDto> {
    const { identifier } = dto;

    const user = (await this.userRepository.findByIdentifier(identifier))!;
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new ForbiddenException('Please verify your account first');
    }

    return this.generateTokens(user);

  }

  async refreshTokens(dto: RefreshDto): Promise<AuthTokenResponseDto> {
    const { refreshToken } = dto;

    try {
      // Decode without verification first to get the user ID
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

  private async generateTokens(user: {
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


    // Hash refresh token before saving
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      accessToken,
      refreshToken,
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

  async forgotPassword(dto: SendOtpDto): Promise<{ message: string }> {
    return this.otpService.sendOtp(dto);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const { identifier, password } = dto;

    const user = await this.userRepository.findByIdentifier(identifier);
    if (!user) {
      throw new UnauthorizedException('User not found');
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
}
