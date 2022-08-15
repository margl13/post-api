import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { UsersService } from '../../user/services/UsersService';
import { PostService } from '../services/PostService';
import { PostDto } from '../dtos/PostDto';

@Injectable()
export class UserIsAuthorGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private postService: PostService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const params = request.params;

    if (request?.user) {
      const { id } = request.user;
      const postId = Number(params.id);
      const user = await this.usersService.findById(id);
      return this.postService.findOne(postId).then((post: PostDto) => {
        let hasPermission = false;

        if (user.id === post.author.id) {
          hasPermission = true;
        }

        return user && hasPermission;
      });
    }
  }
}
