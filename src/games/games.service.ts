import { Injectable } from '@nestjs/common';
import { CreateGameDto, GameIdDto, RateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from '../prisma/prisma.service';
import fetch from "node-fetch";


@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async getRAWGgames(){
    const response = await fetch(`${process.env.RAWG_API}&page=2&page_size=5`);
    const RAWGgames = await response.json();
    return RAWGgames.results;
  }

  async findAll() {
    const pulseGames = await this.prisma.game.findMany();
    // const rawgGames = await this.getRAWGgames();

    // pulseGames.forEach(pulsegame => {
    //   rawgGames.forEach(rawggame => {
    //     if (pulsegame.id === rawggame.id) {
    //       rawggame.pulse_rating = pulsegame.pulse_rating;
    //       rawggame.posts = pulsegame.posts;
    //     }
    //   });
    // });

    return pulseGames;
  }

  async findAllUserRating() {
    return this.prisma.user_rating.findMany();
  }

  findOne(id: number) {
    return this.prisma.game.findUnique({
      where: { id }
    });
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return this.prisma.game.update({
      where: { id },
      data: updateGameDto
    });
  }

  async createIfNotExist(gameIdDto: GameIdDto) {
    const existingGame = await this.prisma.game.findUnique({ where: { id: gameIdDto.id}});
    if(!existingGame){
      const createdGame = await this.prisma.game.create({
        data: {
          id: gameIdDto.id,
          pulse_rating: 0,
        }
       });
       return createdGame;
    }
    return existingGame;
  }

  async createOrUpdateRating(user_id: number, game_id: number, starsCount: number){
    const userrating = await this.prisma.user_rating.findMany({
      where: {
        user_id,
        game_id
      }
    });
    if(userrating.length > 0){
      await this.prisma.user_rating.update({
        where: {
          id: userrating[0].id,
        },
        data: {
          ratings_count: starsCount
        }
      })
    }else if(userrating.length === 0){
      await this.prisma.user_rating.create({
        data: {
          user_id,
          game_id,
          ratings_count: starsCount
        }
      })
    }
  }

  async calculateAndUpdateRating(game_id: number){
    const userratings = await this.prisma.user_rating.findMany({
      where: {
        game_id
      }
    });

    const totalUserCount = userratings.length;
    let totalRatings = 0;
    for(const rating of userratings){
      totalRatings = totalRatings + rating.ratings_count;
    }

    const avgRating = (totalRatings/totalUserCount);

    const updatedGame = await this.prisma.game.update({
      where: { id: game_id },
      data: {
        pulse_rating: avgRating,
        rated_userscount: totalUserCount
      }
    });

    return updatedGame;

    // const game = await this.findOne(id);
    // const usersCount = game.rated_userscount;
    // const currentRating = game.pulse_rating;
    // const rating = ((currentRating * usersCount) + starsCount)/(usersCount + 1);
    // return rating;
  }

  async updateRating(game_id: number, rateGameDto: RateGameDto) {
    const game = await this.createIfNotExist({
      id: game_id
    });
    await this.createOrUpdateRating(rateGameDto.user_id, game_id, rateGameDto.stars_count);
    const updatedGame = await this.calculateAndUpdateRating(game_id);
    return updatedGame;
  }

}
