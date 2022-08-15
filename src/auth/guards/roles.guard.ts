import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserDto } from '../../user/dtos/UserDto';
import { UsersService } from '../../user/services/UsersService';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UserDto = request.user;

    return this.usersService.findById(user.id).then((user: UserDto) => {
      const hasRole = () => roles.indexOf(user.role) > -1;
      let hasPermission = false;

      if (hasRole()) {
        hasPermission = true;
      }
      return user && hasPermission;
    });
  }
}
