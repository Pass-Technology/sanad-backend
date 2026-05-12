import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { OtpRepository } from './otp.repository';
import { SendOtpDto } from './dto/send-otp.dto';
import { AppConfigService } from '../../config/config.service';
import { OtpPurposeEnum } from './enum/otp-purpose.enum';
import { UserRepository } from '../user/user.repository';
import { MailService } from '../mail/mail.service';
import { UserIdentifierType } from '../user/enums/user-identifier-type.enum';

@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly appConfig: AppConfigService,
    @Inject(forwardRef(() => UserRepository))
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
  ) { }

  private getDefaultOtp(): string {
    return this.appConfig.auth.defaultOtp.toString();
  }

  async sendOtp(dto: SendOtpDto): Promise<{ message: string }> {
    const { identifier, purpose } = dto;
    const user = await this.userRepository.findByIdentifier(identifier);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.createOtpForUser(user.id, identifier, purpose);
    return { message: 'OTP sent successfully' };
  }

  async createOtpForUser(
    userId: string,
    identifier: string,
    purpose: OtpPurposeEnum = OtpPurposeEnum.REGISTER,
  ): Promise<{ otp: number }> {
    const defaultOtp = this.getDefaultOtp();
    const otp = Number(defaultOtp) || this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.otpRepository.deleteByIdentifier(identifier);
    await this.otpRepository.create({
      identifier,
      otp,
      expiresAt,
      purpose,
      user: { id: userId },
    });

    await this.sendOtpNotification(identifier, otp, purpose);

    return { otp };
  }

  private async sendOtpNotification(identifier: string, otp: number, purpose: OtpPurposeEnum) {
    const isEmail = identifier.includes('@');
    if (!isEmail) return; // SMS logic can be added here later

    const subject = purpose === OtpPurposeEnum.REGISTER
      ? 'Sanad - Welcome to Sanad App!'
      : 'Sanad - Reset Your Password';

    await this.mailService.sendMail({
      to: identifier,
      subject,
      template: 'otp-arabic',
      context: {
        OTP_CODE: otp.toString(),
        LOGO_URL: 'sanad.png',
      },
    }).catch(err => console.error(`Failed to send ${purpose} email to ${identifier}`, err));
  }

  async validateOtp(identifier: string, otp: number, purpose: OtpPurposeEnum): Promise<void> {
    const defaultOtp = this.getDefaultOtp();

    if (defaultOtp && Number(otp) === Number(defaultOtp)) {
      await this.otpRepository.deleteByIdentifier(identifier);
      return;
    }

    const otpRecord = await this.otpRepository.findValidOtp(identifier, otp);

    if (!otpRecord || otpRecord.purpose !== purpose) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.otpRepository.markAsVerified(otpRecord.id);
  }

  private generateOtp(length = 5): number {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return Number(otp);
  }

  async validateUserOtp(otp: number, userId: string, purpose?: OtpPurposeEnum) {
    const lastOtpOfUser = await this.otpRepository.getLastOtpOfUser(userId, purpose);

    if (!lastOtpOfUser || lastOtpOfUser.isVerified || lastOtpOfUser.otp !== otp || lastOtpOfUser.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    await this.otpRepository.markAsVerified(lastOtpOfUser.id);
    return true;
  }
}
