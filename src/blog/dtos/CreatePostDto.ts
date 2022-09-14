import { UserDto } from '../../user/dtos/UserDto';

export class CreatePostDto {
  title?: string;
  subTitle?: string;
  imageUrl?: string;
  slug?: string;
  content?: string;
  author?: UserDto;
}
