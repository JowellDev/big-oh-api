import { IsString } from 'class-validator';

export class CommentArticleDto {
  @IsString()
  comment: string;
}
