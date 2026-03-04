import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { USER_VERIFICATION_REQUESTED_EVENT } from '../user/constants/events.constants';
import { UserVerificationRequestedEvent } from '../user/events/user-verification-requested.event';
import { OtpRepository } from './otp.repository';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { AuthTokenResponseDto } from '../user/dto/auth-token-response.dto';


import { AppConfigService } from '../config/config.service';

@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly appConfig: AppConfigService,
  ) { }

  private getDefaultOtp(): string | undefined {
    return this.appConfig.auth.defaultOtp?.toString();
  }

  async sendOtp(dto: SendOtpDto): Promise<{ message: string }> {
    const identifier = dto.email ?? dto.mobile!;
    await this.otpRepository.deleteByIdentifier(identifier);
    await this.createOtpRecord(identifier);
    return { message: 'OTP sent successfully' };
  }

  async createOtpForUser(
    _userId: string,
    identifier: string,
  ): Promise<{ otp: string }> {
    const { otp } = await this.createOtpRecord(identifier);
    return { otp };
  }

  private async createOtpRecord(identifier: string): Promise<{ otp: string }> {
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

  async validateOtp(dto: ValidateOtpDto): Promise<AuthTokenResponseDto> {

    const { email, mobile, otp } = dto;

    const identifier = email ?? mobile!;
    const defaultOtp = this.getDefaultOtp();

    if (defaultOtp && otp === defaultOtp) {
      await this.otpRepository.deleteByIdentifier(identifier);
      const event = new UserVerificationRequestedEvent();
      event.identifier = identifier;
      await this.eventEmitter.emitAsync(
        USER_VERIFICATION_REQUESTED_EVENT,
        event,
      );
      return event.tokens!;
    }

    const otpRecord = (await this.otpRepository.findValidOtp(
      identifier,
      dto.otp,
    ))!;

    const event = new UserVerificationRequestedEvent();
    event.identifier = identifier;
    await this.eventEmitter.emitAsync(USER_VERIFICATION_REQUESTED_EVENT, event);

    await this.otpRepository.deleteById(otpRecord.id);

    return event.tokens!;
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
