import {CanActivate, ExecutionContext, forwardRef, Inject, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {UsersService} from "../../user/services/UsersService";
import {Observable} from "rxjs";
import {UserDto} from "../../user/dtos/UserDto";
import {map} from "rxjs/operators";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private  reflector: Reflector,
                @Inject(forwardRef(() => UsersService))
                private usersService: UsersService
                ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> |Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if(!roles) {
            return true;
        }

        const reguest = context.switchToHttp().getRequest();
        const user: UserDto = reguest.user;

        return this.usersService.findById(user.id).pipe(
            map((user: UserDto) => {
                const hasRole = () => roles.indexOf(user.role) > -1;
                let hasPermission: boolean = false;

                if(hasRole()) {
                    hasPermission = true
                };
                return user && hasPermission;
            })
        )
    }
}