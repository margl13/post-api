import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./entities/UserEntity";
import {UsersService} from './services/UsersService';
import {UsersController} from "./UsersController";
import {AuthModule} from "../auth/AuthModule";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        AuthModule
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {
}