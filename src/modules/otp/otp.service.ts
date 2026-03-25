import { BadRequestException, Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpRepository } from './otp.repository';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { AppConfigService } from '../../config/config.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';
import { UserService } from '../user/user.service';


@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly otpRepository: OtpRepository,
    private readonly appConfig: AppConfigService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) { }

  private getDefaultOtp(): string {
    return this.appConfig.auth.defaultOtp.toString();
  }

  async sendOtp(sendOtpDto: SendOtpDto): Promise<{ message: string }> {
    const { identifier } = sendOtpDto;
    await this.otpRepository.deleteByIdentifier(identifier);
    const user = await this.userRepository.findOne({ where: { identifier } });
    await this.createOtpRecord(identifier, user?.id);
    return { message: 'OTP sent successfully' };
  }

  async createOtpForUser(
    userId: string,
    identifier: string,
  ): Promise<{ otp: number }> {
    const { otp } = await this.createOtpRecord(identifier, userId);
    return { otp };
  }

  private async createOtpRecord(identifier: string, userId?: string): Promise<{ otp: number }> {
    const defaultOtp = this.getDefaultOtp();
    const otp = Number(defaultOtp) ?? this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await this.otpRepository.create({
      identifier,
      otp,
      expiresAt,
      ...(userId && { user: { id: userId } }),
    });
    return { otp };
  }

  async validateOtp(validateOtpDto: ValidateOtpDto): Promise<UserInfoResponseWithTokensDto> {

    const { identifier, otp } = validateOtpDto;
    const defaultOtp = this.getDefaultOtp();

    if (defaultOtp && Number(otp) === Number(defaultOtp)) {
      await this.otpRepository.deleteByIdentifier(identifier);

      const user = await this.userRepository.findOne({ where: { identifier } });
      if (user) {
        await this.userRepository.update(user.id, { isVerified: true });
      }

      return await this.userService.getUserInfoWithTokensByIdentifier(identifier);
    }

    const otpRecord = await this.otpRepository.findValidOtp(
      identifier,
      otp
    );

    if (!otpRecord) {
      throw new BadRequestException('Invalid OTP');
    }


    await this.otpRepository.markAsVerified(otpRecord.id);

    const user = await this.userRepository.findOne({ where: { identifier } });
    if (user) {
      await this.userRepository.update(user.id, { isVerified: true });
    }

    return await this.userService.getUserInfoWithTokensByIdentifier(identifier);
  }

  private generateOtp(length = 5): number {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return Number(otp);
  }


  async validateUserOtp(otp: number, userId: string) {

    const lastOtpOfUser = await this.otpRepository.getLastOtpOfUser(userId);

    if (!lastOtpOfUser) {
      throw new BadRequestException('Invalid OTP');
    }

    if (lastOtpOfUser.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (lastOtpOfUser.expiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    await this.otpRepository.markAsVerified(lastOtpOfUser.id);

    return true;
  }
}
