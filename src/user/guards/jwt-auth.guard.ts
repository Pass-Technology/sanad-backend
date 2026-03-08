import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../../shared/types/jwt-payload.type';

import { AppConfigService } from '../../config/config.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly config: AppConfigService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.config.auth.jwtSecret,
      });
      request.user = {
        userId: payload.sub,
        identifier: payload.identifier,
        identifierType: payload.identifierType,
        isVerified: payload.isVerified,
        isProfileCompleted: payload.isProfileCompleted,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.slice(7);
  }
}
