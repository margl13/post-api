import { PostDto } from '../../blog/dtos/PostDto';

export class UserDto {
  id?: number;
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  posts?: PostDto[];
}

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}
