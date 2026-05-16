import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Request } from 'express';
import { UserType } from '../../modules/user/enums/user-type.enum';
import { ProfileStatusStaticCode } from '../../modules/lookups/enums/lookup-static-codes.enum';
import { ProviderProfileEntity } from '../../modules/provider-profile/entities/provider-profile.entity';

@Injectable()
export class VerificationGuard implements CanActivate {
  constructor(private readonly dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as any;

    if (!user) {
      return false;
    }

    // 1. Check if user is OTP verified (always required)
    if (!user.isVerified) {
      throw new ForbiddenException('Please verify your account first to perform this action');
    }

    // 2. Allow all GET requests
    if (request.method === 'GET') {
      return true;
    }

    // 3. Allow profile setup endpoint even if not approved yet
    if (request.method === 'POST' && request.url.includes('/profile/setup')) {
      return true;
    }

    // 4. For Providers, check profile status
    if (user.type === UserType.PROVIDER) {
      const profileRepo = this.dataSource.getRepository(ProviderProfileEntity);
      const profile = await profileRepo.findOne({
        where: { user: { id: user.userId } },
        relations: { status: true },
      });

      // If no profile yet, only allow setup
      if (!profile) {
        if (request.method === 'POST' && request.url.includes('/profile/setup')) {
          return true;
        }
        throw new ForbiddenException('Please complete your profile setup first.');
      }

      // PHASE 1: If profile is NOT approved, allow everything (unrestricted access)
      if (profile.status?.staticCode !== ProfileStatusStaticCode.APPROVED) {
        return true;
      }

      // PHASE 2: If profile IS approved, allow the request to proceed.
      // The Service layer will now decide whether to update directly or stage the change.
      return true;
    }

    return true;
  }
}
