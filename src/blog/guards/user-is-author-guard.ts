import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {UsersService} from "../../user/services/UsersService";
import {PostService} from "../services/PostService";
import {Observable, switchMap} from "rxjs";
import {UserDto} from "../../user/dtos/UserDto";
import {map} from "rxjs/operators";
import {PostDto} from "../dtos/PostDto";

@Injectable()
export class UserIsAuthorGuard implements CanActivate {
    constructor(private usersService: UsersService,
                private postService: PostService) {
    }

    canActivate(context: ExecutionContext): Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const params = request.params;
        const postId: number = Number(params.id);
        const user: UserDto = request.user;

        return this.usersService.findById(user.id).pipe(
           switchMap((user:UserDto) => this.postService.findOne(postId).pipe(
               map((postDto: PostDto) => {
                   let hasPermission = false;

                   if(user.id === postDto.author.id) {
                       hasPermission = true;
                   }

                   return user && hasPermission;
               })
           ))
        )
    }
}