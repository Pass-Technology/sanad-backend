import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OtpRepository } from './otp.repository';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { AppConfigService } from '../../config/config.service';

@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly appConfig: AppConfigService,
  ) { }

  private getDefaultOtp(): string {
    return this.appConfig.auth.defaultOtp.toString();
  }

  async sendOtp(sendOtpDto: SendOtpDto): Promise<{ message: string }> {
    const { identifier } = sendOtpDto;
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

  async validateOtp(validateOtpDto: ValidateOtpDto) {

    const { identifier, otp } = validateOtpDto;
    const defaultOtp = this.getDefaultOtp();

    if (defaultOtp && otp === defaultOtp) {
      return "you have been verified";
      // await this.otpRepository.deleteByIdentifier(identifier);
      // const event = new UserVerificationRequestedEvent();
      // event.identifier = identifier;
      // await this.eventEmitter.emitAsync(
      //   USER_VERIFICATION_REQUESTED_EVENT,
      //   event,
      // );
      // return event.tokens!;
    }

    const otpRecord = await this.otpRepository.findValidOtp(
      identifier,
      validateOtpDto.otp,
    );

    if (!otpRecord) {
      throw new BadRequestException('Invalid OTP');
    }

    // const event = new UserVerificationRequestedEvent();
    // event.identifier = identifier;
    // await this.eventEmitter.emitAsync(USER_VERIFICATION_REQUESTED_EVENT, event);

    // await this.otpRepository.deleteById(otpRecord.id);

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
