import {
  Controller,
  Get,
  UseGuards,
  Delete,
  Param,
  Post,
  Body,
} from '@nestjs/common';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserInfoResponseWithTokensDto } from '../auth/dto/user-info-response-with-Tokens.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserRegisterResponseDto } from './dto/user-register-response.dto';


@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() userRegisterDto: UserRegisterDto): Promise<UserRegisterResponseDto> {
    return this.userService.register(userRegisterDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info from token' })
  getInfo(@CurrentUser() user: UserInfoResponseWithTokensDto) {
    return this.userService.getMe(user);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user (requires authentication)' })
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    return await this.userService.delete(id);
  }
}
