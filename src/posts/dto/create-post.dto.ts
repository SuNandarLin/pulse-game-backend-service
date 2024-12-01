import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: 'Post Title is required' })
  post_title: string;

  @IsNotEmpty({ message: 'Post Desc is required' })
  post_desc: string;

  upvote_count?: number;
  downvote_count?: number;
  upvoted_userids: number[];
  downvoted_userids: number[];

  user_id?: number;
  game_id?: number;
}
