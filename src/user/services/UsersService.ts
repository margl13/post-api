import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  paginate(options: IPaginationOptions): Observable<Pagination<UserEntity>> {
    return from(paginate<UserEntity>(this.userRepository, options)).pipe(
      map((usersPageable: Pagination<UserEntity>) => {
        usersPageable.items.forEach(function (v) {
          delete v.password;
        });

        return usersPageable;
      }),
    );
  }

  async findById(id: number): Promise<UserDto> {
    return await this.userRepository.findOne({ id }, { relations: ['posts'] });
  }

  async create(user: UserDto): Promise<UserDto> {
    const newUser = new UserEntity();
    newUser.username = user.username;
    newUser.email = user.email;
    newUser.password = user.password;
    newUser.role = UserRole.USER;
    return this.userRepository.save(newUser);
  }

  async update(id: number, user: UserDto): Promise<any> {
    return await this.userRepository.update(id, user);
  }

  async updateRoleOfUser(id: number, user: UserDto): Promise<any> {
    return await this.userRepository.update(id, user);
  }

  async delete(id: number): Promise<any> {
    return await this.userRepository.delete(id);
  }
}
