import { IsArray, IsString } from 'class-validator';

export class CreateComplaintDto {
  @IsString()
  detail: string;

  @IsString()
  location: string;

  @IsArray()
  images: string[];

  @IsString()
  user_id: string;
}
