import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { from, mergeMap, Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

import { UserEntity } from '../entities/UserEntity';
import { UserDto, UserRole } from '../dtos/UserDto';
import { AuthService } from '../../auth/services/AuthService';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  paginate(options: IPaginationOptions): Observable<Pagination<UserDto>> {
    return from(paginate<UserDto>(this.userRepository, options)).pipe(
      map((usersPageable: Pagination<UserDto>) => {
        usersPageable.items.forEach(function (v) {
          delete v.password;
        });

        return usersPageable;
      }),
    );
  }

  paginateByUsername(
    options: IPaginationOptions,
    user: UserDto,
  ): Observable<Pagination<UserDto>> {
    return from(
      this.userRepository.findAndCount({
        skip: Number(options.page) * Number(options.limit) || 0,
        take: Number(options.limit) || 10,
        order: { id: 'ASC' },
        select: ['id', 'username', 'email', 'role'],
        where: [{ username: Like(`%${user.username}%`) }],
      }),
    ).pipe(
      map(([users, totalUsers]) => {
        console.log(users);
        console.log(options.page);
        const usersPageable: Pagination<UserEntity> = {
          items: users,
          links: {
            first: options.route + `?limit=${options.limit}`,
            previous: options.route + ``,
            next:
              options.route +
              `?limit=${options.limit}&page=${Number(options.page) + 1}`,
            last:
              options.route +
              `?limit=${options.limit}&page=${Math.ceil(
                totalUsers / Number(options.limit),
              )}`,
          },
          meta: {
            currentPage: Number(options.page),
            itemCount: users.length,
            itemsPerPage: Number(options.limit),
            totalItems: totalUsers,
            totalPages: Math.ceil(totalUsers / Number(options.limit)),
          },
        };
        return usersPageable;
      }),
    );
  }

  async findById(id: number): Promise<UserDto> {
    return await this.userRepository
      .findOne({ id }, { relations: ['posts'] })
      .then((user: UserDto) => {
        const { password, ...result } = user;
        return result;
      });
  }

  async create(user: UserDto): Promise<UserDto> {
    const newUser = new UserEntity();
    newUser.username = user.username;
    newUser.email = user.email;
    newUser.password = user.password;
    newUser.role = UserRole.USER;
    newUser.profileImage = user.profileImage;
    return this.userRepository.save(newUser);
  }

  async update(id: number, user: UserDto): Promise<any> {
    delete user.email;
    delete user.password;
    delete user.role;
    return await this.userRepository
      .update(id, user)
      .then(() => this.findById(id));
  }

  async updateRoleOfUser(id: number, user: UserDto): Promise<any> {
    return await this.userRepository.update(id, user);
  }

  async delete(id: number): Promise<any> {
    return await this.userRepository.delete(id);
  }
}
