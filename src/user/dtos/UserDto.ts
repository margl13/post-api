import {PostEntity} from "../../blog/entities/PostEntity";

export class UserDto {
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    posts?: PostEntity[];
}

export enum UserRole {
    ADMIN = 'admin',
    CHIEFEDITOR = 'chiefeditor',
    EDITOR = 'editor',
    USER = 'user'
}