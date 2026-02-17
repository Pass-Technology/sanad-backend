import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { RegisterDto } from './dto/register.dto';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const identifier = dto.email ?? dto.mobile!;

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.create({
      email: dto.email,
      mobile: dto.mobile,
      password: hashedPassword,
    });

    // Generate and store OTP for verification (in production, send via SMS/email)
    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await this.userRepository.createOtpVerification({
      userId: user.id,
      identifier,
      otp,
      expiresAt,
    });

    return {
      message: 'Registration successful. Please verify your OTP.',
      userId: user.id,
      // In production, OTP would be sent via SMS/email - for testing we return it
      otp,
    };
  }

  async validateOtp(dto: ValidateOtpDto) {
    const identifier = dto.email ?? dto.mobile!;

    const otpVerification = (await this.userRepository.findValidOtp(
      identifier,
      dto.otp,
    ))!;

    await this.userRepository.markUserVerified(otpVerification.userId);
    await this.userRepository.deleteOtpVerification(otpVerification.id);

    const token = this.generateToken(otpVerification.user);
    return { authToken: token };
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

  private generateOtp(length = 5): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }
}
