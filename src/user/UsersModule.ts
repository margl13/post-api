import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./entities/UserEntity";
import {UsersService} from "./services/UsersService";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
    ],
    controllers: [],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {
}