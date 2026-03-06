import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { BaseRepository } from '../shared/generics/repository.abstract';
import { UserIdentifierType } from './enums/user-identifier-type.enum';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {
    super();
  }

  async exists(where: {
    identifier?: string;
    identifierType?: UserIdentifierType;
    id?: string;
  }): Promise<boolean> {
    const user = await this.repository.findOne({ where });
    return !!user;
  }

  async create(data: {
    identifier: string;
    identifierType: UserIdentifierType;
    password: string;
  }): Promise<User> {
    const user = this.repository.create({
      identifier: data.identifier,
      identifierType: data.identifierType,
      password: data.password,
    });
    return this.repository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { identifier: email, identifierType: UserIdentifierType.EMAIL },
    });
  }

  async findByMobile(mobile: string): Promise<User | null> {
    return this.repository.findOne({
      where: { identifier: mobile, identifierType: UserIdentifierType.MOBILE },
    });
  }

  async findByIdentifier(identifier: string): Promise<User | null> {
    return this.repository.findOne({
      where: { identifier },
    });
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

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    await this.repository.update(userId, { refreshToken });
  }
}

