import {Module} from "@nestjs/common";
import {PostService} from "./services/PostService";
import {PostController} from "./PostController";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PostEntity} from "./entities/PostEntity";

@Module({
    imports:[
        TypeOrmModule.forFeature([PostEntity]),

    ],
    controllers: [
        PostController
    ],
    providers: [
        PostService
    ],
})
export class BlogModule {
}