import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserDto} from "../dtos/UserDto";
import {Repository} from "typeorm";
import {CreateUserDto} from "../dtos/CreateUserDto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserDto)
        private usersRepository: Repository<UserDto>
    ) {}

    async getByEmail(email: string) {
        const user = await this.usersRepository.findOne({email});
        if (user) {
            return user;
        }
        throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
    }

    async create(userData: CreateUserDto) {
        const newUser = await this.usersRepository.create(userData);
        await this.usersRepository.save(newUser);
        return newUser;
    }
}