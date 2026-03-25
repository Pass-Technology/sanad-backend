import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { OtpEntity } from './entities/otp.entity';
import { BaseRepository } from '../../shared/generics/repository.abstract';
import { OtpPurposeEnum } from './enum/otp-purpose.enum';

@Injectable()
export class OtpRepository extends BaseRepository<OtpEntity> {
  constructor(
    @InjectRepository(OtpEntity)
    private readonly otpRepository: Repository<OtpEntity>,
  ) {
    super();
  }

  async exists(where: { id?: string }): Promise<boolean> {
    const record = await this.otpRepository.findOne({ where });
    return !!record;
  }

  async create(data: {
    identifier: string;
    otp: number;
    expiresAt: Date;
    purpose: OtpPurposeEnum;
    user?: { id: string };
  }): Promise<OtpEntity> {
    const otp = this.otpRepository.create(data);
    return await this.otpRepository.save(otp);
  }

  async findValidOtp(identifier: string, otp: number, purpose?: OtpPurposeEnum): Promise<OtpEntity | null> {
    return await this.otpRepository.findOne({
      where: {
        user: { identifier },
        otp,
        ...(purpose && { purpose }),
        expiresAt: MoreThan(new Date()),
      },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsVerified(id: string): Promise<void> {
    await this.otpRepository.update(id, { isVerified: true });
  }

  async deleteById(id: string): Promise<void> {
    await this.otpRepository.softDelete(id);
  }

  async deleteByIdentifier(identifier: string): Promise<void> {
    const records = await this.otpRepository.find({
      where: { user: { identifier: identifier } },
      select: ['id'],
    });

    if (records.length > 0) {
      await this.otpRepository.softDelete(records.map((r) => r.id));
    }
  }


  async getLastOtpOfUser(userId: string, purpose?: OtpPurposeEnum): Promise<OtpEntity | null> {
    return await this.otpRepository.findOne({
      where: {
        user: { id: userId },
        ...(purpose && { purpose }),
      },
      order: { createdAt: 'DESC' },
    });
  }
}
