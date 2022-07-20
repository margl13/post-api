import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './services/AuthService';
import { AuthLoginDto } from './dto/AuthLoginDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() auth: AuthLoginDto) {
    return this.authService.login(auth).then((jwt: string) => {
      return { access_token: jwt };
    });
  }
}
