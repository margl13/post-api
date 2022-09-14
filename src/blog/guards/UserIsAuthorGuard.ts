import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { UsersService } from '../../user/services/UsersService';
import { PostService } from '../services/PostService';
import { PostDto } from '../dtos/PostDto';
import { UserDto } from '../../user/dtos/UserDto';

@Injectable()
export class UserIsAuthorGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private postService: PostService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;

    const postId = Number(params.id);
    const user: UserDto = request.user;

    return this.usersService.findById(user.id).then((user: UserDto) => {
      this.postService.findOne(postId).then((post: PostDto) => {
        let hasPermission = false;

        if (user.id === params.id) {
          hasPermission = true;
        }
        return user && hasPermission;
      });
    });
  }
}
