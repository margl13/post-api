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

  @UseGuards(JwtAuthGuard)
  @Post('image/upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file, @Request() req): Promise<Image> {
    return file;
  }

  @Get('image/:imagename')
  findImage(@Param('imagename') imagename, @Res() res): Promise<Object> {
    return res.sendFile(join(process.cwd(), 'uploads/imageUrls/' + imagename));
  }
}
