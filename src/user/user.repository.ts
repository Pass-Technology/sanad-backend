import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { BaseRepository } from '../shared/generics/repository.abstract';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {
    super();
  }

  async exists(where: {
    email?: string;
    mobile?: string;
    id?: string;
  }): Promise<boolean> {
    const user = await this.repository.findOne({ where });
    return !!user;
  }

  async create(data: {
    email?: string;
    mobile?: string;
    password: string;
  }): Promise<User> {
    const user = this.repository.create({
      email: data.email,
      mobile: data.mobile,
      password: data.password,
    });
    return this.repository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email },
    });
  }

  async findByMobile(mobile: string): Promise<User | null> {
    return this.repository.findOne({
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

  async markUserVerified(userId: string): Promise<User> {
    await this.repository.update(userId, { isVerified: true });
    return (await this.findById(userId))!;
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<User> {
    await this.repository.update(userId, { password: hashedPassword });
    return (await this.findById(userId))!;
  }
}
