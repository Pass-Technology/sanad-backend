import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { RegisterDto } from './dto/register.dto';
import { AuthDto } from './dto/auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { USER_REGISTERED_EVENT } from './constants/events.constants';
import { UserRegisteredEvent } from './events/user-registered.event';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async register(dto: RegisterDto) {
    const identifier = dto.email ?? dto.mobile!;

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.create({
      email: dto.email,
      mobile: dto.mobile,
      password: hashedPassword,
    });

    const event = new UserRegisteredEvent();
    event.userId = user.id;
    event.identifier = identifier;
    await this.eventEmitter.emitAsync(USER_REGISTERED_EVENT, event);

    return {
      message: 'Registration successful. Please verify your OTP.',
      userId: user.id,
      otp: event.otp!,
    };
  }

  async markVerifiedAndGenerateToken(userId: string): Promise<string> {
    await this.userRepository.markUserVerified(userId);
    const user = (await this.userRepository.findById(userId))!;
    return this.generateToken(user);
  }

  async markVerifiedAndGenerateTokenByIdentifier(
    identifier: string,
  ): Promise<string> {
    const user = (await this.userRepository.findByIdentifier(identifier))!;
    await this.userRepository.markUserVerified(user.id);
    return this.generateToken(user);
  }

  async auth(dto: AuthDto) {
    const identifier = dto.email ?? dto.mobile!;

    const user = (await this.userRepository.findByIdentifier(identifier))!;

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { authToken: token };
  }

  private generateToken(user: {
    id: string;
    email: string | null;
    mobile: string | null;
  }) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      mobile: user.mobile,
    });
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    // JWT guard already validates user exists, so this is safe
    const authenticatedUser = (await this.userRepository.findById(userId))!;

    // Check if the provided email/mobile matches the authenticated user
    const matchesEmail = dto.email && authenticatedUser.email === dto.email;
    const matchesMobile = dto.mobile && authenticatedUser.mobile === dto.mobile;

    if (!matchesEmail && !matchesMobile) {
      throw new UnauthorizedException(
        'Email or mobile does not match authenticated user',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    await this.userRepository.updatePassword(userId, hashedPassword);

    return { message: 'Password changed successfully' };
  }
}
