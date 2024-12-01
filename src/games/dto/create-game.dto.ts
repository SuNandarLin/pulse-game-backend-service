import { IsNotEmpty } from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty({ message: 'Pulse rating is required' })
  pulse_rating: number;
}
export class RateGameDto {
  @IsNotEmpty({ message: 'Stars Count is required' })
  stars_count: number;

  @IsNotEmpty({ message: 'UserId is required' })
  user_id: number;
}

export class GameIdDto {
  id: number;
}
