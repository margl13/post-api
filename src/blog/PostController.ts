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
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';

import { PostService } from './services/PostService';
import { CreatePostDto } from './dtos/CreatePostDto';
import { PostDto } from './dtos/PostDto';
import { EditPostDto } from './dtos/EditPostDto';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { Image } from './entities/imageInterface';
import { join } from 'path';
import { UserIsAuthorGuard } from './guards/UserIsAuthorGuard';

export const storage = {
  storage: diskStorage({
    destination: './uploads/imageUrls',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

export const POSTS_URL = 'http://localhost:3000/api/posts';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get('')
  index(@Query('page') page = 1, @Query('limit') limit = 10) {
    limit = limit > 100 ? 100 : limit;
    return this.postService.paginateAll({
      page: Number(page),
      limit: Number(limit),
      route: POSTS_URL,
    });
  }

  @Get('user/:user')
  indexByUser(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('user') userId: number,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.postService.paginateByUserId(
      {
        page: Number(page),
        limit: Number(limit),
        route: POSTS_URL,
      },
      userId,
    );
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
  ): Observable<PostDto> {
    const user = req.user;
    return this.postService.create(user, createPostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async edit(
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

  @UseGuards(JwtAuthGuard)
  @Post('image/upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file, @Request() req): Promise<Image> {
    return file;
  }

  @Get('image/:imagename')
  findImage(@Param('imagename') imagename, @Res() res): Promise<Image> {
    return res.sendFile(join(process.cwd(), 'uploads/imageUrls/' + imagename));
  }
}
