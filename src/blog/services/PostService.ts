import { Injectable } from '@nestjs/common';
import { from, Observable, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PostEntity } from '../entities/PostEntity';
import { CreatePostDto } from '../dtos/CreatePostDto';
import { PostDto } from '../dtos/PostDto';
import { EditPostDto } from '../dtos/EditPostDto';
import { UserDto } from '../../user/dtos/UserDto';
import slugify from 'slugify';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  paginateAll(options: IPaginationOptions): Observable<Pagination<PostDto>> {
    return from(
      paginate<PostDto>(this.postRepository, options, {
        relations: ['author'],
      }),
    ).pipe(map((posts: Pagination<PostDto>) => posts));
  }

  paginateByUserId(
    options: IPaginationOptions,
    userId: number,
  ): Observable<Pagination<PostDto>> {
    return from(
      paginate<PostDto>(this.postRepository, options, {
        relations: ['author'],
        where: [{ author: userId }],
      }),
    ).pipe(map((posts: Pagination<PostDto>) => posts));
  }

  public async findOne(id: number): Promise<PostDto> {
    return await this.postRepository.findOne({ id }, { relations: ['author'] });
  }

  public create(
    user: UserDto,
    createPostDto: CreatePostDto,
  ): Observable<PostDto> {
    createPostDto.author = user;
    return this.generateSlug(createPostDto.title).pipe(
      switchMap((slug: string) => {
        createPostDto.slug = slug;
        return this.postRepository.save(createPostDto);
      }),
    );
  }

  generateSlug(title: string): Observable<string> {
    return of(slugify(title));
  }

  public async edit(id: number, editPostDto: EditPostDto): Promise<PostDto> {
    return await this.postRepository
      .update(editPostDto.id, editPostDto)
      .then(() => this.findOne(id));
  }

  public async delete(postId: number): Promise<any> {
    return await this.postRepository.delete(postId);
  }
}
