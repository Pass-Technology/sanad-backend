import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Otp } from '@prisma/client';
import { BaseRepository } from '../shared/generics/repository.abstract';

@Injectable()
export class OtpRepository extends BaseRepository<Otp> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async exists(where: { id?: string }): Promise<boolean> {
    const record = await this.prisma.otp.findFirst({ where });
    return !!record;
  }

  async create(data: {
    identifier: string;
    otp: string;
    expiresAt: Date;
  }): Promise<Otp> {
    return this.prisma.otp.create({
      data,
    });
  }

  async findValidOtp(identifier: string, otp: string): Promise<Otp | null> {
    return this.prisma.otp.findFirst({
      where: {
        identifier,
        otp,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.otp.delete({
      where: { id },
    });
  }

  async deleteByIdentifier(identifier: string): Promise<void> {
    await this.prisma.otp.deleteMany({
      where: { identifier },
    });
  }
}
