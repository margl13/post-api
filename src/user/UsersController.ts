import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from "@nestjs/common";
import {UsersService} from "./services/UsersService";
import { Observable, of} from "rxjs";
import {UserEntity} from "./entities/UserEntity";
import {UserDto, UserRole} from "./dtos/UserDto";
import {catchError,map} from "rxjs/operators";
import {hasRoles} from "../auth/decorators/roles.decorator";
import {JwtAuthGuard} from "../auth/guards/jwt-guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Pagination} from "nestjs-typeorm-paginate";
import {UserIsUser} from "../auth/guards/userIsUser";



@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}


    @Get()
    index(
        @Query('page') page: number =1,
        @Query('limit') limit: number = 10): Observable<Pagination<UserEntity>> {
        limit = limit > 100 ? 100 : limit;
        return this.usersService.paginate({page, limit, route: 'http://localhost:3000/api/users'});
    }

    @Post()
    create(@Body() user: UserDto): Observable<UserDto | Object> {
        return this.usersService.create(user).pipe(
            map((user: UserDto) => user),
            catchError(err => of({error: err.massage}))
        );
    }

    @Post('login')
    login(@Body() user: UserDto): Observable<any> {
        return this.usersService.login(user).pipe(
            map((jwt: string) => {
                return { access_token: jwt };
            })
        )
    }

    @Get(':id')
    findBYId(@Param()params): Observable<UserDto> {
        return this.usersService.findById(params.id);
    }

    @UseGuards(JwtAuthGuard, UserIsUser)
    @Put(':id')
    update(@Param('id')id: string, @Body() user: UserDto): Observable<any> {
        return this.usersService.update(Number(id),user);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id/role')
    updateRoleOfUser(@Param('id') id: string, @Body() user: UserDto): Observable<UserDto> {
        return this.usersService.updateRoleOfUser(Number(id), user);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    delete(@Param('id') id: string): Observable<any> {
        return this.usersService.delete(Number(id));
    }
}