import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entities/UserEntity";
import {Repository} from "typeorm";
import {UserDto, UserRole} from "../dtos/UserDto";
import {from, Observable, throwError} from "rxjs";
import {catchError, map, switchMap} from "rxjs/operators";
import {AuthService} from "../../auth/services/AuthService";
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private authService: AuthService
    ) {}

    findAll(): Observable<UserEntity[]> {
        return from(this.userRepository.find()).pipe(
            map((users: UserEntity[]) => {
                users.forEach(function (v) {delete v.password});
                return users;
            })
        );
    }

    paginate(options: IPaginationOptions): Observable<Pagination<UserEntity>> {
        return from(paginate<UserEntity>(this.userRepository, options)).pipe(
            map((usersPageable: Pagination<UserEntity>) => {
                usersPageable.items.forEach(function (v) {delete v.password});

                return usersPageable;
            })
        )
    }

    create(user: UserDto): Observable<UserDto> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((hashedPassword: string) => {
                const newUser = new UserEntity();
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.password = hashedPassword;
                newUser.role = UserRole.USER;

                return from(this.userRepository.save(newUser)).pipe(
                    map((user: UserDto) => {
                        const {password, ...result} = user;
                        return result;
                    }),
                    catchError(err => throwError(err))
                )
            })
        )
    }


    public findById(id: number): Observable<UserDto> {
        return from(this.userRepository.findOne({id}, {relations: ['posts']})).pipe(
            map((user: UserDto) => {
                const {password, ...result} = user;
                return result;
            })
        );
    }

    public update(id: number, user: UserDto): Observable<any> {
        delete user.password;
        delete user.email;
        delete user.role;

        return from(this.userRepository.update(id, user));
    }

    updateRoleOfUser(id: number, user: UserDto): Observable<any> {
        return from(this.userRepository.update(id, user));

    }

    public delete(id: number): Observable<any> {
        return from(this.userRepository.delete(id));
    }

    findByMail(email: string): Observable<UserDto> {
        return from(this.userRepository.findOne({email}));
    }

    login(user: UserDto): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user:UserDto) => {
                if(user) {
                    return this.authService.generateToken(user).pipe(map((jwt: string) => jwt));
                } else {
                    return 'Wrong Credentials';
                }
            })
        )
    }

    validateUser(email: string, password: string): Observable<UserDto> {
        return from(this.userRepository.findOne({email}, {select: ['id', 'password', 'username', 'email', 'role']})).pipe(
            switchMap((user: UserDto) => this.authService.comparePasswords(password, user.password).pipe(
                map((match: boolean) => {
                    if(match) {
                        const {password, ...result} = user;
                        return result;
                    } else {
                        throw Error;
                    }
                })
            ))
        )
    }



}