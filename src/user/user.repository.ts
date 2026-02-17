import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, OtpVerification } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    email?: string;
    mobile?: string;
    password: string;
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        mobile: data.mobile,
        password: data.password,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByMobile(mobile: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { mobile },
    });
  }

  async findByIdentifier(identifier: string): Promise<User | null> {
    const isEmail = identifier.includes('@');
    if (isEmail) {
      return this.findByEmail(identifier);
    }
    return this.findByMobile(identifier);
  }

  async createOtpVerification(data: {
    userId: string;
    identifier: string;
    otp: string;
    expiresAt: Date;
  }): Promise<OtpVerification> {
    return this.prisma.otpVerification.create({
      data,
    });
  }

  async findValidOtp(
    identifier: string,
    otp: string,
  ): Promise<(OtpVerification & { user: User }) | null> {
    const result = await this.prisma.otpVerification.findFirst({
      where: {
        identifier,
        otp,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
    return result;
  }

  async deleteOtpVerification(id: string): Promise<void> {
    await this.prisma.otpVerification.delete({
      where: { id },
    });
  }

  async markUserVerified(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });
  }
}
