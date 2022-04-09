import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Request,
    UseGuards,
    Query
} from "@nestjs/common";
import {Observable} from "rxjs";
import {PostService} from "./services/PostService";
import {CreatePostDto} from "./dtos/CreatePostDto";
import {PostDto} from "./dtos/PostDto";
import {EditPostDto} from "./dtos/EditPostDto";
import {JwtAuthGuard} from "../auth/guards/jwt-guard";
import {UserIsAuthorGuard} from "./guards/user-is-author-guard";

export const POSTS_URL = 'http://localhost:3000/api/posts';

@Controller('posts')
export class PostController {

    constructor(private postService: PostService) {
    }
    @Get()
    findPosts(@Query('userId') userId: number): Observable<PostDto[]> {
        if(userId == null) {
            return this.postService.findAll();
        } else {
            return this.postService.findByUserId(userId);
        }
    }

    @Get(':id')
    findOne(@Param('id') id: number): Observable<PostDto> {
        return this.postService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createPostDto: CreatePostDto, @Request() req): Observable<PostDto> {
        const user = req.user;
        return this.postService.create(user, createPostDto);
    }

    @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
    @Put(':id')
    edit(@Param('id') id: number, @Body() editPostDto: EditPostDto): Observable<PostDto> {
        return this.postService.edit(Number(id), editPostDto);
    }


    @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
    @Delete(':id')
    delete(@Param('id') postId: number): Observable<any> {
        return this.postService.delete(postId);
    }

}