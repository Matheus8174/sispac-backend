import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ForumsController } from './forums.controller';

import { ForumsService } from './forums.service';
import { CommentsService } from './comments.service';

import { Tag } from './entities/tag.entity';
import { Forum } from './entities/forum.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Forum, Tag, Comment])],
  controllers: [ForumsController],
  providers: [ForumsService, CommentsService]
})
export class ForumsModule {}
