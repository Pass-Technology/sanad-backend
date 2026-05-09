import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '../../modules/user/enums/user-type.enum';

@Injectable()
export class UserTypeGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredTypes = this.reflector.getAllAndOverride<UserType[]>('userTypes', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredTypes) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user || !requiredTypes.includes(user.type)) {
            throw new ForbiddenException('You do not have permission to access this resource');
        }

        return true;
    }
}