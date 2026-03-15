import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { BaseRepository } from '../../shared/generics/repository.abstract';
import { UserIdentifierType } from './enums/user-identifier-type.enum';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
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
  }): Promise<UserEntity> {
    const user = this.repository.create({
      identifier: data.identifier,
      identifierType: data.identifierType,
      password: data.password,
    });
    return this.repository.save(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({
      where: { identifier: email, identifierType: UserIdentifierType.EMAIL },
    });
  }

  async findByMobile(mobile: string): Promise<UserEntity | null> {
    return this.repository.findOne({
      where: { identifier: mobile, identifierType: UserIdentifierType.MOBILE },
    });
  }

  async findByIdentifier(identifier: string): Promise<UserEntity | null> {
    return await this.repository.findOne({
      where: { identifier },
    });
  }

  async findUserWithPassword(identifier: string) {
    return await this.repository.findOne({
      select: { id: true, identifier: true, isVerified: true, password: true },
      where: { identifier }
    })
  }

  async findUserRefreshTokenByUserId(userId: string) {
    return await this.repository.findOne({
      select: { id: true, identifier: true, isVerified: true, password: true, refreshToken: true },
      where: { id: userId }
    })
  }

  async markUserVerified(userId: string): Promise<UserEntity> {
    await this.repository.update(userId, { isVerified: true });
    return (await this.findById(userId))!;
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<UserEntity> {
    await this.repository.update(userId, { password: hashedPassword });
    return (await this.findById(userId))!;
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    await this.repository.update(userId, { refreshToken });
  }

  async softDelete(userId: string): Promise<void> {
    await this.repository.softDelete(userId);
  }
}

