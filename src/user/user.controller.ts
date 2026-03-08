import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { AuthDto } from './dto/auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendOtpDto } from '../otp/dto/send-otp.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { AuthTokenResponseDto } from './dto/auth-token-response.dto';
import { UserInfoResponseDto } from './dto/user-info-response.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';


@ApiTags('user')
@Controller('user')

export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  // @Version('2')
  async register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
    return await this.userService.register(dto);
  }

  @Post('auth')
  @ApiOperation({ summary: 'Authenticate with email/mobile and password' })
  async auth(@Body() dto: AuthDto): Promise<AuthTokenResponseDto> {
    return await this.userService.auth(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  async refresh(@Body() dto: RefreshDto): Promise<AuthTokenResponseDto> {
    return await this.userService.refreshTokens(dto);
  }


  @Get('info')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info from token' })
  getInfo(@Request() req: { user: UserInfoResponseDto }): UserInfoResponseDto {
    return req.user;
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password (requires authentication)' })
  async changePassword(
    @Request() req: { user: UserInfoResponseDto },
    @Body() dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return await this.userService.changePassword(req.user.userId, dto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request OTP for password reset' })
  async forgotPassword(@Body() dto: SendOtpDto): Promise<{ message: string }> {
    return await this.userService.forgotPassword(dto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using OTP' })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<{ message: string }> {
    return await this.userService.resetPassword(dto);
  }

  @Delete('delete:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user (requires authentication)' })
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    return await this.userService.delete(id);
  }
}
