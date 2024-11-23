import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { CreateForumDto } from './dto/create-forum.dto';
import { ForumsService } from './forums.service';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { CurrentUser } from '@/auth/current-user.decorator';
import { CurrentUSerDto } from '@/auth/dto/current-user.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsService } from './comments.service';

@Controller('forums')
export class ForumsController {
  constructor(
    private readonly forumsService: ForumsService,
    private readonly commentsService: CommentsService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createForumDto: Omit<CreateForumDto, 'userId'>,
    @CurrentUser() user: CurrentUSerDto
  ) {
    return this.forumsService.create({
      ...createForumDto,
      userId: user.userId
    });
  }

  @Get()
  findAll() {
    return this.forumsService.findAll();
  }

  @Get('tags')
  findByTags(@Query('tags') tags: string) {
    return this.forumsService.findByTags(tags.split(','));
  }

  @Get('citys/:id')
  findByCity(@Param('id') city: string) {
    return this.forumsService.findByCity(city);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.forumsService.findOne(id);
  }

  @Post('/comments')
  @UseGuards(JwtAuthGuard)
  createComment(
    @Body() createCommentDto: Omit<CreateCommentDto, 'userId'>,
    @CurrentUser() user: CurrentUSerDto
  ) {
    return this.commentsService.create({
      ...createCommentDto,
      userId: user.userId
    });
  }

  @Get(':id/comments')
  findCommentsByForum(@Param('id') id: string) {
    return this.commentsService.findByForum(id);
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  removeComment(@Param('id') id: string, @CurrentUser() user: CurrentUSerDto) {
    return this.commentsService.remove(Number(id), user.userId);
  }

  // @Get('/tags')
  // findAllTags() {
  //   return this.forumsService.findAllTags();
  // }
}
