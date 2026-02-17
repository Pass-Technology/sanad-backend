import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { AuthDto } from './dto/auth.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() dto: RegisterDto) {
    return this.userService.register(dto);
  }

  @Post('validate-otp')
  @ApiOperation({ summary: 'Validate OTP and get auth token' })
  @ApiResponse({ status: 201, description: 'OTP validated, auth token returned' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Invalid or expired OTP' })
  async validateOtp(@Body() dto: ValidateOtpDto) {
    return this.userService.validateOtp(dto);
  }

  @Post('auth')
  @ApiOperation({ summary: 'Authenticate with email/mobile and password' })
  @ApiResponse({ status: 201, description: 'Authentication successful, auth token returned' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async auth(@Body() dto: AuthDto) {
    return this.userService.auth(dto);
  }
}
