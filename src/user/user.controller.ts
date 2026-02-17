import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { AuthDto } from './dto/auth.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { AuthTokenResponseDto } from './dto/auth-token-response.dto';
import { ErrorResponseDto } from './dto/error-response.dto';

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

  @Post('validate-otp')
  @ApiOperation({ summary: 'Validate OTP and get auth token' })
  @ApiResponse({
    status: 201,
    description: 'OTP validated, auth token returned',
    type: AuthTokenResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error (invalid or expired OTP)',
    type: ErrorResponseDto,
  })
  async validateOtp(@Body() dto: ValidateOtpDto) {
    return this.userService.validateOtp(dto);
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
    status: 401,
    description: 'Invalid credentials',
    type: ErrorResponseDto,
  })
  async auth(@Body() dto: AuthDto) {
    return this.userService.auth(dto);
  }
}
