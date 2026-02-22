import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { AuthDto } from './dto/auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { AuthTokenResponseDto } from './dto/auth-token-response.dto';
import { UserInfoResponseDto } from './dto/user-info-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
    return this.userService.register(dto);
  }

  @Post('auth')
  @ApiOperation({ summary: 'Authenticate with email/mobile and password' })
  async auth(@Body() dto: AuthDto): Promise<AuthTokenResponseDto> {
    return this.userService.auth(dto);
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
    return this.userService.changePassword(req.user.userId, dto);
  }
}
