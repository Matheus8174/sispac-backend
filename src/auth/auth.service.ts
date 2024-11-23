import { User } from '@/users/entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { Repository } from 'typeorm';

import { AuthenticateUserDto } from './dto/authenticate-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async authenticate({ email, password }: AuthenticateUserDto) {
    const user = await this.repository.findOneBy({ email });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      userEmail: user.email,
      subject: user.id
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken, id: user.id };
  }
}
