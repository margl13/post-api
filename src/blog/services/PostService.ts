import { Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as _ from 'lodash';

import { PostEntity } from '../entities/PostEntity';
import { CreatePostDto } from '../dtos/CreatePostDto';
import { PostDto } from '../dtos/PostDto';
import { EditPostDto } from '../dtos/EditPostDto';
import { UserDto } from '../../user/dtos/UserDto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  public findAll(): Observable<PostEntity[]> {
    return from(this.postRepository.find({ relations: ['author'] })).pipe(
      map((posts) => _.orderBy(posts, ['id'], ['desc'])),
    );
  }

  public async findOne(id: number): Promise<PostDto> {
    return await this.postRepository.findOne({ id }, { relations: ['author'] });
  }

  public findByUserId(userId: number): Observable<PostDto[]> {
    return from(
      this.postRepository.find({
        where: {
          author: userId,
        },
        relations: ['author'],
      }),
    ).pipe(map((posts: PostDto[]) => posts));
  }

  public async create(
    user: UserDto,
    createPostDto: CreatePostDto,
  ): Promise<PostDto> {
    createPostDto.author = user;
    return await this.postRepository.save(createPostDto);
  }

  public async edit(id: number, editPostDto: EditPostDto): Promise<PostDto> {
    return await this.postRepository
      .update(id, editPostDto)
      .then(() => this.findOne(id));
  }

  public async delete(postId: number): Promise<any> {
    return await this.postRepository.delete(postId);
  }
}
