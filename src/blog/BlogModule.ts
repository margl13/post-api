import {Module} from "@nestjs/common";
import {PostService} from "./services/PostService";
import {PostController} from "./PostController";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PostEntity} from "./entities/PostEntity";
import {UsersModule} from "../user/UsersModule";
import {AuthModule} from "../auth/AuthModule";



@Module({
    imports:[
        UsersModule,
        TypeOrmModule.forFeature([PostEntity]),
        AuthModule
    ],
    controllers: [PostController],
    providers: [PostService],
})
export class BlogModule {
}