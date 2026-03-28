import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { BaseRepository } from '../../shared/generics/repository.abstract';
import { UserIdentifierType } from './enums/user-identifier-type.enum';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super();
  }

  async exists(where: {
    identifier?: string;
    identifierType?: UserIdentifierType;
    id?: string;
  }): Promise<boolean> {
    const user = await this.userRepository.findOne({ where });
    return !!user;
  }

  async create(data: {
    identifier: string;
    identifierType: UserIdentifierType;
    password: string;
  }): Promise<UserEntity> {
    const user = this.userRepository.create({
      identifier: data.identifier,
      identifierType: data.identifierType,
      password: data.password,
    });
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { identifier: email, identifierType: UserIdentifierType.EMAIL },
    });
  }

  async findByMobile(mobile: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { identifier: mobile, identifierType: UserIdentifierType.MOBILE },
    });
  }

  async findByIdentifier(identifier: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { identifier },
    });
  }

  async findUserWithLastOtp(identifier: string) {
    return await this.userRepository.findOne({
      where: { identifier },
      relations: { otps: true },
      order: { otps: { createdAt: 'DESC' } },
    })
  }

  async findUserWithPassword(identifier: string) {
    return await this.userRepository.findOne({
      //       "identifier": "mstwalasss@gmail.com",
      // "identifierType": "email",
      // "isVerified": true,
      // "isProfileCompleted": false
      select: { id: true, identifier: true, identifierType: true, isVerified: true, isProfileCompleted: true, password: true },
      where: { identifier }
    })
  }

  async findUserRefreshTokenByUserId(userId: string) {
    return await this.userRepository.findOne({
      select: { id: true, identifier: true, identifierType: true, isVerified: true, isProfileCompleted: true, refreshToken: true },
      where: { id: userId }
    })
  }

  async markUserVerified(userId: string): Promise<UserEntity> {
    await this.userRepository.update(userId, { isVerified: true });
    return (await this.findById(userId))!;
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<UserEntity> {
    await this.userRepository.update(userId, { password: hashedPassword });
    return (await this.findById(userId))!;
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    await this.userRepository.update(userId, { refreshToken });
  }

  async softDelete(userId: string): Promise<void> {
    await this.userRepository.softDelete(userId);
  }

  async updateProfileCompletionStatus(userId: string, status: boolean, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(UserEntity) : this.userRepository;
    await repo.update(userId, { isProfileCompleted: status });
  }
}

