import { IsString, IsArray, ArrayMinSize, IsIn } from 'class-validator';

import { forumTags } from '../entities/tag.entity';

export class CreateForumDto {
  @IsString()
  subject: string;

  @IsArray()
  @ArrayMinSize(0)
  @IsIn(forumTags, { each: true })
  tags: string[];

  @IsString()
  content: string;

  userId: string;

  @IsString()
  cityId: string;
}
