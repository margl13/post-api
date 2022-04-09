import {IsNotEmpty} from "class-validator";
import {UserDto} from "../../user/dtos/UserDto";

export class CreatePostDto {

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    subTitle: string;

    @IsNotEmpty()
    imageUrl: string;

    @IsNotEmpty()
    content: string;

    author: UserDto
}