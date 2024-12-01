import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto, GameIdDto, RateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('games')
@UseGuards(AuthGuard)
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  create(@Body() gameIdDto: GameIdDto) {
    return this.gamesService.createIfNotExist(gameIdDto);
  }

  @Get()
  findAll() {
    return this.gamesService.findAll();
  }

  @Get('userratings')
  findAllUserRatings() {
    return this.gamesService.findAllUserRating();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.update(+id, updateGameDto);
  }

  @Patch('rategame/:id')
  updateRating(@Param('id') id: string, @Body() rateGameDto: RateGameDto) {
    return this.gamesService.updateRating(+id, rateGameDto);
  }

}
