import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { OtpService } from '../otp/otp.service';
import { JwtPayload } from '../../shared/types/jwt-payload.type';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpService: OtpService,
  ) { }

  async getMe(userId: string) {
    const user = await this.userRepository.findMeInfo(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async delete(userId: string): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (user?.deletedAt) {
      user.deletedAt = null as any;
    }
    await this.userRepository.softDelete(userId);
    return { message: 'User deleted successfully' };
  }
}
