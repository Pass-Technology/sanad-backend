import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from '../user/dto/register.dto';
import { AuthDto } from '../user/dto/auth.dto';
import { RefreshDto } from '../user/dto/refresh.dto';
import { OtpAuthDto } from '../user/dto/auth-otp.dto';
import { ForgetPasswordDto } from '../user/dto/forget-password.dto';
import { ResetPasswordDto } from '../user/dto/reset-password.dto';
import { ChangePasswordDto } from '../user/dto/change-password.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { VerificationGuard } from '../../shared/guards/verification.guard';
import { RegisterResponseDto } from '../user/dto/register-response.dto';
import { RegisterWorkerDto } from './dto/register-worker.dto';
import { AuthTokensResponse } from '../user/types/user-token.type';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register(dto);
  }

  @Post('register/worker')
  @ApiOperation({ summary: 'Register a worker using an organization invitation token' })
  registerWorker(@Body() dto: RegisterWorkerDto): Promise<{ message: string; userId: string }> {
    return this.authService.registerWorker(dto);
  }

  @Post('validate-otp')
  @ApiOperation({ summary: 'Validate OTP and verify account' })
  async validateOtp(@Body() dto: OtpAuthDto): Promise<AuthTokensResponse> {
    return await this.authService.validateAuthOtp(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate with email/mobile and password' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials or user not found' })
  @ApiForbiddenResponse({ description: 'Please verify your account first' })
  async login(@Body() dto: AuthDto): Promise<AuthTokensResponse> {
    return await this.authService.auth(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiUnauthorizedResponse({ description: 'Invalid refresh token' })
  async refresh(@Body() dto: RefreshDto): Promise<AuthTokensResponse> {
    return await this.authService.refreshTokens(dto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard, VerificationGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password (requires authentication)' })
  async changePassword(
    @Request() req: { user: UserInfoResponseWithTokensDto },
    @Body() dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return await this.authService.changePassword(req.user.userId, dto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request OTP for password reset' })
  async forgotPassword(@Body() dto: ForgetPasswordDto): Promise<{ message: string }> {
    return await this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using OTP' })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<{ message: string }> {
    return await this.authService.resetPassword(dto);
  }
}
