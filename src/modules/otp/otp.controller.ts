import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OtpService } from './otp.service';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';

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
  @ApiOperation({ summary: 'Validate OTP' })
  async validateOtp(
    @Body() validateOtpDto: ValidateOtpDto,
  ): Promise<UserInfoResponseWithTokensDto> {
    return await this.otpService.validateOtp(validateOtpDto);
  }
}
