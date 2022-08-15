import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  Res,
} from '@nestjs/common';
import { mergeMap, Observable, of, tap } from 'rxjs';
import { Pagination } from 'nestjs-typeorm-paginate';

import { UsersService } from './services/UsersService';
import { UserDto, UserRole } from './dtos/UserDto';
import { hasRoles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';
import { UserIsUser } from '../auth/guards/userIsUser';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
import { Image } from '../blog/entities/imageInterface';
import { map } from 'rxjs/operators';

export const storage = {
  storage: diskStorage({
    destination: './uploads/profileImages',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  index(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('username') username: string,
  ): Observable<Pagination<UserDto>> {
    limit = limit > 100 ? 100 : limit;

    if (username === null || username === undefined) {
      return this.usersService.paginate({
        page: Number(page),
        limit: Number(limit),
        route: 'http://localhost:3000/api/users',
      });
    } else {
      return this.usersService.paginateByUsername(
        {
          page: Number(page),
          limit: Number(limit),
          route: 'http://localhost:3000/api/users',
        },
        { username },
      );
    }
  }

  @Post()
  create(@Body() user: UserDto) {
    return this.usersService.create(user);
  }

  @Get(':id')
  findBYId(@Param() params): Promise<UserDto> {
    return this.usersService.findById(params.id);
  }

  @UseGuards(JwtAuthGuard, UserIsUser)
  @Put(':id')
  update(@Param('id') id: number, @Body() user: UserDto): Promise<UserDto> {
    return this.usersService.update(id, user);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/role')
  updateRoleOfUser(
    @Param('id') id: number,
    @Body() user: UserDto,
  ): Promise<UserDto> {
    return this.usersService.updateRoleOfUser(id, user);
  }

  //@hasRoles(UserRole.ADMIN)
  //@UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file, @Request() req): Promise<Image> {
    return file;
  }

  @Get('profile-image/:imagename')
  findProfileImage(@Param('imagename') imagename, @Res() res): Promise<Object> {
    return res.sendFile(
      join(process.cwd(), 'uploads/profileImages/' + imagename),
    );
  }
}
