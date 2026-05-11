import {
  Controller,
  Get,
  UseGuards,
  Delete,
  Request,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VerificationGuard } from '../auth/guards/verification.guard';
import { UserInfoResponseWithTokensDto } from './dto/user-info-response.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info from token' })
  getInfo(@Request() req: { user: UserInfoResponseWithTokensDto }) {
    return this.userService.getMe(req.user.userId);
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard, VerificationGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete current user account (requires authentication)' })
  async delete(@Request() req: { user: UserInfoResponseWithTokensDto }): Promise<{ message: string }> {
    return await this.userService.delete(req.user.userId);
  }
}
