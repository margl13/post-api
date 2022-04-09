import { Injectable } from "@nestjs/common";
import {UserDto} from "../../user/dtos/UserDto";
import {JwtService} from "@nestjs/jwt";
import {from, Observable} from "rxjs";
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    generateToken(user: UserDto): Observable<string> {
        return from(this.jwtService.signAsync({user}))
    }

    hashPassword(password: string): Observable<string> {
        return from<string>(bcrypt.hash(password, 12))
    }

    comparePasswords(newPassword: string, hashedPassword: string): Observable<any | boolean> {
        return from<any | boolean>(bcrypt.compare(newPassword, hashedPassword));
    }






}
