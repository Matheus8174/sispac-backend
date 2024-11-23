import { Injectable, NotFoundException } from '@nestjs/common';

import { join, extname } from 'node:path';
import { existsSync } from 'node:fs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  getFile(filename: string) {
    const filePath = join(__dirname, '..', '..', 'uploads', filename);

    const filePathWithExt = filePath.replace(extname(filePath), '') + '.jpg';

    if (!existsSync(filePathWithExt))
      throw new NotFoundException('file not found');

    return filePath;
  }

  async getUserAvatar(userId: string) {
    const user = await this.repository.findOneBy({ id: userId });

    const filePath = join(__dirname, '..', '..', 'uploads', user.avatar ?? '');

    if (!existsSync(filePath)) throw new NotFoundException('file not found');

    return filePath;
  }
}
