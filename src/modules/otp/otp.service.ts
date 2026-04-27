import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { OtpRepository } from './otp.repository';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { AppConfigService } from '../../config/config.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserInfoResponseWithTokensDto } from '../user/dto/user-info-response.dto';
import { OtpPurposeEnum } from './enum/otp-purpose.enum';
import { OtpEntity } from './entities/otp.entity';
import { AuthService } from '../auth/auth.service';


@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly otpRepository: OtpRepository,
    private readonly appConfig: AppConfigService,
    private readonly authService: AuthService,
  ) { }

  private getDefaultOtp(): string {
    return this.appConfig.auth.defaultOtp.toString();
  }

  async sendOtp(sendOtpDto: SendOtpDto): Promise<{ message: string }> {
    const { identifier, purpose } = sendOtpDto;
    await this.otpRepository.deleteByIdentifier(identifier);
    const user = await this.userRepository.findOne({ where: { identifier } });
    await this.createOtpRecord(identifier, purpose, user?.id);
    return { message: 'OTP sent successfully' };
  }

  async createOtpForUser(
    userId: string,
    identifier: string,
    purpose: OtpPurposeEnum = OtpPurposeEnum.REGISTER,
  ): Promise<{ otp: number }> {
    const { otp } = await this.createOtpRecord(identifier, purpose, userId);
    return { otp };
  }

  private async createOtpRecord(identifier: string, purpose: OtpPurposeEnum, userId?: string): Promise<{ otp: number }> {
    const defaultOtp = this.getDefaultOtp();
    const otp = Number(defaultOtp) || this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await this.otpRepository.create({
      identifier,
      otp,
      expiresAt,
      purpose,
      ...(userId && { user: { id: userId } }),
    });
    return { otp };
  }

  async validateOtp(validateOtpDto: ValidateOtpDto): Promise<UserInfoResponseWithTokensDto> {
    const { identifier, otp } = validateOtpDto;
    const defaultOtp = this.getDefaultOtp();

    const user = await this.userRepository.findOne({ where: { identifier } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (defaultOtp && Number(otp) === Number(defaultOtp)) {
      await this.otpRepository.deleteByIdentifier(identifier);
      await this.userRepository.update(user.id, { isVerified: true });
      return this.generateUserTokens({ ...user, isVerified: true });
    }

    const otpRecord = await this.otpRepository.findValidOtp(identifier, otp);
    if (!otpRecord) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.otpRepository.markAsVerified(otpRecord.id);
    await this.userRepository.update(user.id, { isVerified: true });

    return this.generateUserTokens({ ...user, isVerified: true });
  }

  private async generateUserTokens(user: UserEntity): Promise<UserInfoResponseWithTokensDto> {
    const tokens = await this.authService.generateTokens({
      id: user.id,
      identifier: user.identifier,
      identifierType: user.identifierType,
      isVerified: user.isVerified,
      isProfileCompleted: user.isProfileCompleted,
    });

    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepository.update(user.id, { refreshToken: hashedRefreshToken });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userId: user.id,
      isProfileCompleted: user.isProfileCompleted,
      isVerified: user.isVerified,
      identifier: user.identifier,
      identifierType: user.identifierType,
    };
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

    console.log(lastOtpOfUser)

    if (!lastOtpOfUser) {
      console.log('step 1')
      throw new BadRequestException('Invalid OTP');
    }

    if (lastOtpOfUser.isVerified) {
      console.log('step 2')
      throw new BadRequestException('OTP has already been used');
    }

    if (lastOtpOfUser.otp !== otp) {
      console.log('step 3')
      throw new BadRequestException('Invalid OTP');
    }

    if (lastOtpOfUser.expiresAt < new Date()) {
      console.log('step 4')
      throw new BadRequestException('OTP has expired');
    }

    await this.otpRepository.markAsVerified(lastOtpOfUser.id);

    return true;
  }


  validateUserForgetPasswordOtp(otpRecord: OtpEntity) {
    if (!otpRecord.isVerified) {
      console.log('step 1')
      throw new BadRequestException('OTP is not valid');
    }

    if (otpRecord.expiresAt < new Date()) {
      console.log('step 2')
      throw new BadRequestException('OTP has expired');
    }

    return true;
  }
}
