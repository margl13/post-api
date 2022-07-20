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
  Query,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { PostService } from './services/PostService';
import { CreatePostDto } from './dtos/CreatePostDto';
import { PostDto } from './dtos/PostDto';
import { EditPostDto } from './dtos/EditPostDto';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  findPosts(@Query('userId') userId: number): Observable<PostDto[]> {
    if (userId == null) {
      return this.postService.findAll();
    } else {
      return this.postService.findByUserId(userId);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<PostDto> {
    return this.postService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @Request() req,
  ): Promise<PostDto> {
    const user = req.user;
    return this.postService.create(user, createPostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  edit(
    @Param('id') id: number,
    @Body() editPostDto: EditPostDto,
  ): Promise<PostDto> {
    return this.postService.edit(Number(id), editPostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') postId: number) {
    return this.postService.delete(postId);
  }
}
