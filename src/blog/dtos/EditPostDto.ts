import { UserDto } from '../../user/dtos/UserDto';

export class EditPostDto {
  id?: number;
  title?: string;
  subTitle?: string;
  imageUrl?: string;
  slug?: string;
  content?: string;
  author?: UserDto;
}
