import { Repository } from 'typeorm';

import { Comment } from './entities/comment.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly repository: Repository<Comment>
  ) {}

  async create({ content, forumId, userId }: CreateCommentDto) {
    const comment = this.repository.create({
      content,
      owner: { id: userId },
      forum: { id: forumId }
    });

    await this.repository.save(comment);

    return comment;
  }

  async findByForum(id: string) {
    const comments = await this.repository.find({
      where: { forum: { id } },
      select: { owner: { name: true, id: true } },
      relations: { owner: true }
    });

    return comments;
  }

  async remove(id: number, userId: string) {
    const comment = await this.repository.findOneBy({ id });

    if (!comment || comment.owner.id !== userId)
      throw new NotFoundException('comment not found for this user');

    await this.repository.remove(comment);
  }
}
