import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendOtpDto } from '../otp/dto/send-otp.dto';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { UserInfoResponseWithTokensDto } from './dto/user-info-response-with-Tokens.dto';
import { AuthTokenResponseDto } from './dto/auth-token-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate with email/mobile and password' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials or user not found' })
  @ApiForbiddenResponse({ description: 'Please verify your account first' })
  async login(@Body() authDto: AuthDto) {
    return await this.authService.auth(authDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiUnauthorizedResponse({ description: 'Invalid refresh token' })
  @ApiForbiddenResponse({ description: 'Please verify your account first' })
  async refresh(@Body() refreshDto: RefreshDto): Promise<AuthTokenResponseDto> {
    return await this.authService.refreshTokens(refreshDto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password (requires authentication)' })
  async changePassword(
    @CurrentUser() user: UserInfoResponseWithTokensDto,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return await this.authService.changePassword(user.userId, changePasswordDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request OTP for password reset' })
  async forgotPassword(@Body() sendOtpDto: SendOtpDto): Promise<{ message: string }> {
    return await this.authService.forgotPassword(sendOtpDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using OTP' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    return await this.authService.resetPassword(resetPasswordDto);
  }
}
