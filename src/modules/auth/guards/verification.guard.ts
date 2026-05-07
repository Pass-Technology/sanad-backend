import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class VerificationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as any;

    // Allow all GET requests
    if (request.method === 'GET') {
      return true;
    }

    // For non-GET requests, check if user is verified
    if (user && user.isVerified) {
      return true;
    }

    throw new ForbiddenException('Please verify your account first to perform this action');
  }
}
