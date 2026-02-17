import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { AuthDto } from './dto/auth.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.userService.register(dto);
  }

  @Post('validate-otp')
  async validateOtp(@Body() dto: ValidateOtpDto) {
    return this.userService.validateOtp(dto);
  }

  @Post('auth')
  async auth(@Body() dto: AuthDto) {
    return this.userService.auth(dto);
  }
}
