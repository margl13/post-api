import {CanActivate, ExecutionContext, forwardRef, Inject, Injectable} from "@nestjs/common";
import {Observable} from "rxjs";
import {UsersService} from "../../user/services/UsersService";
import {UserDto} from "../../user/dtos/UserDto";
import {map} from "rxjs/operators";

@Injectable()
export class UserIsUser implements CanActivate {

    constructor(
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService) { }

    canActivate(context:ExecutionContext): boolean | Promise<boolean> | Observable<boolean>  {
        const request = context.switchToHttp().getRequest();
        const params = request.params;
        const user: UserDto = request.user;

        return this.usersService.findById(user.id).pipe(
            map((user: UserDto) => {
                let hasPermission = false;

                if(user.id === Number(params.id)) {
                    hasPermission = true;
                }

                return user && hasPermission;
            })
        )

        return true;
    }
}