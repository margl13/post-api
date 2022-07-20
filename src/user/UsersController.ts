import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Pagination } from 'nestjs-typeorm-paginate';

import { UserEntity } from './entities/UserEntity';
import { UsersService } from './services/UsersService';
import { UserDto, UserRole } from './dtos/UserDto';
import { hasRoles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';
import { UserIsUser } from '../auth/guards/userIsUser';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  index(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Observable<Pagination<UserEntity>> {
    limit = limit > 100 ? 100 : limit;
    return this.usersService.paginate({
      page,
      limit,
      route: 'http://localhost:3000/api/users',
    });
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

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }
}
