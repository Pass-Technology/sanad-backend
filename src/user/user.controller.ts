import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { AuthDto } from './dto/auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { AuthTokenResponseDto } from './dto/auth-token-response.dto';
import { ErrorResponseDto } from './dto/error-response.dto';
import { UserInfoResponseDto } from './dto/user-info-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
    type: ErrorResponseDto,
  })
  async register(@Body() dto: RegisterDto) {
    return this.userService.register(dto);
  }

  @Post('auth')
  @ApiOperation({ summary: 'Authenticate with email/mobile and password' })
  @ApiResponse({
    status: 201,
    description: 'Authentication successful, auth token returned',
    type: AuthTokenResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error (non-existent user)',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid password',
    type: ErrorResponseDto,
  })
  async auth(@Body() dto: AuthDto) {
    return this.userService.auth(dto);
  }

  @Get('info')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info from token' })
  @ApiResponse({
    status: 200,
    description: 'Current user details from token context',
    type: UserInfoResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
    type: ErrorResponseDto,
  })
  getInfo(@Request() req: { user: UserInfoResponseDto }) {
    return req.user;
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password (requires authentication)' })
  @ApiResponse({
    status: 201,
    description: 'Password changed successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Password changed successfully' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid token or email/mobile mismatch',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorResponseDto,
  })
  async changePassword(@Request() req: any, @Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(req.user.userId, dto);
  }
}
