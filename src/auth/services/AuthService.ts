import { forwardRef, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../../user/services/UsersService';
import { UserDto } from '../../user/dtos/UserDto';
import { AuthLoginDto } from '../dto/AuthLoginDto';
import { UserEntity } from '../../user/entities/UserEntity';

export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  comparePasswords(newPassword: string, hashPassword: string): Promise<any> {
    return bcrypt.compare(newPassword, hashPassword);
  }

  public async validateUser(auth: AuthLoginDto): Promise<UserDto> {
    const { email, password } = auth;
    const user = await this.userRepository.findOne(
      { email },
      { select: ['id', 'password', 'username', 'email', 'role'] },
    );
    const match = this.comparePasswords(password, user.password);
    if (match) {
      const { password, ...result } = user;
      return result;
    } else {
      throw Error;
    }
  }

  generateJWT(user: UserDto): Promise<string> {
    return this.jwtService.signAsync({ user });
  }

  async login(auth: AuthLoginDto): Promise<string> {
    const user = await this.validateUser(auth);
    if (user) {
      return this.generateJWT(user).then((jwt: string) => jwt);
    } else {
      return 'Wrong Credentials';
    }
  }
}
