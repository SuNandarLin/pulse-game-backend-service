import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'Comment text is required' })
  comment_text: string;

  @IsNotEmpty({ message: 'Vote is requred' })
  vote: number;

  user_id?: number;
  post_id?: number;
}
