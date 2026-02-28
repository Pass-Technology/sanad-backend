import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Otp } from './entities/otp.entity';
import { BaseRepository } from '../shared/generics/repository.abstract';

@Injectable()
export class OtpRepository extends BaseRepository<Otp> {
  constructor(
    @InjectRepository(Otp)
    private readonly repository: Repository<Otp>,
  ) {
    super();
  }

  async exists(where: { id?: string }): Promise<boolean> {
    const record = await this.repository.findOne({ where });
    return !!record;
  }

  async create(data: {
    identifier: string;
    otp: string;
    expiresAt: Date;
  }): Promise<Otp> {
    const otp = this.repository.create(data);
    return this.repository.save(otp);
  }

  async findValidOtp(identifier: string, otp: string): Promise<Otp | null> {
    return this.repository.findOne({
      where: {
        identifier,
        otp,
        expiresAt: MoreThan(new Date()),
      },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByIdentifier(identifier: string): Promise<void> {
    await this.repository.delete({ identifier });
  }
}
