import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { OtpEntity } from './entities/otp.entity';
import { BaseRepository } from '../../shared/generics/repository.abstract';

@Injectable()
export class OtpRepository extends BaseRepository<OtpEntity> {
  constructor(
    @InjectRepository(OtpEntity)
    private readonly repository: Repository<OtpEntity>,
  ) {
    super();
  }

  async exists(where: { id?: string }): Promise<boolean> {
    const record = await this.repository.findOne({ where });
    return !!record;
  }

  async create(data: {
    identifier: string;
    otp: number;
    expiresAt: Date;
    user?: { id: string };
  }): Promise<OtpEntity> {
    const otp = this.repository.create(data);
    return await this.repository.save(otp);
  }

  async findValidOtp(identifier: string, otp: number): Promise<OtpEntity | null> {
    return await this.repository.findOne({
      where: {
        user: { identifier },
        otp,
        // otpPurpose,
        expiresAt: MoreThan(new Date()),
      },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsVerified(id: string): Promise<void> {
    await this.repository.update(id, { isVerified: true });
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async deleteByIdentifier(identifier: string): Promise<void> {
    await this.repository.softDelete({ user: { identifier } });
  }


  async getLastOtpOfUser(userId: string): Promise<OtpEntity | null> {
    return await this.repository.findOne({
      where: {
        user: { id: userId },
      },
      order: { createdAt: 'DESC' },
    });
  }
}
