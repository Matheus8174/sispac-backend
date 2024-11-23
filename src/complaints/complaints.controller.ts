import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { extname } from 'node:path';
import { diskStorage } from 'multer';

import { CreateComplaintDto } from './dto/create-complaint';
import { ComplaintsService } from './complaints.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CurrentUSerDto } from '@/auth/dto/current-user.dto';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { CurrentUser } from '@/auth/current-user.decorator';

type CreateComplaintControllerDto = Omit<
  CreateComplaintDto,
  'user_id' | 'images'
>;

const FiveMB = 5 * 1024 * 1024;

@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: CurrentUSerDto,
    @Body() createComplaintDto: CreateComplaintControllerDto
  ) {
    return this.complaintsService.create({
      ...createComplaintDto,
      user_id: user.userId,
      images: ['']
    });
  }

  @Get()
  findAll() {
    return this.complaintsService.findAll();
  }

  @Get()
  findByUser(@Query('userId') userId: string) {
    return this.complaintsService.findByUser(userId);
  }

  @Post('/images/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, callback) => {
          const ext = extname(file.originalname);

          const filename = `${crypto.randomUUID()}${ext}`;

          callback(null, filename);
        }
      }),
      limits: { fileSize: FiveMB }
    })
  )
  uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id') complaintId: string
  ) {
    return this.complaintsService.uploadImages(complaintId, files);
  }
}
