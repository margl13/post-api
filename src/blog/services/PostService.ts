import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {from, Observable, switchMap} from "rxjs";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from 'typeorm'
import {PostEntity} from "../entities/PostEntity";
import {CreatePostDto} from "../dtos/CreatePostDto";
import {PostDto} from "../dtos/PostDto";
import * as _ from 'lodash';
import {map} from 'rxjs/operators';
import {EditPostDto} from "../dtos/EditPostDto";
import {UsersService} from "../../user/services/UsersService";
import {UserDto} from "../../user/dtos/UserDto";




@Injectable()
export class PostService {
    constructor(@InjectRepository(PostEntity)
                private readonly postRepository: Repository<PostEntity>,
                private readonly usersService: UsersService) {}


    public findAll(): Observable<PostEntity[]> {
        return from(this.postRepository.find({relations: ['author']}))
            .pipe(
                map((posts) => _.orderBy(posts, ['id'], ['desc'])),
            );
    }



    public findByUserId(userId: number): Observable<PostDto[]> {
        return from(this.postRepository.find({
            where: {
                author: userId
            },
            relations: ['author']
        })).pipe(map((posts: PostDto[]) => posts))
    }

    public findOne(id: number): Observable<PostDto> {
        return from(this.postRepository.findOne({id},{relations: ['author']}));
    }

    public create(user: UserDto, createPostDto: CreatePostDto): Observable<PostDto> {
        createPostDto.author = user;
        return from(this.postRepository.save(createPostDto));
    }

    public edit(id: number, editPostDto: EditPostDto): Observable<PostDto> {
        return from(this.postRepository.update(id, editPostDto)).pipe(
            switchMap(() => this.findOne(id))
        );
    }

    public delete(postId: number): Observable<any> {
        return from(this.postRepository.delete(postId));
    }
}
