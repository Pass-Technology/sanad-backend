import {
  Controller,
  Get,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtPayload } from '../../shared/types/jwt-payload.type';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VerificationGuard } from '../auth/guards/verification.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info from token' })
  getInfo(@CurrentUser() user: JwtPayload) {
    return this.userService.getMe(user);
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard, VerificationGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete current user account (requires authentication)' })
  async delete(@CurrentUser() user: JwtPayload): Promise<{ message: string }> {
    return await this.userService.delete(user.sub);
  }
}
