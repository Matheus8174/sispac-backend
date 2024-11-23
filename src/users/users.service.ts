import { User } from '@/users/entities/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.repository.findOneBy({
      email: createUserDto.email
    });

    if (existingUser) throw new BadRequestException('Email already in use');

    const user = this.repository.create(createUserDto);

    const output = await this.repository.save(user);

    return output;
  }

  async findAll() {
    const output = await this.repository.find();

    return output;
  }

  async findOne(id: string) {
    const output = await this.repository.findOneBy({ id });

    delete output.password;

    return output;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.repository.findOneBy({ id });

    if (!user) return;

    this.repository.merge(user, updateUserDto);

    return this.repository.save(user);
  }

  async remove(id: string) {
    const user = await this.repository.findOneBy({ id });

    if (!user) return;

    return this.repository.remove(user);
  }

  async uploadUserAvatar(id: string, avatarUrl: string) {
    const user = await this.repository.findOneBy({ id });

    if (!user) throw new NotFoundException('User does not exists');

    user.avatar = avatarUrl;

    await this.repository.save(user);
  }
}
