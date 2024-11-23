import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';

import { CurrentUser } from '@/auth/current-user.decorator';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { CurrentUSerDto } from '@/auth/dto/current-user.dto';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'node:path';
import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';

const FiveMB = 5 * 1024 * 1024;

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename: async (req, file, callback) => {
          const user = req.user as CurrentUSerDto;

          if (!user.userId)
            return callback(new Error('User do not authenticated'), null);

          const ext = extname(file.originalname);

          const filename = `${user.userId}${ext}`;

          const uploadFolderPath = join(__dirname, '..', '..', 'uploads');

          const userAlreadyHaveAvatar = join(uploadFolderPath, user.userId);

          if (existsSync(userAlreadyHaveAvatar)) {
            await rm(userAlreadyHaveAvatar, { maxRetries: 3 });
          }

          callback(null, filename);
        }
      }),
      limits: { fileSize: FiveMB }
    })
  )
  uploadUserAvatar(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: CurrentUSerDto
  ) {
    return this.usersService.uploadUserAvatar(user.userId, file.filename);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);

    if (!user) throw new NotFoundException();

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('authenticated')
  async findOneAuthenticated(@CurrentUser() user: CurrentUSerDto) {
    const userFinded = await this.usersService.findOne(user.userId);

    if (!userFinded) throw new NotFoundException();

    return userFinded;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);

    if (!user) throw new NotFoundException();

    return user;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const user = await this.usersService.remove(id);

    if (!user) throw new NotFoundException();
  }
}
