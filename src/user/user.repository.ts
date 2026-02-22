import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { BaseRepository } from '../shared/generics/repository.abstract';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async exists(where: {
    email?: string;
    mobile?: string;
    id?: string;
  }): Promise<boolean> {
    const user = await this.prisma.user.findFirst({ where });
    return !!user;
  }

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

  async markUserVerified(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}
