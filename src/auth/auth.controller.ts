import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  authenticate(@Body() authenticateUserDto: AuthenticateUserDto) {
    return this.authService.authenticate(authenticateUserDto);
  }
}
