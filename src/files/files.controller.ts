import { Response } from 'express';
import { Controller, Get, Param, Patch, Res, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { FilesService } from './files.service';
import { CurrentUSerDto } from '@/auth/dto/current-user.dto';
import { CurrentUser } from '@/auth/current-user.decorator';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('avatar')
  @UseGuards(JwtAuthGuard)
  async getUserAvatar(
    @CurrentUser() user: CurrentUSerDto,
    @Res() res: Response
  ) {
    const filePath = await this.filesService.getUserAvatar(user.userId);

    return res.sendFile(filePath);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = this.filesService.getFile(filename);

    return res.sendFile(filePath);
  }
}
