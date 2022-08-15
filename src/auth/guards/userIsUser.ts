import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';

import { UsersService } from '../../user/services/UsersService';
import { UserDto } from '../../user/dtos/UserDto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UserIsUser implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const user: UserDto = request.user;

    return this.usersService.findById(user.id).then((user: UserDto) => {
      let hasPermission = false;

      if (user.id === params.id) {
        hasPermission = true;
      }
      return user && hasPermission;
    });
  }
}
