import { IsNotEmpty } from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty({ message: 'User id is required' })
  user_id: number;

  @IsNotEmpty({ message: 'Game id is required' })
  game_id: number;
}
