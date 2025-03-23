import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/users/enum/role.enum';
  import { UsersService } from 'src/users/users.service';
import { ROLES_KEY } from '../decorator/role.decorator';

  @Injectable()
  export class RoleGuard implements CanActivate {
    constructor(
      private reflector: Reflector,
      private usersService: UsersService,
    ) {}
  
    canActivate(context: ExecutionContext): boolean {
      const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (!roles) {
        return true;
      }
  
      const request = context.switchToHttp().getRequest();
      const user = request.user;
  
      if (!user) {
        throw new UnauthorizedException('Unauthorized at role guard');
      }

      // console.log(user);
  
      const hasRole = () => user.roles.some((role: UserRole) => roles.includes(role));
      // console.log(hasRole);
  
      if (!hasRole) {
        throw new ForbiddenException('Insufficient permissions');
      }
  
      return true;
    }
  }