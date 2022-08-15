import { PostDto } from '../../blog/dtos/PostDto';

export class UserDto {
  id?: number;
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  profileImage?: string;
  posts?: PostDto[];
}

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}
