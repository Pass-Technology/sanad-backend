import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { USER_VERIFICATION_REQUESTED_EVENT } from '../user/constants/events.constants';
import { UserVerificationRequestedEvent } from '../user/events/user-verification-requested.event';
import { OtpRepository } from './otp.repository';
import { ValidateOtpDto } from './dto/validate-otp.dto';

@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {}

  private getDefaultOtp(): string | undefined {
    return this.configService.get<string>('DEFAULT_OTP');
  }

  async createOtpForUser(
    _userId: string,
    identifier: string,
  ): Promise<{ otp: string }> {
    const defaultOtp = this.getDefaultOtp();
    const otp = defaultOtp ?? this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await this.otpRepository.create({
      identifier,
      otp,
      expiresAt,
    });
    return { otp };
  }

  async validateOtp(dto: ValidateOtpDto): Promise<{ authToken: string }> {
    const identifier = dto.email ?? dto.mobile!;
    const defaultOtp = this.getDefaultOtp();

    if (defaultOtp && dto.otp === defaultOtp) {
      await this.otpRepository.deleteByIdentifier(identifier);
      const event = new UserVerificationRequestedEvent();
      event.identifier = identifier;
      await this.eventEmitter.emitAsync(
        USER_VERIFICATION_REQUESTED_EVENT,
        event,
      );
      return { authToken: event.authToken! };
    }

    const otpRecord = (await this.otpRepository.findValidOtp(
      identifier,
      dto.otp,
    ))!;

    const event = new UserVerificationRequestedEvent();
    event.identifier = identifier;
    await this.eventEmitter.emitAsync(USER_VERIFICATION_REQUESTED_EVENT, event);

    await this.otpRepository.deleteById(otpRecord.id);

    return { authToken: event.authToken! };
  }

  private generateOtp(length = 5): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }
}
