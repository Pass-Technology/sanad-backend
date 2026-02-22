import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OtpService } from './otp.service';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { AuthTokenResponseDto } from '../user/dto/auth-token-response.dto';
import { ErrorResponseDto } from '../user/dto/error-response.dto';

@ApiTags('otp')
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

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
    return this.otpService.validateOtp(dto);
  }
}
