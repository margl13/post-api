import {UsersService} from "../../user/services/UsersService";
import * as bcrypt from 'bcrypt';

export class AuthService {
    constructor(private readonly usersService: UsersService) {
    }

    public async register(registrationData: RegisterDto) {
        const hashedPassword = await bcrypt.hash(registrationData.password, 10);
        try {
            const createdUser = await this.usersService.create({
                ...registrationData: hashedPassword
            });
        }
    }
}