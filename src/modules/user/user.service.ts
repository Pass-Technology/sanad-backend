import { Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { UserRegisterDto } from './dto/user-register.dto';
import { USER_REGISTERED_EVENT } from './constants/events.constants';
import { UserRegisteredEvent } from './events/user-registered.event';
import { OtpService } from '../otp/otp.service';
import { UserInfoResponseWithTokensDto } from '../auth/dto/user-info-response-with-Tokens.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => OtpService))
    private readonly otpService: OtpService,
  ) { }

  async register(userRegisterDto: UserRegisterDto) {
    const { identifier, password, identifierType } = userRegisterDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const isUserExist = await this.userRepository.findByIdentifier(identifier);
    if (isUserExist) {
      throw new UnauthorizedException('User already exists');
    }
    const user = await this.userRepository.create({
      identifier,
      identifierType,
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

  async delete(userId: string): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    await this.userRepository.softDelete(userId);
    return { message: 'User deleted successfully' };
  }

  getMe(user: UserInfoResponseWithTokensDto) {
    console.log(user)
    return user;
  }
}
