import {IsNotEmpty} from "class-validator";
import {UserDto} from "../../user/dtos/UserDto";

export class PostDto {
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    subTitle: string;

    @IsNotEmpty()
    imageUrl: string;

    @IsNotEmpty()
    content: string;

    author: UserDto;
}