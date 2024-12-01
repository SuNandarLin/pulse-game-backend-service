import { IsNotEmpty } from 'class-validator';

export class CreateReplyDto {
  @IsNotEmpty({ message: 'Reply text is required' })
  reply_text: string;

  @IsNotEmpty({ message: 'Vote is required' })
  vote: number;

  user_id?: number;
  comment_id?: number;
}
