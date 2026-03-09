import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OtpService } from './otp.service';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { AuthTokenResponseDto } from '../user/dto/auth-token-response.dto';

@ApiTags('otp')
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) { }

  @Post('send')
  @ApiOperation({ summary: 'Send OTP to existing user by email or mobile' })
  async sendOtp(@Body() dto: SendOtpDto): Promise<{ message: string }> {
    return await this.otpService.sendOtp(dto);
  }

  @Post('validate-otp')
  @ApiOperation({ summary: 'Validate OTP and get auth token' })
  async validateOtp(
    @Body() dto: ValidateOtpDto,
  ): Promise<AuthTokenResponseDto> {
    return this.otpService.validateOtp(dto);
  }
}
