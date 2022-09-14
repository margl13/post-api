import { UserDto } from '../../user/dtos/UserDto';

export class PostDto {
  id?: number;
  title?: string;
  subTitle?: string;
  imageUrl?: string;
  slug?: string;
  content?: string;
  author?: UserDto;
}
